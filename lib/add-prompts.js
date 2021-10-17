const mysql = require('mysql2/promise');
require('dotenv').config();
const cTable = require('console.table');

const addPrompts = {
  'Add an Employee': [
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
      validate: roleInput => {
        if (!roleInput) {
          console.log('Please enter their role');
          return false;
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'manager_first',
      message: 'Please enter their managers full name',
      validate: managerInput => {
        if (!managerInput) {
          console.log('Please enter a valid manager');
          return false;
        } else {
          return true;
        }
      }
    }
  ],

  'Add a Role':[
    {
      type: 'input',
      name: 'name',
      message: 'Please enter the role name',
      validate: roleInput => {
        if (!roleInput) {
          console.log('Please enter a valid role name');
          return false;
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: "Please enter the role's salary",
      validate: salaryInput => {
        if (!salaryInput) {
          console.log('Please enter a valid salary');
          return false;
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'department',
      message: 'Please enter the department the role belongs to',
      validate: roleInput => {
        if (!roleInput) {
          console.log('Please enter a valid department');
          return false;
        } else {
          return true;
        }
      }
    }
  ],

  'Add a Department':[
    {
      type: 'input',
      name: 'department',
      message: 'Please enter the department name',
      validate: deptInput => {
        if (!deptInput) {
          console.log('Please enter a valid department');
          return false;
        } else {
          return true;
        }
      }
    }
  ]
}

async function pullPossibleManagers() {

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`SELECT CONCAT(first_name,' ',last_name) as names FROM employee`);
    db.end();
    console.log(rows);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = addPrompts;