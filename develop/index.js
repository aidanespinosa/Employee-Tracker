const inquirer = require("inquirer");
require("dotenv").config();
const mysql = require("mysql2");
// const app = require('express');

//connect server to database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
});

const viewAllDepartments = function () {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM department", function (error, result) {
      resolve(result);
    });
  });
};

const viewAllRoles = function () {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM role", function (error, result) {
      resolve(result);
    });
  });
};

const viewAllEmployees = function () {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM employee", function (error, result) {
      resolve(result);
    });
  });
};
const prompts = async () => {
  const departments = await inquirer.prompt([
    {
      type: "list",
      message: "Please choose your desired directory",
      name: "directory",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update employee role",
      ],
    },
  ]);

  if (departments.directory === "add a department") {
    const departmentPrompt = await inquirer.prompt([
      {
        type: "input",
        message: "What department are you adding?",
        name: "department_name",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "Please input a value";
          }
        },
      },
    ]);
    console.log(departmentPrompt);
    const departmentAdd = function () {
      db.query(
        "INSERT INTO department (department_name) VALUES (?)",
        departmentPrompt.department_name,
        function (error) {
          if (error) throw error;
          console.log("department added");
        }
      );
    };
    departmentAdd();
  } else if (departments.directory === "view all departments") {
    const departments = await viewAllDepartments();
    console.table(departments);
  } else if (departments.directory === "add a role") {
    const depsView = await viewAllDepartments();
    const newRole = await inquirer.prompt([
      {
        type: "list",
        message: "What department does the role belong to:",
        name: "department",
        choices: depsView.map(function (element) {
          return { name: element.department_name, value: element.id };
        }),
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "Please input a value";
          }
        },
      },
      {
        type: "input",
        message: "Name of the new role?",
        name: "title",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "Please input a value";
          }
        },
      },
      {
        type: "input",
        message: "What is the salary of the new role:",
        name: "salary",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "Please input a value";
          }
        },
      },
    ]);
    const roleAdd = function () {
      db.query(
        "INSERT INTO role (department_id,title,salary) VALUES (?,?,?)",
        [newRole.department, newRole.title, newRole.salary],
        function (error) {
          if (error) throw error;
          console.log("role added");
        }
      );
    };
    roleAdd();
  } else if (departments.directory === "view all roles") {
    const roles = await viewAllRoles();
    console.table(roles);
  } else if (departments.directory === "add an employee") {
    const viewRoles = await viewAllRoles();
    const newEmployee = await inquirer.prompt([
      {
        type: "list",
        message: "which role is this employee being hired to?",
        name: "role",
        choices: viewRoles.map(function (element) {
          return { name: element.title, value: element.id };
        }),
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "Please input a value";
          }
        },
      },
      {
        type: "input",
        message: "what is the first name?",
        name: "first_name",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "Please input a value";
          }
        },
      },
      {
        type: "input",
        message: "what is the last name?",
        name: "last_name",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "Please input a value";
          }
        },
      },
    ]);
    const addEmployee = function () {
      db.query(
        "INSERT INTO employee (role_id,first_name,last_name) VALUES (?,?,?)",
        [newEmployee.role, newEmployee.first_name, newEmployee.last_name],
        function (error) {
          if (error) throw error;
          console.log("employee added");
        }
      );
    };
    addEmployee();
  } else if (departments.directory === "view all employees") {
    const employees = await viewAllEmployees();
    console.table(employees);
  } else if (departments.directory === "update employee role") {
    const viewRoles = await viewAllRoles();
    const viewEmployees = await viewAllEmployees();
    const updatePrompt = await inquirer.prompt([
      {
        type: "list",
        message: "Which employee would you like to update?",
        name: "employees",
        choices: viewEmployees.map(function (element) {
          return { name: element.last_name, value: element.id };
        }),
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "Please input a value";
          }
        },
      },
      {
        type: "list",
        message: "Which role do you want to assign the selected employee?",
        name: "roles",
        choices: viewRoles.map(function (element) {
          return { name: element.title, value: element.id };
        }),
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "Please input a value";
          }
        },
      },
    ]);
    const updateEmployee = function () {
      db.query(
        "UPDATE employee SET role_id =(?) WHERE id = (?)",
        [updatePrompt.roles, updatePrompt.employees],
        function (error) {
          if (error) throw error;
          console.log("employee updated");
        }
      );
    };
    updateEmployee();
  }
  prompts();
};

prompts();
