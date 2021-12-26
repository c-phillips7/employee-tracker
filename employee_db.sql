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

DESCRIBE employee_db.department;
   


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

DESCRIBE employee_db.role;

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

DESCRIBE employee_db.employee;
