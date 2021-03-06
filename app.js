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


// Starting screen of selections
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


// Inquierer options when add is selected
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

// Inquierer options when view is selected
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


// Inquierer options when update is selected
update = () => {
    inquirer
        .prompt({
            type: "list",
            message: "Select what you would like to update: ",
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

/////////////////
// VIEW FUNCTIONS:
/////////////////

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

////////////////
// ADD FUNCTIONS:
////////////////

addDepartment = () => {
    inquirer
        .prompt({
            type: "Input",
            message: "Input the [NAME] of the department: ",
            name: "name"
        })
        .then(answer => {
            console.log("Inserting department...");
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
            console.log("Inserting role...");
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
                name: "role"
            },
            {
                type: "list",
                message: "Select the [MANAGER] of the employee (or NONE if there isn't one): ",
                choices: await managerChoices(),
                name: "manager"
            }
        ])
        .then(async answer => {
            console.log("Inserting employee...");
            const firstName = answer.firstName;
            const lastName = answer.lastName;
            const roleId = await roleIdQuery(answer.role);
            // "null" as text option does not work, so if statement used
            const managerId = answer.manager === "None" ? null : await managerIdQuery(answer.manager);
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

///////////////////
// UPDATE FUNCTIONS
///////////////////

updateRole = async () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Select the [EMPLOYEE] you'd like to update: ",
                choices: await employeeChoices(),
                name: "employee"
            },
            {
                type: "list",
                message: "Select the employee's updated [ROLE]: ",
                choices: await roleChoices(),
                name: "role"
            }])
            .then(async answer => {
                console.log("Updating employee role");
                const employeeId = await managerIdQuery(answer.employee);
                const newRoleID = await roleIdQuery(answer.role);
                const query = connection.query("UPDATE employee SET ? WHERE id=?",
                  [{
                    role_id: newRoleID
                  },
                    employeeId], (err, res) => {
                      if (err) throw err;
                      console.log(res.affectedRows + " employee updated!")
                console.log("-----------------------------------------");

                      init();
                    });
                console.log(query.sql);
              });
}

////////////////////////
// ASYNC QUERY FUNCTIONS:
////////////////////////

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

roleIdQuery = role => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM role WHERE title=?", [role], async (err, res) => {
        if (err) throw err;
        return err ? reject(err) : resolve(res[0].id);
      });
    });
  };

managerChoices = () => {
    // NOTE: could possibly be narrowed down to only display valid options of managers, but could not figure out how
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

managerIdQuery = manager => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee WHERE CONCAT(first_name, " ", last_name)=?', [manager], async (err, res) => {
        if (err) throw err;
        return err ? reject(err) : resolve(res[0].id);
      });
    });
};

// Same as managerChoices but without the none in the array as an option
employeeChoices = () => {
    return new Promise((resolve, reject) => {
        const employeeArr = [];
      connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        res.forEach(employee => {
          let fullName = employee.first_name + " " + employee.last_name;
          employeeArr.push(fullName);
          return err ? reject(err) : resolve(employeeArr);
        });
      });
    });
  };


// TODO: BONUS add DELETE options