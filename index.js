const inquirer = require('inquirer');
const figlet = require('figlet');
const queryObject = require('./utils/query-object')

// displayes intro message using figlet
const introMessage = () => {
  // each item in the array will have their own title row, added blank string at the end to add a space between title and prompt
  const intro = ['Welcome to', 'Employee Tracker!', ''];
  intro.forEach(lineString => console.log(figlet.textSync(lineString)));
}

const startTracker = () => {
  
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        choices: [
          'View all employees',
          'View employees by department',
          'View employees by manager',
          'View all roles',
          'View all departments',
          'Add an employee',
          'Remove an employee',
          'Add a role',
          'Remove a role',
          'Add a department',
          'Remove a department',
          'Update employee role',
          'Get total utilized budget',
          'Exit application'
        ]
      }
    ])
    .then(answers => {
      return answers;
    });
};

async function getDatabase(query) {
  const mysql = require('mysql2/promise');
  require('dotenv').config();

  const db = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DB
  });

  try {
    const [rows, fields] = await db.query(queryObject[query]);
    db.end();
    return rows;
  } catch (err) {
    console.log(err);
    return;
  }
};

introMessage();

startTracker()
  .then(choice => getDatabase(choice.action))
  .then(data => console.table(data));
