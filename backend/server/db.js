const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "98630636",
    host: "localhost",
    port: 5432,
    database: "b_ride"
});

module.exports = pool;