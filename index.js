const inquirer = require('inquirer');
const figlet = require('figlet');

const startTracker = () => {
  const intro = ['Welcome to', 'Employee Tracker!'];
  intro.forEach(lineString => console.log(figlet.textSync(lineString)));
  
  return inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'name',
        message: 'Would you like to see the database?'
      }
    ])
    .then(answers => {
      return answers;
    });
};

async function getDatabase() {
  const mysql = require('mysql2/promise');
  require('dotenv').config();

  const db = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DB
  });
  const getAllQuery = `
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
  `
  try {
    const [rows, fields] = await db.query(getAllQuery);
    db.end();
    return rows;
  } catch (err) {
    console.log(err);
    return;
  }
};

startTracker()
  .then(getDatabase)
  .then(data => console.table(data));
  