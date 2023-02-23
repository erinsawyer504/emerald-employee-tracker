//linking inquirer
const inquirer = require('inquirer'); 
//linking mysql
const mysql = require('mysql2');
//linking console.table
const cTable = require('console.table'); 

require('dotenv').config();

//connecting to sql database
const db = mysql.createConnection(
    {
    host: 'localhost',
      // MySQL username,
    user: 'root',
      // MySQL password - password protected by .env
    password: process.env.DB_PASSWORD,
    database: 'employee_db'
    },
    console.log(`Connected to the courses_db database.`),
);

db.connect(function(error) {
    if(error) throw error;
    console.log("connected at " + db.threadID+"\n");
    promptUser();
})

//setting up inquirer prompts for the user to answer
const promptUser = () => {
    return inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'Please choose a task',
            choices: ['View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Update an employee manager',
                    'Quit']
        }
    ])
    .then((answers) => {
        const { choices } = answers;
        if (choices === "View all departments") {
            showDepartments();
        }

        if (choices === "View all roles") {
            showRoles();
        }

        if (choices === "View all employees") {
            showEmployees();
        }

        if (choices === "Add a department") {
            addDepartment();
        }

        if (choices === "Add a role") {
            addRole();
        }

        if (choices === "Add an employee") {
            addEmployee();
        }

        if (choices === "Update an employee role") {
            updateRole();
        }

        if (choices === "Update an employee- manager") {
            updateManager();
        }
-
        if (choices === "Quit") {
            db.end();
        }


    }) 
}

//defining functions to go with user choices

//function will show all departments (Department ID, and department name) when selected
function showDepartments(){
    console.log('Showing Departments: ');
    const mySql = `SELECT department.id AS id, department.name AS name FROM department`; 

    db.query(mySql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//function will show all roles when selected.  (will show role id, title, department name, and salary)
function showRoles(){
    console.log('Showing roles');

    const mySql = `SELECT role.id, role.title, department.name AS department, role.salary 
                FROM role
                INNER JOIN department ON role.department_id = department.id`;
    
    db.query(mySql, (err, rows) => {
        if (err) throw err; 
        console.table(rows); 
        promptUser();
    })
};

//function will show all employees when selected 
function showEmployees(){
    console.log('Showing employees'); 
    const mySql = `SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.name AS department,
                role.salary, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(mySql, (err, rows) => {
        if (err) throw err; 
        console.table(rows);
        promptUser();
    });
};

//function will add a new department to the DB
function addDepartment(){
    inquirer.prompt([
        {
            type: 'input', 
            name: 'addDept',
            message: "Please add a department",
        }
    ])
        .then(answer => {
        const mySql = `INSERT INTO department (name) VALUES (?)`;
        db.query(mySql, answer.addDept, (err, result) => {
            if (err) throw err;
            console.log('Added new Department:  ' + answer.addDept); 
    
            showDepartments();
        });
    });
};

//function adds a new role to the DB - user will need to input the role name, salary, and the deparment it belongs in
function addRole(){
    inquirer.prompt([
        {
            type: 'input', 
            name: 'role',
            message: "Enter the new role",
        },
        {
            type: 'input', 
            name: 'salary',
            message: "Enter the salary of this role",
        }
    ])
        .then(answer => {
            const roleSalary = [answer.role, answer.salary];
    
          // getting the dept from dept table
            const roleDb = `SELECT name, id FROM department`; 
    
            db.query(roleDb, (err, data) => {
            if (err) throw err; 
        
            const dept = data.map(({ name, id }) => ({ name: name, value: id }));
    
            inquirer.prompt([
            {
                type: 'list', 
                name: 'dept',
                message: "Select the correct department for this new role.",
                choices: dept
            }
            ])
                .then(deptSelect => {
                const dept = deptSelect.dept;
                roleSalary.push(dept);
    
                const newRole = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                db.query(newRole, roleSalary, (err, result) => {
                    if (err) throw err;
                    console.log('Added new Role:  ' + answer.role); 
    
                showRoles();
            });
        });
    });
    });
};

//function will add a new employee to DB.  User will enter first/last name, select the role, and assign a manager
function addEmployee(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'fistName',
            message: "Enter the employee's first name.",
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name.",
        }
    ])
        .then(answer => {
        const newEmployee = [answer.fistName, answer.lastName]
    
        // getting the roles from roles table
        const roleDb = `SELECT role.id, role.title FROM role`;
        db.query(roleDb, (err, data) => {
            if (err) throw err;  
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
    
        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: "Select the employee's role",
                choices: roles
            }
            ])
                .then(roleSelect => {
                    const role = roleSelect.role;
                    newEmployee.push(role);
    
                const managerDb = `SELECT * FROM employee`;
    
                db.query(managerDb, (err, data) => {
                    if (err) throw err;
    
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
    
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Select the employee's manager.",
                        choices: managers
                    }
                    ])
                        .then(managerSelect => {
                        const manager = managerSelect.manager;
                        newEmployee.push(manager);
    
                        const employee = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;
    
                        db.query(employee, newEmployee, (err, result) => {
                        if (err) throw err;
                        console.log(newEmployee + " has been added to the db.")
    
                        showEmployees();
                    });
                });
            });
            });
        });
    });
};

//function will update an employee role - it will have the user select a current employee from the list and assign it a new role
function updateRole(){
    const employeeDb = `SELECT * FROM employee`;

    db.query(employeeDb, (err, data) => {
        if (err) throw err; 
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: "Select an employee to update",
            choices: employees
        }
    ])
        .then(empSelect => {
            const employee = empSelect.name;
            const array = []; 
            array.push(employee);

          const roleDb = `SELECT * FROM role`;

        db.query(roleDb, (err, data) => {
            if (err) throw err; 

            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "Select the employee's new role",
                    choices: roles
                }
            ])
                .then(roleSelect => {
                    const role = roleSelect.role;
                    array.push(role); 
                let employee = array[0]
                    array[0] = role
                    array[1] = employee 
                
                const roleID = `UPDATE employee SET role_id = ? WHERE id = ?`;
                db.query(roleID, array, (err, result) => {
                    if (err) throw err;
                console.log("The employee has been updated.");
                
                showEmployees();
            });
        });
        });
    });
    });
};

//function to update employee managers
function updateManager(){
    const employeeDb = `SELECT * FROM employee`;

    db.query(employeeDb, (err, data) => {
    if (err) throw err; 

    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: "Select an employee to update",
            choices: employees
        }
    ])
        .then(empSelect => {
            const employee = empSelect.name;
            const array = []; 
            array.push(employee);

          const managerDb = `SELECT * FROM employee`;

            db.query(managerDb, (err, data) => {
            if (err) throw err; 

            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
    
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Select the employee's manager",
                        choices: managers
                    }
                ])
                    .then(managerSelect => {
                    const manager = managerSelect.manager;
                    array.push(manager); 
                
                    let employee = array[0]
                    array[0] = manager
                    array[1] = employee 

                    const updateManager = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    db.query(updateManager, array, (err, result) => {
                        if (err) throw err;
                        console.log("Employee's manager has been updated.");
                    
                    showEmployees();
            });
        });
        });
    });
    });
};

//function to view employees by manager
function viewManager(){};

//function to view employees by department
function viewDepartment(){};

//function to delete department, roles, and employees
function deleteStuff(){};

//function to view the total utilized budget of a department (the combined salaries of all employees in a dept)
function viewBudget(){};