import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'HackathonManagement',
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
  }

  try {
    // Step 1: Fetch all team_ids for the given user_id
    const [teamIds] = await pool.query(
      `SELECT team_id FROM team_members WHERE user_id = ?`,
      [userId]
    );

    // Check if the user is part of any teams
    if (teamIds.length === 0) {
      return new Response(JSON.stringify({ hackathons: [] }), { status: 200 }); // No teams found
    }

    // Extract the team IDs for the SQL query
    const teamIdsArray = teamIds.map(team => team.team_id);

    // Step 2: Fetch hackathon names based on the team_ids
    const [registrations] = await pool.query(
      `SELECT hackathon_name FROM registrations WHERE team_id IN (?)`,
      [teamIdsArray]
    );

    // Return the hackathon names
    return new Response(JSON.stringify({ hackathons: registrations }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching user hackathons:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
