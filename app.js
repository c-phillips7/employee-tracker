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
                case "VIEW":
                    console.log("view selected");
                    view();
                    break;
                case "UPDATE":
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
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "BACK"],
            name: "add"
        })
        .then(answer => {
            const choice = answer.add;
            switch (choice) {
                case "DEPARTMENT":
                    addDepartment();
                    break;
                case "ROLE":
                    addRole();
                    break;
                case "EMPLOYEE":
                    addEmployee()
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
            message: "Select what you would like to add: ",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "BACK"],
            name: "view"
        })
        .then(answer => {
            const choice = answer.view;
            switch (choice) {
                case "DEPARTMENT":
                    viewDepartment();
                    break;
                case "ROLE":
                    viewRole();
                    break;
                case "EMPLOYEE":
                    viewEmployee();
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
            name: "update",
            choices: ["ROLE", "BACK"]
        })
        .then(answer => {
            const choice = answer.update;
            switch (choice) {
                case "ROLE":
                    updateRole()
                    break;
                case "BACK":
                    init();
                    break;
            };
        });
};


// VIEW FUNCTIONS:

viewDepartment = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log("---------------------------------------");
        init();
    });
};


// ADD FUNCTIONS:

addDepartment = () => {
    inquirer
        .prompt({
            type: "Input",
            message: "Input the [NAME] of the department",
            name: "name"
        })
        .then(answer => {
            console.log("inserting department");
            const newDepartment = answer.name;
            const query = connection.query("INSERT INTO department SET ?", {
                name: newDepartment
            }, (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " department added!");
                // seperator to see between added department and new inquirer prompt
                console.log("-----------------------------------------");
                init();
            });
            console.log(query.sql);
        });
};


//TODO: add View all departments

// TODO: add View all Roles

// TODO: add View all Employees



// TODO: add Add new department

// TODO: add Add new role

// TODO: add Add new employee


// TODO: add Update an employee


// TODO: BONUS add DELETE options