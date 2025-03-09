// const Pool = require("pg").Pool;

// const pool = new Pool({
//     user: "postgres",
//     password: "98630636",
//     host: "localhost",
//     port: 5432,
//     database: "b_ride"
// });

// module.exports = pool;

require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "98630636",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "b_ride"
});

module.exports = pool;
