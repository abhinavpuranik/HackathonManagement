import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',  // Replace with your DB host
    user: 'root',        // Replace with your DB user
    password: 'Aadi@157', // Replace with your DB password
    database: 'HackathonManagement', // Replace with your database name
  });

export async function GET(request) {
  try {
    await pool.query('CALL UpdateHackathonStatus()');

    const [rows] = await pool.query('SELECT * FROM hackathons where status=1');

    return new Response(
      JSON.stringify({ hackathons: rows }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
