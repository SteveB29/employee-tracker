INSERT INTO department (name)
VALUES
  ('Faculty'),
  ('Staff'),
  ('Contractors');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Teacher', 52000, 1),
  ('Administrator', 48000, 2),
  ('Maintenance', 45000, 2),
  ('Food Services', 45000, 3),
  ('Department Head', 60000, 1),
  ('Adjunct Faculty', 30000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Steven', 'Bianchi', 5, NULL),
  ('Sean', 'Baker', 2, NULL),
  ('Mark', 'Van Houten', 3, NULL),
  ('Greg', 'McMillan', 4, NULL),
  ('Tom', 'Barbos', 4, NULL),
  ('Bill', 'Rhoades', 1, 1),
  ('Marlon', 'Deak', 1, 1),
  ('Jamie', 'Alling', 3, 3),
  ('Hannah', 'Lord', 2, 2),
  ('Pat', 'Fisher', 3, 3),
  ('Amber', 'Fletcher', 2, 2),
  ('Zoey', 'Brennan', 6, 1);
