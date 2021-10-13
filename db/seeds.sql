INSERT INTO department (name)
VALUES
  ('Faculty/Staff'),
  ('Administration'),
  ('Contractors');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Teacher', 52000, 1),
  ('Administrator', 48000, 1),
  ('Maintenance', 45000, 1),
  ('Food Services', 45000, 3),
  ('Department Head', 60000, 2),
  ('Adjunct Faculty', 30000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Steven', 'Bianchi', 2, NULL),
  ('Jamie', 'Alling', 1, NULL),
  ('Bill', 'Rhoades', 2, NULL),
  ('Sean', 'Baker', 6, NULL),
  ('Hannah', 'Lord', 2, NULL),
  ('Mark', 'Van Houten', 3, NULL),
  ('Pat', 'Fisher', 4, NULL),
  ('Marlon', 'Deak', 1, NULL),
  ('Amber', 'Fletcher', 4, NULL);
