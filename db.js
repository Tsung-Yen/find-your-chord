//連接mysql DB
require("dotenv").config();
let mysql = require("mysql");
const e = require("express");
let pool = mysql.createPool({
    host                : process.env["DB_HOST"],
    user                : process.env["DB_USER"],
    password            : process.env["DB_PASSWORD"],
    database            : process.env["DB_NAME"],
    waitForConnections  : true,
    connectionLimit     : 5
});
module.exports = pool;

