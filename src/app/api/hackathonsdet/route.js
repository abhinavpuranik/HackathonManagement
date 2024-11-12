import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',  // Replace with your DB host
  user: 'root',       // Replace with your DB user
  password: 'Aadi@157', // Replace with your DB password
  database: 'HackathonManagement', // Replace with your database name
});

export async function POST(request) {
    const { id } = await request.json();
  console.warn("hiiggi"+id);
      const [rows] = await pool.query('SELECT * FROM hackathons where hackathon_id=?',[id]);
      if (rows.length === 0) {
        return new Response( JSON.stringify({ message: "NO" }),
        { status: 400, headers: { 'Content-Type': 'application/json' }});
      }
      return new Response( JSON.stringify({ hackathon: rows[0] }),
        { status: 200, headers: { 'Content-Type': 'application/json' }});
}