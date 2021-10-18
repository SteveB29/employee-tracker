const mysql = require('mysql2/promise');
require('dotenv').config();
const inquirer = require('inquirer');

const connectionObj = {
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DB
}

// Add employee function. First gets employees to add manager, then gets existing roles
// Then prompts the user for input and adds employee tp table based on input
async function addEmployee() {
  return getEmployeeNames()
    .then(data => {
      return getRoleNames(data);
    })
    .then((data) => {
      return employeeAddPrompt(data);
    })
    .then(data => {
      return addNewEmployee(data);
    })
};

// gets all the current employees to add a manager
async function getEmployeeNames() {

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`SELECT CONCAT(first_name,' ',last_name) as names, id FROM employee;`);
    db.end();
    return rows;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// gets all roles to add to employee
async function getRoleNames(emplyNames) {

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`SELECT title, id FROM role;`);
    db.end();
    return [rows, emplyNames];
  } catch (err) {
    console.log(err);
    return false;
  }
};

// takes in data and add new employee to table
async function addNewEmployee(newEmployeeData) {

  const params = [newEmployeeData.first_name,
    newEmployeeData.last_name,
    newEmployeeData.role,
    newEmployeeData.manager]

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?);`, params);
    db.end();
    console.log(`Employee Added!
    `);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// prompts the user for new emplyee data
async function employeeAddPrompt(dataArray) {

  // takes roles and employees from table pull and turns into array for user input
  let roleList = dataArray[0].map(roleNames => roleNames.title);
  let employeeList = dataArray[1].map(emplNames => emplNames.names);
  // adds none option to manager array
  employeeList.push('None');

  return inquirer.prompt([
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
      type: 'list',
      name: 'role',
      message: 'What is their role?',
      choices: roleList
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Who is their manager?',
      choices: employeeList
    }
  ])
    .then(data => {
      // transforms user input to id's for input to table, or null if no manager is selected
      if (data.manager === 'None') {
        data.manager = null;
      } else {
        let managerChoice = dataArray[1].filter(emplNames => emplNames.names === data.manager);
        data.manager = managerChoice[0].id;
      }
      let roleChoice = dataArray[0].filter(roleName => roleName.title === data.role);
      data.role = roleChoice[0].id;
      return data;
    })
};

module.exports = addEmployee;