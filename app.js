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

viewRole = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log("---------------------------------------");
        init();
    });
};

viewEmployee = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
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
            message: "Input the [NAME] of the department: ",
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

// Probably needs to be async so function to get department can run first
addRole = async () => {
    inquirer
        .prompt([{
                type: "Input",
                message: "Input the [TITLE] of the role: ",
                name: "title"
            },
            {
                type: "number",
                message: "Input the [SALARY] of the role: ",
                name: "salary"
            },
            {
                type: "list",
                message: "Select the [DEPARTMENT] of the role: ",
                choices: await departmentChoices(),
                name: "department"
            }
        ])
        .then(async answer => {
            console.log("inserting role");
            const newRole = answer.title;
            const newSalary = answer.salary;
            // Function was named departmentId, but for some reason this did not work. Only changing the function name fixed this issue...
            const departmentId = await departmentIdQuery(answer.department);
            const query = connection.query("INSERT INTO role SET ?", {
                title: newRole,
                salary: newSalary,
                department_id: departmentId
            }, (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " role added!");
                console.log("-----------------------------------------");
                init();
            });
            console.log(query.sql);
        });
};

addEmployee = async () => {
    inquirer
        .prompt([{
                type: "Input",
                message: "Input the employee's [FIRST] name: ",
                name: "firstName"
            },
            {
                type: "Input",
                message: "Input the employee's [LAST] name: ",
                name: "lastName"
            },
            {
                type: "list",
                message: "Select the [ROLE] of the employee: ",
                choices: await roleChoices(),
                // choices: ["1", "2", "3", "4", "5", "6", "7"],
                name: "role"
            },
            {
                type: "list",
                message: "Select the [MANAGER] of the employee (or NONE if there isn't one): ",
                // TODO: choices will need to be a function to get the managers available from SQL
                choices: await managerChoices(),
                // choices: ["1", "2", "3", "4", "5", "6", "7", "none"],
                name: "manager"
            }
        ])
        .then(async answer => {
            console.log("inserting employee");
            const firstName = answer.firstName;
            const lastName = answer.lastName;
            const roleId = await roleIdQuery(answer.role);
            // "null" as text option does not work, so if statement used
            // again needs to be replaced by a function to get managerId from SQL
            const managerId = answer.manager === "none" ? null : await managerIdQuery(answer.manager);
            const query = connection.query("INSERT INTO employee SET ?", {
                first_name: firstName,
                last_name: lastName,
                role_id: roleId,
                manager_id: managerId
            }, (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " employee added!");
                console.log("-----------------------------------------");
                init();
            });
            console.log(query.sql);
        });
};

// function to create an array of departments from db for inquirer question
departmentChoices = () => {
    return new Promise((resolve, reject) => {
        const departmentArr = [];
        connection.query("SELECT * FROM department", (err, res) => {
          if (err) throw err;
          res.forEach(department => {
            departmentArr.push(department.name);
            return err ? reject(err) : resolve(departmentArr);
          });
        });
      });
};

// Get Id from department selected in inquirer question
departmentIdQuery = department => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department WHERE name=?", [department], async (err, res) => {
            if (err) throw err;
            console.log(res[0].id);
            return err ? reject(err) : resolve(res[0].id);
        });
    });
};


// function to create an array of roles from db for inquirer question
roleChoices = () => {
    return new Promise((resolve, reject) => {
        const roleArr = [];
        connection.query("SELECT * FROM role", (err, res) => {
          if (err) throw err;
          res.forEach(role => {
            roleArr.push(role.title);
            return err ? reject(err) : resolve(roleArr);
          });
        });
      });
};


managerChoices = () => {
    return new Promise((resolve, reject) => {
        const managerArr = ["None"];
      connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        res.forEach(employee => {
          let fullName = employee.first_name + " " + employee.last_name;
          managerArr.push(fullName);
          return err ? reject(err) : resolve(managerArr);
        });
      });
    });
  };


// TODO: add Add new role

// TODO: add Add new employee


// TODO: add Update an employee


// TODO: BONUS add DELETE options