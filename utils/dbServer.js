import nano from 'nano';
import { couchConfig } from './config';

// Construct CouchDB URL for server-side only
function constructUrl() {
  const { host, username, password, database } = couchConfig;

  // Validate configuration
  if (!host || !username || !password || !database) {
    const missing = [];
    if (!host) missing.push('host');
    if (!username) missing.push('username');
    if (!password) missing.push('password');
    if (!database) missing.push('database');
    
    console.error('Missing CouchDB configuration:', missing.join(', '));
    throw new Error(`Missing required CouchDB configuration: ${missing.join(', ')}`);
  }

  try {
    // Ensure we're using the full domain URL
    const baseUrl = host.startsWith('http') ? host : `https://${host}`;
    
    // Construct URL with credentials
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    
    // Split the URL into parts
    const url = new URL(baseUrl);
    
    // Reconstruct the URL with auth
    const finalUrl = `${url.protocol}//${encodedUsername}:${encodedPassword}@${url.host}${url.pathname}`;
    
    console.log('CouchDB URL constructed:', finalUrl.replace(/\/\/.*?@/, '//<credentials>@'));
    return finalUrl;
  } catch (error) {
    console.error('Error constructing CouchDB URL:', error);
    throw new Error(`Invalid CouchDB URL configuration: ${error.message}`);
  }
}

// Create a connection with retries
async function createConnection(retries = 3, timeout = 30000) {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting database connection (attempt ${i + 1}/${retries})`);
      
      const url = constructUrl();
      const connection = nano({
        url,
        requestDefaults: {
          timeout: timeout,
          retry: true,
          retryDelay: 1000,
          retryErrors: true
        }
      });
      
      // Test connection
      const testDb = connection.use(couchConfig.database);
      const info = await testDb.info();
      
      console.log('Database connection successful:', {
        db_name: info.db_name,
        doc_count: info.doc_count,
        update_seq: info.update_seq
      });
      
      return connection;
    } catch (error) {
      lastError = error;
      console.error(`Connection attempt ${i + 1} failed:`, {
        error: error.message,
        type: error.type
      });
      
      if (i < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 5000); // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

let db = null;

try {
  const connection = await createConnection();
  db = connection.use(couchConfig.database);
} catch (error) {
  console.error('Failed to initialize CouchDB connection:', {
    error: error.message,
    type: error.type
  });
  throw error;
}

// Wrap database operations with retry logic
async function withRetry(operation, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Operation failed on attempt ${i + 1}:`, {
        error: error.message,
        type: error.type
      });
      
      if (i < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Export wrapped database operations
export const database = {
  async list(options) {
    return withRetry(() => db.list(options));
  },
  async get(id) {
    return withRetry(() => db.get(id));
  },
  async insert(doc) {
    return withRetry(() => db.insert(doc));
  }
};
