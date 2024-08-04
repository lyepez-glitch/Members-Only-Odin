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

    console.log("done", `postgresql://${process.env.ROLE}:${process.env.PASSWORD}@localhost:${process.env.PORT}/${process.env.DATABASE}`);
    let dropMessagesTable = `DROP TABLE IF EXISTS messages`;
    await client.query(dropMessagesTable);
    let dropUsersTable = `DROP TABLE IF EXISTS users;`;
    await client.query(dropUsersTable);
    let createUsers = `
    CREATE TABLE users(
       id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
       firstName VARCHAR(100),
       lastName VARCHAR(100),
       username VARCHAR(100),
       password VARCHAR(100),
       admin BOOLEAN DEFAULT FALSE,
       memberStatus BOOLEAN DEFAULT FALSE)`

    let createMessages = `CREATE TABLE messages(
       title VARCHAR(100),
       timestamp DATE,
       text TEXT,
       id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
       user_id INTEGER,
       createdBy VARCHAR(100))`
    await client.query(createMessages);
    await client.query(createUsers);






    try {
        await client.end();
    } catch (e) {
        console.log('err', e.message)
    }


}

main();