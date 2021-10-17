const mysql = require('mysql2/promise');
require('dotenv').config();
const inquirer = require('inquirer');

const connectionObj = {
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DB
}

async function addEmployee() {
  return getEmployeeNames()
    .then(data => {
      return getDepartmentNames(data);
    })
    .then((data) => {
      return employeeAddPrompt(data);
    })
    .then(data => {
      return addNewEmployee(data);
    })
};

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

async function getDepartmentNames(emplyNames) {

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

async function employeeAddPrompt(dataArray) {

  let departmentList = dataArray[0].map(deptNames => deptNames.title);
  let employeeList = dataArray[1].map(emplNames => emplNames.names);
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
      message: 'What department are they in?',
      choices: departmentList
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Who is their manager?',
      choices: employeeList
    }
  ])
    .then(data => {
      if (data.manager === 'None') {
        data.manager = null;
      } else {
        let managerChoice = dataArray[1].filter(emplNames => emplNames.names === data.manager);
        data.manager = managerChoice[0].id;
      }
      let departmentChoince = dataArray[0].filter(roleName => roleName.title === data.role);
      data.role = departmentChoince[0].id;
      return data;
    })
};

module.exports = addEmployee;