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
    .then(data => {
      if (!data) {
        return true;
      }
      return addToDatabase(data.department);
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
        } else {
          return true;
        }
      }
    }
  ])
    .then(data => {
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
      console.log(`This department is already in the database!
      `);
      return false;
    }
    return data;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function addToDatabase(department) {

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`INSERT INTO department (name)
    VALUES (?);`, department);
    db.end();
    console.log(`Department Added!
    `);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = addDepartment;
