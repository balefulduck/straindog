import { NextResponse } from 'next/server';

console.log('Test API Route: Loading');

export async function GET() {
  console.log('Test API Route: Called');
  return NextResponse.json({ test: 'working' });
}
