const mysql = require('mysql2/promise');
require('dotenv').config();
const inquirer = require('inquirer');

const connectionObj = {
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DB
}

async function addDepartment() {
  return newDepartmentAdd()
    .then(data => {
      return validateDepartment(data);
    })
}

async function newDepartmentAdd() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'Enter the name of the new department',
      validate: newDept => {
        if (!newDept) {
          console.log('Please enter a department');
          return false;
        }
        return true;
      }
    }
  ])
    .then(data => {
      console.log(data);
      return data;
    });
}

async function validateDepartment(data) {

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`SELECT name FROM department;`);
    db.end();

    let deptCheck = rows.filter(dept => dept.name === data.department);
    if (deptCheck.length > 0) {
      console.log('This department already exists, please enter a valid department');
      return addDepartment();
    }
    return rows;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = addDepartment;
