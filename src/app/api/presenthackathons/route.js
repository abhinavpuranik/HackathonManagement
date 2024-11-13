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

const [rows] = await pool.query(`
      SELECT h.*, COUNT(DISTINCT r.team_id) AS team_count
      FROM hackathons h
      LEFT JOIN registrations r ON h.hackathon_id = r.hackathon_id
      WHERE h.status = 1
      GROUP BY h.hackathon_id
    `);
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
