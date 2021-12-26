DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;



-- department table
    -- id: INT PRIMARY KEY
    -- name: varchar (30) to hold department name
CREATE TABLE department(
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    name VARCHAR(30) NOT NULL
);

-- usefull to empty table for testing
TRUNCATE department;
INSERT INTO department(name) VALUES ("Manager");
INSERT INTO department(name) VALUES ("Sales");
INSERT INTO department(name) VALUES ("Engineer");
INSERT INTO department(name) VALUES ("Human Resouces");


DESCRIBE employee_db.department;
SELECT * FROM department;
   


-- role table
    -- id: INT PRIMARY KEY
    -- title: VARCHAR(30) to hold role title
    -- salary: DECIMAL to hold role salary
    -- department_id: INT
CREATE TABLE role(
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NOT NULL
);

INSERT INTO role(title, salary, department_id) VALUES ("General Manager", 100000 , 1);
INSERT INTO role(title, salary, department_id) VALUES ("Sales Lead", 60000 , 2);
INSERT INTO role(title, salary, department_id) VALUES ("Salesperson", 45000 , 2);
INSERT INTO role(title, salary, department_id) VALUES ("Head Engineer", 120000 , 3);
INSERT INTO role(title, salary, department_id) VALUES ("Software Engineer", 100000 , 3);
INSERT INTO role(title, salary, department_id) VALUES ("HR Lead", 55000 , 4);
INSERT INTO role(title, salary, department_id) VALUES ("Recruiter", 40000 , 4);

DESCRIBE employee_db.role;
SELECT * FROM role;


-- employee table
    -- id: INT PRIMARY KEY
    -- first_name: VARCHAR(30) to hold employee first name
    -- last_name: VARCHAR(30) to hold employee last name
    -- role_id: INT to hold reference to employee role
    -- manager_id: INT to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)

CREATE TABLE employee(
id INT AUTO_INCREMENT NOT NULL,
PRIMARY KEY (id),
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT
);

INSERT INTO employee(first_name, last_name, role_id) VALUES ("Stephen", "Carter", 1);
INSERT INTO employee(first_name, last_name, role_id) VALUES("Anna", "Lopez", 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Deborah", "Reed", 2, 2);
INSERT INTO employee(first_name, last_name, role_id) VALUES("Ryan", "Davis", 4);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Thomas", "DIaz", 5, 4);
INSERT INTO employee(first_name, last_name, role_id) VALUES("Bruce", "Harris", 6);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Emily", "Wood", 7, 6);

DESCRIBE employee_db.employee;
SELECT * FROM employee;