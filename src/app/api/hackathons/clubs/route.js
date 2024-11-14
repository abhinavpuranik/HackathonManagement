import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Aadi@157',
  database: 'HackathonManagement',
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  console.log(userId);
    const [rows] = await pool.query('SELECT name FROM hackathons where club_id=(?)',[userId]);
    console.log(rows);
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