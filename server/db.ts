import mysql from 'mysql2/promise'
require('dotenv').config()

let pool: mysql.Pool | null = null

if (process.env.NODE_ENV !== 'production') {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })

  console.log('Connected to MySQL database')
} else {
  console.log('Not in production mode, skipping MySQL connection')
}

export default pool
