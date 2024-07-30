const express = require('express')

require('dotenv').config();
const app = express()
const port = process.env.EPORT || 4000;
const path = require('path');
const bodyParser = require('body-parser')

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));











app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})