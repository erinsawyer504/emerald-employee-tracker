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
    console.log(`Connected to the courses_db database.`)
);

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
                    'Update an employee role',]
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


    }) 
}

//defining functions to go with user choices
function showDepartments(){
    console.log('Showing Departments: ');
    const mySql = `SELECT department.id AS id, department.name AS department FROM department`; 

    connection.promise().query(mySql, (err, rows) => {
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
    
    connection.promise().query(mySql, (err, rows) => {
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

    connection.promise().query(mySql, (err, rows) => {
        if (err) throw err; 
        console.table(rows);
        promptUser();
    });
};
function addDepartment(){};
function addRole(){};
function addEmployee(){};
function updateRole(){};