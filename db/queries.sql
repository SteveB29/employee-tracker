SELECT title, role.id, department.name AS department, salary
FROM role
LEFT JOIN department
ON role.department_id = department.id;