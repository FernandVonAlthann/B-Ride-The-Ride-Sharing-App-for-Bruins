// const Pool = require("pg").Pool;

// const pool = new Pool({
//     user: "postgres",
//     password: "98630636",
//     host: "localhost",
//     port: 5432,
//     database: "b_ride"
// });

// module.exports = pool;

const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, 
  });

pool.connect()
  .then(() => console.log(" Connected to PostgreSQL Database"))
  .catch(err => console.error(" Database Connection Error:", err.message));

module.exports = pool;
