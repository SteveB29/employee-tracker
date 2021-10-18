const inquirer = require('inquirer');
const figlet = require('figlet');

const addEmployee = require('./lib/add-queries/add-employee');
const addDepartment = require('./lib/add-queries/add-department');
const addRole = require('./lib/add-queries/add-role');
const viewData = require('./lib/view-queries');
const updateEmployeeRole = require('./lib/update-role');

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
    // filters answers based on 'group' to view, add, update or exit. Calls fuction based on answer group or specific answer
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
        }
      } else if (answer.action.slice(0,4) === 'Upda') {
        return updateEmployeeRole();
      } else {
        // if Exit is selected, displays goodbye and returns false to stop the application
        console.log(figlet.textSync('Goodbye!'));
        return false;
      }
    })
    // if true is returned, starts prompt over again, otherwise returns out of the function
    .then(res => {
      if (res) {
        startTracker();
      }
      return;
    });
};

// displays the intro method
introMessage();

// starts the program
startTracker();