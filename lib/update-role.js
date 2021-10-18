const mysql = require('mysql2/promise');
require('dotenv').config();
const inquirer = require('inquirer');

const connectionObj = {
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DB
}

async function updateEmployeeRole() {
  return getEmployeeNames()
    .then(data => {
      console.log(data);
      return true;
    })
}

async function getEmployeeNames() {

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`SELECT CONCAT(first_name,' ',last_name) as names, id, role_id FROM employee;`);
    db.end();
    return rows;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = updateEmployeeRole;