const inquirer = require('inquirer');
const figlet = require('figlet');

const startTracker = () => {
  const intro = ['Welcome to', 'Employee Tracker!'];
  intro.forEach(lineString => console.log(figlet.textSync(lineString)));
  
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your name?'
      },
      {
        type: 'input',
        name: 'name2',
        message: 'What is your name again?'
      }
    ])
    .then(answers => {
      return answers;
    });
};

startTracker()
  .then(data => console.log(data));