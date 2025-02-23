require('dotenv').config({ path: '.env' });
const nano = require('nano');
const seedData = require('../data/seeds.json');

// Import config
const { couchConfig } = require('./config');

async function migrateData() {
  const { host, username, password, port, database } = couchConfig;

  if (!host || !username || !password || !database) {
    throw new Error('Missing required environment variables');
  }

  try {
    // Create base URL object
    const urlObj = new URL(host);
    
    // Set credentials
    urlObj.username = encodeURIComponent(username);
    urlObj.password = encodeURIComponent(password);
    
    // Set port if specified
    if (port) {
      urlObj.port = port;
    }

    const url = urlObj.toString();
    console.log('Connecting to:', url.replace(/\/\/.*?@/, '//<credentials>@'));
    
    const couch = nano(url);
    const db = couch.use(database);
    
    // Add type field to each strain for easier querying
    const strainsWithType = seedData.map(strain => ({
      ...strain,
      type: 'strain',
      _id: `strain_${strain.id}` // Add CouchDB _id
    }));

    // Bulk insert all strains
    const result = await db.bulk({ docs: strainsWithType });
    console.log('Migration completed:', result);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

migrateData();
