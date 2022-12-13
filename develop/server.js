require("dotenv").config();
const mysql = require("mysql2");

//connect server to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
});

//calling data from specific database
function employeeData() {
  return new Promise((resolve) => {
    connection.query("select * from employee_tracker", function (err, results) {
      resolve(results);
    });
  });
}
