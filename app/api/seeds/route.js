import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const seedsFilePath = path.join(process.cwd(), 'data', 'seeds.json');

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// GET handler
export async function GET() {
  try {
    await ensureDataDirectory();
    const fileContent = await fs.readFile(seedsFilePath, 'utf-8');
    const seeds = JSON.parse(fileContent);
    return NextResponse.json(seeds);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, return empty array
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: 'Failed to read seeds' }, { status: 500 });
  }
}

// POST handler
export async function POST(request) {
  try {
    const seeds = await request.json();
    await ensureDataDirectory();
    await fs.writeFile(seedsFilePath, JSON.stringify(seeds, null, 2));
    return NextResponse.json({ message: 'Seeds updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update seeds' }, { status: 500 });
  }
}
