import mysql from 'mysql2'
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

// Test the connection
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error
})

console.log('Connected to MySQL database')

export default pool
