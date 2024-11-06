import mysql from 'mysql2/promise';
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Aadi@157',
  database: 'HackathonManagement',
});

export async function POST(request) {
  try {
    const { username, password, userType } = await request.json();

    // Query the `users` table for the user based on username, password, and privilege
    const [rows] = await pool.query(
      `SELECT * FROM ${userType} WHERE username = ? AND password = ?`,
      [username, password, userType]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ message: 'User not found or privilege does not match' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = rows[0];
    return new Response(
      JSON.stringify({ message: 'Login successful', userId: user.id, username: user.username }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

