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
      return getRoleNames(data);
    })
    .then((data) => {
      return updateRolePrompt(data);
    })
    .then((data) => {
      return updateTable(data);
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

async function updateRolePrompt(data) {

  let roleObjArray = data[0];
  let rolesArray = roleObjArray.map(each => each.title);
  let employeeObjArray = data[1];
  let employeesArray = employeeObjArray.map(each => each.names);

  return inquirer.prompt([
    {
      type: 'list',
      name: 'employeeChoice',
      message: "Who's role do you want to update?",
      choices: employeesArray
    },
    {
      type: 'list',
      name: 'roleChoice',
      message: "What is their current role?",
      choices: rolesArray
    }
  ])
    .then(data => {
      let employeeChoiceObj = employeeObjArray.filter(choice => choice.names === data.employeeChoice);
      let roleChoiceObj = roleObjArray.filter(choice => choice.title === data.roleChoice);

      data.employeeChoice = employeeChoiceObj[0].id;
      data.roleChoice = roleChoiceObj[0].id;

      return data;
    });
}

async function updateTable(newRole) {

  const params = [newRole.roleChoice,
    newRole.employeeChoice]

  const db = await mysql.createConnection(connectionObj);

  try {
    const [rows, fields] = await db.query(`UPDATE employee
    SET role_id = ?
    WHERE id = ?`, params);
    db.end();
    console.log(`Role Updated!
    `);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = updateEmployeeRole;