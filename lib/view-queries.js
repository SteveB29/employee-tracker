const mysql = require('mysql2/promise');
require('dotenv').config();
const cTable = require('console.table');

const connectionObj = {
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DB
}

// query object to return specific query based on user choice
const queryObject = {
  'View all Employees':`
  SELECT employee.id,
        employee.first_name,
        employee.last_name,
        role.title AS title,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name,' ',manager.last_name) as manager
  FROM employee        
  LEFT JOIN role
  ON employee.role_id = role.id
  LEFT JOIN department
  ON role.department_id = department.id
  LEFT JOIN employee manager
  ON employee.manager_id = manager.id;
    `,

  'View all Departments':`SELECT id, name AS department FROM department`,


  'View all Roles': `
SELECT role.id, title as role, department.name AS department, salary
FROM role
LEFT JOIN department
ON role.department_id = department.id;
  `
}

// makes query based on user input and displays the result to console.table
async function viewData(viewSent) {

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(queryObject[viewSent]);
    db.end();
    console.table(rows);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = viewData;