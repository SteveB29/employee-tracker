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
  return getDepartmentNames()
    .then((data) => newRolePrompt(data))
    .then(data => {
      console.log(data);
      return true;
    })
}

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

async function newRolePrompt(departments) {
  console.log(departments);
  const departmentNameArray = departments.map(deptObj => deptObj.name);
  console.log(departmentNameArray);

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
      let deptChoice = departments.filter(choice => choice.name === data.department);
      data.department = deptChoice[0].id;
      data.salary = parseInt(data.salary);
      return data;
    });
}

module.exports = addRole;