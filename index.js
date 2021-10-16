const inquirer = require('inquirer');
const figlet = require('figlet');

const startTracker = () => {
  const intro = ['Welcome to', 'Employee Tracker!'];
  for(i=0; i < intro.length; i++) {
    figlet(intro[i], function(err, data) {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      console.log(data);
    });
  };
};

startTracker();