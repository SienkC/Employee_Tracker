// Includes packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2');


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
                // get all dept names and ids
                db.query('SELECT * FROM department', function (err, results) {
                    const names = [];
                    const ids = [];
                    for(let i = 0; i < results.length; i++) {
                        names.push(results[i].name);
                        ids.push(results[i].id);
                    }
                    // Prompt for name of role, salary, and choose dept
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
                        // get the index for the chosen department name
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
                // get all roles and their ids
                db.query('SELECT * FROM role', function (err, results) {
                    const roles = [];
                    const roleIds = [];
                    for(let i = 0; i < results.length; i++) {
                        roles.push(results[i].title);
                        roleIds.push(results[i].id);
                    }
                    // get possible managers
                    db.query('SELECT * FROM employee', function (err, results) {
                        const mngrs = ["None"];
                        const manIds = [null];
                        for(let i = 0; i < results.length; i++) {
                            mngrs.push(results[i].first_name.concat(" ", results[i].last_name));
                            manIds.push(results[i].id);
                        }

                        // prompt for fname, lname, choose role, choose manager (option for none)
                        inquirer
                        .prompt([
                            {
                                type: 'input',
                                message: 'What is their First Name?',
                                name: 'fName'
                            },
                            {
                                type: 'input',
                                message: 'What is their Last Name?',
                                name: 'lName'
                            },
                            {
                                type: 'list',
                                message: 'Choose their Role',
                                choices: roles,
                                name: 'role'
                            },
                            {
                                type: 'list',
                                message: 'Choose their Manager',
                                choices: mngrs,
                                name: 'mngr'
                            }
                        ])
                        .then((response) => {
                            // get the index for the role and manager
                            let roleIndex = roles.indexOf(response.role);
                            let manIndex = mngrs.indexOf(response.mngr);

                            if(response.fName == "" || response.lName == "") {
                                console.log("");
                                console.error("Can not add empty First Name or Last Name.");
                                console.log("");
                                // restart getAction
                                getAction();
                            }
                            else {
                                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                VALUES ("${response.fName}", "${response.lName}", "${roleIds[roleIndex]}", ${manIds[manIndex]});`, function (err, results) {
                                    console.log("");
                                    // let user know it was added
                                    console.table(`Added ${response.fName} ${response.lName} to the database`);
                                    console.log("");
                                    
                                    // restart getAction
                                    getAction();
                                });
                            }
                        });
                    });
                });
                break;
            case 'Update an Employee Role':
                // get all roles and their ids
                db.query('SELECT * FROM role', function (err, results) {
                    const roles = [];
                    const roleIds = [];
                    for(let i = 0; i < results.length; i++) {
                        roles.push(results[i].title);
                        roleIds.push(results[i].id);
                    }
                    // get all employees
                    db.query('SELECT * FROM employee', function (err, results) {
                        const emps = ["None"];
                        const empIds = [null];
                        for(let i = 0; i < results.length; i++) {
                            emps.push(results[i].first_name.concat(" ", results[i].last_name));
                            empIds.push(results[i].id);
                        }

                        // prompt for fname, lname, choose role, choose manager (option for none)
                        inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: 'Select Employee',
                                choices: emps,
                                name: 'emp'
                            },
                            {
                                type: 'list',
                                message: 'Choose their new Role',
                                choices: roles,
                                name: 'role'
                            }
                        ])
                        .then((response) => {
                            // get the index for the role and manager
                            let roleIndex = roles.indexOf(response.role);
                            let empIndex = emps.indexOf(response.emp);

                            db.query(`UPDATE employee
                            SET role_id = '${roleIds[roleIndex]}'
                            WHERE id = ${empIds[empIndex]};`, function (err, results) {
                                console.log("");
                                // let user know it was added
                                console.table(`Updated employee's role`);
                                console.log("");
                                
                                // restart getAction
                                getAction();
                            });
                            
                        });
                    });
                });
                break;
            default:
                // exit prompt
                process.exit(0);
        }
    });
}


