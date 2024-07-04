import pkg from 'pg';

const { Pool } = pkg;

// Note: The Pool connection allows the DB to automatically open a new connection for a new user/HTTP request. This means you don't have to wait for the previous SQL query to finish before starting a new one.
const client = new Pool({
  connectionString: process.env.DATABASE_URL,
  // max: 20, // Max 20 clientsim the pool
  // idleTimeoutMillis: 30000, // Close inactive clients after 30 seconds
  // connectionTimeoutMillis: 2000,
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

export default client;
