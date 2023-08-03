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

// prompt for action
function getAction (){
    inquirer

    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role'],
            default: 'View All Departments',
            name: 'action'
        }
    ])
    .then((response) => {
        // test
        console.log(response.action + 'hello?');

        switch(response.action) {
            case 'View All Departments':
                break; 
            case 'View All Roles':
                break;
            case 'View All Employees':
                break;
            case 'Add a Department':
                break;
            case 'Add a Role':
                break;
            case 'Add an Employee':
                break;
            case 'Update an Employee Role':
                break;
            default:
                console.log('Something went wrong. Try running the prompt again!');
        }
    });
}

getAction();
