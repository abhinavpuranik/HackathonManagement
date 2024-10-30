// /src/app/api/login/route.js
import mysql from 'mysql2/promise';

// Create a MySQL connection
const pool = mysql.createPool({
  host: 'localhost',  // Replace with your DB host
  user: 'root',        // Replace with your DB user
  password: 'Aadi@157', // Replace with your DB password
  database: 'HackathonManagement', // Replace with your database name
});

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    console.log("Received credentials:", username, password);

    // Query the database
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length > 0) {
      return new Response(JSON.stringify({ message: rows[0] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
