const mysql = require('mysql2/promise');
require('dotenv').config();
const cTable = require('console.table');

const addPrompts = require('./add-prompts');
const inquirer = require('inquirer');

const connectionObj = {
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DB
}

async function addEmployee() {
  return getEmployeeNames()
    .then((data) => {
      console.log(data[0]);
      console.log(data[1]);
      return employeeAddPrompt(data[1]);
    })
    .then(data => {
      console.log(data);
      return true;
    })
}

async function getEmployeeNames() {

  let allEmployees = [];
  let employeeSelection = [];

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`SELECT CONCAT(first_name,' ',last_name) as names, id FROM employee`);
    db.end();
    allEmployees = rows;
    employeeSelection = allEmployees.map(emplName => emplName.names);
    return [rows, employeeSelection];
  } catch (err) {
    console.log(err);
    return false;
  }
};

async function employeeAddPrompt(employeeData) {

  return inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Please enter the employees first name',
      validate: firstInput => {
        if (!firstInput) {
          console.log('Please enter their first name');
          return false;
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Please enter the employees last name',
      validate: lastInput => {
        if (!lastInput) {
          console.log('Please enter their last name');
          return false;
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'role',
      message: 'Please enter the employees role',
    },
    {
      type: 'list',
      name: 'manager_name',
      choices: employeeData
    }
  ])
};

module.exports = {addEmployee};