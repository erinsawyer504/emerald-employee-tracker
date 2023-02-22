//linking inquirer
const inquirer = require('inquirer'); 
//linking mysql
const mysql = require('mysql2');
//linking console.table
const cTable = require('console.table'); 

//connecting to sql database
const db = mysql.createConnection(
    {
    host: 'localhost',
      // MySQL username,
    user: 'root',
      // MySQL password
    password: 'password1',
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
        if (choices === "Quit") {
            db.end();
        }


    }) 
}

//defining functions to go with user choices
function showDepartments(){
    console.log('Showing Departments: ');
    const mySql = `SELECT department.id AS id, department.name AS name FROM department`; 

    db.query(mySql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};
function showRoles(){
    console.log('Showing roles');

    const mySql = `SELECT role.id, role.title, department.name AS department
                FROM role
                INNER JOIN department ON role.department_id = department.id`;
    
    db.query(mySql, (err, rows) => {
        if (err) throw err; 
        console.table(rows); 
        promptUser();
    })
};
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

function addRole(){};
function addEmployee(){};
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