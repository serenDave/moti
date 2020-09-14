const dotenv = require('dotenv');
const util = require('util');
const mysql = require('mysql');

dotenv.config({ path: './config.env' });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_USERNAME,
    connectionLimit: 10,
    connectTimeout: 10000,
    acquireTimeout: 10000
};

// Connect DB
const pool = mysql.createPool(dbConfig);
pool.query = util.promisify(pool.query);

module.exports = pool;