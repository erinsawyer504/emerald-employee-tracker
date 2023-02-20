INSERT INTO department (name)
VALUES ('IT'), 
        ('Customer Service'), 
        ('Human Resources'), 
        ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ('Help Desk Associate', 40000, 1),
        ('Software Engineer', 100000, 1),
        ('Customer Service Rep', 30000, 2),
        ('Customer Serice Manager', 50000, 2),
        ('Human Resources Agent', 65000, 3),
        ('Human Resources Manager', 90000, 3),
        ('Sales Associate', 70000, 4),
        ('Sales Manager', 85000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES('Stefan', 'Salvatore', 12),
        ('Elena', 'Gilbert', 14),
        ('Tyler', 'Lockwood', 9),
        ('Matt', 'Donovan', 13),
        ('Caroline', 'Forbes', 15),
        ('Katherine', 'Pierce', 10),
        ('Bonnie', 'Bennett', 11),
        ('Klaus', 'Mikealson', 16);
