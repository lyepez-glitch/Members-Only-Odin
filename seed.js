// // #! /usr/bin/env node
require('dotenv').config();
// const axios = require('axios');
const { Client } = require("pg");
// const db = require('./db/categoryQueries');
let SQL = '';

async function main() {
    //     console.log("seeding...");
    const client = new Client({
        connectionString: `postgresql://${process.env.ROLE}:${process.env.PASSWORD}@localhost:${process.env.PORT}/${process.env.DATABASE}`,
    });
    await client.connect();

    console.log("done");
    let dropUsersTable = `DROP TABLE IF EXISTS users;`;
    await client.query(dropUsersTable);
    let createUsers = `
    CREATE TABLE users(
       id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
       firstName VARCHAR(100),
       lastName VARCHAR(100),
       username VARCHAR(100),
       password VARCHAR(100),
       memberStatus VARCHAR(100)
     )`
    await client.query(createUsers);

    let createMessages = `CREATE TABLE messages(
       title VARCHAR(100),
       timestamp DATE,
       text TEXT,
       user_id INTEGER,
       createdBy VARCHAR(100),
       FOREIGN KEY (user_id)
       REFERENCES users(id)
       ON DELETE CASCADE
     )`
    await client.query(createMessages);

    //             cat = await client.query(qry, [product.category]);
    //     try {

    //         const response = await axios.get('https://dummyjson.com/products?limit=100');

    //         const products = response.data["products"];


    //         const queries = products.map(async(product) => {
    //             const foundCat = await db.findCatByName(product.category);


    //             let cat;
    //             let cat_id;

    //             let qry = `SELECT id FROM categories WHERE name=$1`

    //             cat = await client.query(qry, [product.category]);

    //             if (cat.rows.length === 0) {
    //                 qry = `INSERT INTO categories(name)
    //                    VALUES ($1) RETURNING id;`

    //                 cat = await client.query(qry, [product.category]);
    //                 cat_id = cat.rows[0].id;

    //             } else {

    //                 cat_id = cat.rows[0].id;

    //             }
    //             console.log(' cat.rows', cat.rows)


    //             const product_name = product.title;
    //             const price = parseInt(product.price) || 0;

    //             qry =
    //                 `INSERT INTO products(name, price, category)
    //                 VALUES
    //                     ($1,$2,$3) RETURNING id;
    //                  `
    //             vals = [product_name, price, product.category]
    //             await client.query(qry, vals);

    //         })

    //         await Promise.all(queries);




    //     } catch (error) {
    //         console.error('Error fetching products: ', error);
    //     } finally {
    //         try {
    //             await client.end();
    //         } catch (e) {
    //             console.log('err', e.message)
    //         }

    //     }
}

main();