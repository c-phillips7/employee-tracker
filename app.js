const dotenv = require('dotenv');
const mysql2 = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require('console.table');

var connection = mysql2.createConnection({
    host: "localhost",
    port: 3001,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});