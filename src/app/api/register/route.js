import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',  // Replace with your DB host
  user: 'root',       // Replace with your DB user
  password: 'mysql',  // Replace with your DB password
  database: 'HackathonManagement', // Replace with your database name
});

export async function POST(request) {
  try {
    const { username, password, privilege } = await request.json();

    // Check if the user already exists
    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Username already exists' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert the new user into the database with privilege
    await pool.query(
      'INSERT INTO users (username, password, privilege) VALUES (?, ?, ?)',
      [username, password, privilege]
    );

    return new Response(
      JSON.stringify({ message: 'User registered successfully', username }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
