INSERT INTO department (name)
VALUES ('IT'), 
        ('Customer Service'), 
        ('Human Resources'), 
        ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ('Help Desk Associate', 40000, 1),
        ('IT Manager', 100000, 1),
        ('Customer Service Rep', 30000, 2),
        ('Customer Serice Manager', 50000, 2),
        ('Human Resources Agent', 65000, 3),
        ('Human Resources Manager', 90000, 3),
        ('Sales Associate', 70000, 4),
        ('Sales Manager', 85000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES('Stefan', 'Salvatore', 9, 2),
        ('Elena', 'Gilbert', 10, null),
        ('Tyler', 'Lockwood', 11, 4),
        ('Matt', 'Donovan', 12, null),
        ('Caroline', 'Forbes', 13, 6),
        ('Katherine', 'Pierce', 14, null),
        ('Bonnie', 'Bennett', 15, 8),
        ('Klaus', 'Mikealson', 16, null);
