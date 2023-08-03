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
                db.query(`SELECT role.id, role.title, department.name AS department, role.salary
                FROM role
                JOIN department
                ON role.department_id = department.id 
                ORDER BY role.id`, function (err, results) {
                    console.log("\n");
                    console.table(results);
                    console.log("");
                    // restart getAction
                    getAction();
                });
                break;
            case 'View All Employees':
                // display table for employees with role and manager incl
                db.query(`SELECT T1.id, T1.first_name ,T1.last_name  , T1.title , T2.department, T1.salary,  T1.manager
                FROM (SELECT E1.id, E1.role_id ,E1.first_name ,E1.last_name  , role.title , role.salary, CONCAT(E2.first_name, ' ', E2.last_name) AS manager
	                FROM employee E1
	                left JOIN role
	                ON E1.role_id = role.id
	                left JOIN employee E2
	                ON E1.manager_id = E2.id
	                ORDER BY E1.id) T1
                
                left JOIN (SELECT  role.id ,role.title , department.name AS department
	                FROM role
	                inner JOIN department
	                ON role.department_id = department.id) T2
                ON T1.role_id = T2.id
                ORDER BY T1.id`, function (err, results) {
                    console.log("\n");
                    console.table(results);
                    console.log("");
                    // restart getAction
                    getAction();
                });
                break;
            case 'Add a Department':
                // Prompt for name of dept then save
                inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'What is the Department name?',
                        name: 'depName'
                    }
                ])
                .then((response) => {
                    if(response.depName == "") {
                        console.log("");
                        console.error("Can not add empty Department name.");
                        console.log("");
                        // restart getAction
                        getAction();
                    }
                    else {
                        db.query(`INSERT INTO department (name)
                        VALUES ("${response.depName}");`, function (err, results) {
                            console.log("");
                            // let user know it was added
                            console.table(`Added ${response.depName} to the database`);
                            console.log("");
                            
                            // restart getAction
                            getAction();
                        });
                    }
                });
                break;
            case 'Add a Role':
                // Prompt for name of role, salary, and choose dept
                // log "Added --- to the database"

                // get all dept names and ids
                db.query('SELECT * FROM department', function (err, results) {
                    console.log(results[0].name);
                    const names = [];
                    const ids = [];
                    for(let i = 0; i < results.length; i++) {
                        names.push(results[i].name);
                        ids.push(results[i].id);
                    }

                    inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: 'What is the Role name?',
                            name: 'rName'
                        },
                        {
                            type: 'input',
                            message: 'What is the Salary for this role?',
                            name: 'rSal'
                        },
                        {
                            type: 'list',
                            message: 'Choose the Department this Role falls under',
                            choices: names,
                            name: 'dept'
                        }
                    ])
                    .then((response) => {
                        // get the index for the department name
                        let index = names.indexOf(response.dept);

                        if(response.rName == "") {
                            console.log("");
                            console.error("Can not add empty Role name.");
                            console.log("");
                            // restart getAction
                            getAction();
                        }
                        else {
                            db.query(`INSERT INTO role (title, salary, department_id)
                            VALUES ("${response.rName}", "${response.rSal}", "${ids[index]}");`, function (err, results) {
                                console.log("");
                                // let user know it was added
                                console.table(`Added ${response.rName} to the database`);
                                console.log("");
                                
                                // restart getAction
                                getAction();
                            });
                        }
                    });
                });
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


