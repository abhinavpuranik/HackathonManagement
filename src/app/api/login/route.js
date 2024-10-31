import mysql from 'mysql2/promise';
const pool = mysql.createPool({
  host: 'localhost',  // Replace with your DB host
  user: 'root',        // Replace with your DB user
  password: 'Aadi@157', // Replace with your DB password
  database: 'HackathonManagement', // Replace with your database name
});
export async function POST(request) {
  try {
    const { username, password, userType } = await request.json();

    // Determine which table to query based on userType
    const table = userType === 'club' ? 'clubs' : 'users';

    const [rows] = await pool.query(
      `SELECT * FROM ${table} WHERE username = ? AND password=?`,
      [username,password]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = rows[0];
    if(rows.length>0)
    {
    return new Response(
      JSON.stringify({ message: 'Login successful', user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
