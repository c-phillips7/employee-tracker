const dotenv = require('dotenv');
const mysql2 = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require('console.table');
const figlet = require('figlet');

// Set env so it can be accessed
const result = dotenv.config()
if (result.error) {
  throw result.error
}

// Create connection with express and mysql2
var connection = mysql2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASS,
    // password: "Waterisgood1!",
    database: "employee_db"
});

// run js loagic on connection
// TODO: fix the figlet text from being covered by the inquirer options
connection.connect(function (err) {
    if (err) throw err;
    figlet('Employee Tracker', function (err, data) {
        if (err) {
          console.log('Something went wrong...');
          return;
        };
        console.log(data);
    });
    console.log("connection working");
    init();
});


// basic function to test server
function init() {
    inquirer
        .prompt({
            type: "list",
            message: "Select an option: ",
            name: "startup",
            choices: ["ADD", "VIEW", "UPDATE", "EXIT"]
        })
        .then(answer => {
            const choice = answer.startup;
            switch (choice) {
                case "ADD":
                    console.log("add selected");
                    add();
                    break;
                case "View":
                    console.log("view selected");
                    view();
                    break;
                case "Update":
                    console.log("update selected");
                    update();
                    break;
                case "EXIT":
                    connection.end();
                    break;
            }
        })
        .catch(err => {
            console.log("Error: ", err)
        })
};

add = () => {
    inquirer
        .prompt({
            type: "list",
            message: "Select what you would like to add: ",
            name: "add",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "BACK"]
        })
        .then(answer => {
            const choice = answer.add; 
            switch (choice) {
                case "DEPARTMENT":
                    console.log("department chosen!!!");
                    // function to add a department
                    break;
                case "ROLE":
                    console.log("role chosen!!!");
                    // funciton to add a role
                    break;
                case "EMPLOYEE":
                    console.log("employee chosen");
                    // function to add an employee
                    break;
                case "BACK":
                    init();
                    break;
            };
        });
};


view = () => {
    inquirer
        .prompt({
            type: "list",
            message: "Select what you would like to view: ",
            name: "add",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "BACK"]
        })
        .then(answer => {
            const choice = answer.add; 
            switch (choice) {
                case "DEPARTMENT":
                    console.log("department chosen!!!");
                    // function to view a department
                    break;
                case "ROLE":
                    console.log("role chosen!!!");
                    // funciton to view a role
                    break;
                case "EMPLOYEE":
                    console.log("employee chosen");
                    // function to view an employee
                    break;
                case "BACK":
                    init();
                    break;
            };
        });
};

update = () => {
    inquirer
        .prompt({
            type: "list",
            message: "Select what you would like to view: ",
            name: "add",
            choices: ["ROLE", "BACK"]
        })
        .then(answer => {
            const choice = answer.add; 
            switch (choice) {
                case "ROLE":
                    console.log("role chosen!!!");
                    // funciton to update a role
                    break;
                case "BACK":
                    init();
                    break;
            };
        });
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


// TODO: BONUS add DELETE options