import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Aadi@157',
  database: 'HackathonManagement',
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const hackathonName = searchParams.get('hackathonName');

  if (!hackathonName) {
    return new Response(
      JSON.stringify({ message: 'Hackathon name is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }


  const [teams] = await pool.query(
    `SELECT teams.name AS team_name, 
            users.username,teams.google_slides,teams.github_link
     FROM teams
     JOIN team_members ON teams.team_id = team_members.team_id
     JOIN users ON team_members.user_id = users.id
     JOIN registrations ON registrations.team_id = teams.team_id
     JOIN hackathons h ON registrations.hackathon_id = h.hackathon_id
     WHERE h.name = ?`,
    [hackathonName]
  );
    return new Response(
      JSON.stringify({ teams }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );


}
