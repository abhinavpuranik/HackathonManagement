import mysql from 'mysql2/promise';

// Create a pool for efficient query management
const pool = mysql.createPool({
  host: 'localhost',  // Replace with your DB host
  user: 'root',        // Replace with your DB user
  password: 'Aadi@157', // Replace with your DB password
  database: 'HackathonManagement', // Replace with your database name
});
console.log(pool)
export default pool;
