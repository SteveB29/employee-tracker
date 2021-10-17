const query = `
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

async function viewEmployees() {
  const mysql = require('mysql2/promise');
  require('dotenv').config();

  const db = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DB
  });

  try {
    const [rows, fields] = await db.query(query);
    db.end();
    console.table(rows);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = viewEmployees;