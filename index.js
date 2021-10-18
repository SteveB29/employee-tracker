const inquirer = require('inquirer');
const figlet = require('figlet');
const addEmployee = require('./lib/add-queries/add-employee');
const addDepartment = require('./lib/add-queries/add-department');
const addRole = require('./lib/add-queries/add-role');
const viewData = require('./lib/view-queries');
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
        message: 'What would you like to do?',
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
    .then(answer => {
      if (answer.action.slice(0,4) === 'View') {
        return viewData(answer.action);
      } else if (answer.action.slice(0,4) === 'Add ') {
        if (answer.action === 'Add an Employee') {
          return addEmployee();
        } else if (answer.action === 'Add a Role') {
          return addRole();
        } else if (answer.action === 'Add a Department') {
          return addDepartment();
        } else {
          console.log('Sorry, that answer is not part of the options, please consult you dev');
          return false;
        }
      } else if (answer.action.slice(0,4) === 'Upda') {
        console.log('Update something');
        return true;
      } else {
        return false;
      }
    })
    .then(res => {
      if (res) {
        startTracker();
      }
      return;
    });
};

introMessage();

startTracker()
  .then(() => {
    console.log(figlet.textSync('Goodbye!'));
  });
