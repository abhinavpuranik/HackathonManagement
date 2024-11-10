import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'HackathonManagement',
});

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) AS userCount,
        (SELECT COUNT(*) FROM hackathons) AS hackathonCount,
        (SELECT COUNT(*) FROM registrations) AS registrationCount
    `);

    const { userCount, hackathonCount, registrationCount } = rows[0];

    return new Response(
      JSON.stringify({
        userCount,
        hackathonCount,
        registrationCount,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to retrieve statistics' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
