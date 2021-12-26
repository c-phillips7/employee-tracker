const dotenv = require('dotenv');
const mysql2 = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require('console.table');
const figlet = require('figlet');

// Create connection with express and mysql2
var connection = mysql2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASS,
    database: "employee_db"
});

// run js loagic on connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connection working");
    init();
});


// basic function to test server
function init() {
    inquirer
        .prompt(test)
        .then(console.log("inquirer ran"))
        .catch(err => {
            console.log("Error: ", err)
        })
};

// basic question to test inquirer
const test = [{
        type: "input",
        message: "Is this working: ",
        name: "test",
    }];

//TODO: add View all departments

// TODO: add View all Roles

// TODO: add View all Employees



// TODO: add Add new department

// TODO: add Add new role

// TODO: add Add new employee

// TODO: add Update an employee