// Configuration for CouchDB connection
// Server-side only configuration
export const couchConfig = {
  host: process.env.VITE_COUCHDB_HOST,
  username: process.env.VITE_COUCHDB_USERNAME,
  password: process.env.VITE_COUCHDB_PASSWORD,
  port: process.env.VITE_COUCHDB_PORT,
  database: process.env.VITE_COUCHDB_DB
};
