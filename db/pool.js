// product category reviews brands

// a category can have multiple products

// a product can have multiple reviews

// a brand can have multiple products


require('dotenv').config();
const { Pool } = require("pg");


module.exports = new Pool({
    host: process.env.HOST,
    user: process.env.ROLE,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT || 4000
});