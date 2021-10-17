const inquirer = require('inquirer');
const figlet = require('figlet');
const queryObject = require('./utils/query-object');
// const addQueries = require('./lib/add-queries');
const viewEmployees = require('./lib/view-queries');
// const updateQueries = require('./lib/update-queries');

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
          'View all Employees',
          'View all Departments',
          'View all Roles',
          'Add an Employee',
          'Add a Role',
          'Add a Department',
          'Update employee role',
          'Exit application'
        ]
      }
    ])
    .then(answers => {
      if (answers.action.slice(0,4) === 'View') {
        return viewEmployees();
      } else if (answers.action.slice(0,4) === 'Add ') {
        console.log('Add something');
        return true;
      } else if (answers.action.slice(0,4) === 'Upda') {
        console.log('Update something');
        return true;
      } else {
        console.log('Goodbye!');
        return false;
      }
    })
    .then((res) => {
      if (res) {
        startTracker();
      }
      return;
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
    const [rows, fields] = await db.query(queryObject[query], '');
    db.end();
    return rows;
  } catch (err) {
    console.log(err);
    return;
  }
};

introMessage();

startTracker()
  .then(() => {
    console.log('Thank You!');
  });
