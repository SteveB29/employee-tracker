const mysql = require('mysql2/promise');
require('dotenv').config();
const inquirer = require('inquirer');

const connectionObj = {
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DB
}

// gets all the department names, then asks for what role user whats to add, checks if user role already exists
// if exists => returns out of the function, otherwise adds the role to the database
async function addRole() {
  return getDepartmentNames()
    .then((data) => newRolePrompt(data))
    .then((data) => validateRole(data))
    .then(data => {
      if (!data) {
        return true;
      }
      return addToDatabase(data);
    })
}

// gets the department names
async function getDepartmentNames() {

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`SELECT * FROM department;`);
    db.end();
    return rows;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// takes the existing roles and user input and checks if user input already exists.
// Notifies user if it does and returns false, otherwise returns data
async function validateRole(data) {

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`SELECT title FROM role;`);
    db.end();

    let roleCheck = rows.filter(role => role.title === data.role);
    if (roleCheck.length > 0) {
      console.log(`This role is already in the database!
      `);
      return false;
    }
    return data;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Takes user input and adds role to table
async function addToDatabase(newRole) {

  const params = [newRole.role,
  newRole.salary,
  newRole.department]

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?);`, params);
    db.end();
    console.log(`Role Added!
    `);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// prompts the user for role to add and what department to add it to
async function newRolePrompt(departments) {
  // takes department table info and turns into array for inquirer user
  const departmentNameArray = departments.map(deptObj => deptObj.name);

  return inquirer.prompt([
    {
      type: 'input',
      name: 'role',
      message: 'Enter the name of the new role',
      validate: newRole => {
        if (!newRole) {
          console.log('Please enter a new role');
          return false;
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: "Enter the role's salary",
      validate: newSalary => {
        if (!newSalary) {
          console.log('Please enter a salary');
          return false;
        } else if (!parseInt(newSalary)) {
          console.log('Please enter a number')
          return false;
        } else {
          return true;
        }
      }
    },
    {
      type: 'list',
      name: 'department',
      message: 'What department does this role belong to?',
      choices: departmentNameArray
    }
  ])
    .then(data => {
      // transforms user input to id's for input to table, turns salary data into integer (inquirer number input is buggy)
      let deptChoice = departments.filter(choice => choice.name === data.department);
      data.department = deptChoice[0].id;
      data.salary = parseInt(data.salary);
      return data;
    });
}

module.exports = addRole;