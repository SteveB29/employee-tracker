const mysql = require('mysql2/promise');
require('dotenv').config();
const inquirer = require('inquirer');

const connectionObj = {
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DB
}

async function addRole() {
  return newRolePrompt()
    .then(data => {
      console.log(data);
      return true;
    })
}

async function newRolePrompt() {
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
    }
  ])
    .then(data => {
      data.salary = parseInt(data.salary);
      return data;
    });
}

module.exports = addRole;