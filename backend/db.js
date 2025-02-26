const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         // Default PostgreSQL user
  host: 'localhost',        // Since it's running in Docker on local machine
  database: 'postgres',     // Change if you specified a different database name
  password: '1234',         // Use the password you set in Docker
  port: 5432,               // Default PostgreSQL port
});


pool.connect()
  .then(() => console.log('Connected to PostgreSQL 🎉'))
  .catch(err => console.error('Connection error ❌', err));

module.exports = pool;
