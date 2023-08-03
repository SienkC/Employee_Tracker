// Includes packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2');

// options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 


// Connect to employees database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

// Start prompt
getAction();


// prompt for action
function getAction (){
    inquirer

    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit'],
            default: 'View All Departments',
            name: 'action'
        }
    ])
    .then((response) => {
        switch(response.action) {
            case 'View All Departments':
                // display table for all depts
                db.query('SELECT * FROM department', function (err, results) {
                    console.log("\n");
                    console.table(results);
                    console.log("");
                    // restart getAction
                    getAction();
                });
                break; 
            case 'View All Roles':
                // display table for roles with dept included
                // restart getAction
                break;
            case 'View All Employees':
                // display table for employees with role and manager incl
                // restart getAction
                break;
            case 'Add a Department':
                // Prompt for name of dept then save
                // log "Added --- to the database"
                // restart getAction
                break;
            case 'Add a Role':
                // Prompt for name of role, salary, and choose dept
                // log "Added --- to the database"
                // restart getAction
                break;
            case 'Add an Employee':
                // prompt for fname, lname, choose role, choose manager (option for none)
                // log "Added --- to the database"
                // restart getAction
                break;
            case 'Update an Employee Role':
                // select employee, select role
                // log "Updated employee's role"
                // restart getAction
                break;
            default:
                // exit prompt
                process.exit(0);
        }
    });
}


