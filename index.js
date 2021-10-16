const inquirer = require('inquirer');
const figlet = require('figlet');
const db = require('./db/connection')

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

function getDatabase() {
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
  db.query(getAllQuery, function(err, res) {
    if (err) {
      console.log(`Something went wrond: ${err}`);
      return;
    }
    console.table(res);
  });
};

// startTracker()
//   .then(getDatabase)
//   .then(res => console.table(res));
getDatabase();