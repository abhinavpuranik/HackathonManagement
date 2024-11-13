import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',  // Replace with your DB host
  user: 'root',       // Replace with your DB user
  password: 'Aadi@157', // Replace with your DB password
  database: 'HackathonManagement', // Replace with your database name
});

async function checkUsersAndTeam(users, teamName, hackathonName) {
  try {
    // Check if users are present in the users table
    console.log(JSON.stringify(users));
    const usernames = users.map(user => user.name);  // ["Aadishesh", "manish"]
    const [result] = await pool.query('SELECT check_users_exist(?) AS message', [JSON.stringify(usernames)]);
    console.log("jiii"+result[0].message);
  if (result[0].message.includes('not present')) {
    return { error: result[0].message };
  }

    // Check if the team name is unique in the hackathons table
    const [teamResult] = await pool.query(`
      SELECT COUNT(*) AS count
      FROM teams
      JOIN registrations ON teams.team_id = registrations.team_id
      JOIN hackathons ON registrations.hackathon_id = hackathons.hackathon_id
      WHERE teams.name = ? AND hackathons.name = ?
    `, [teamName, hackathonName]);

    
    if (teamResult[0].count > 0) {
      return { error: 'Team name is already taken for this hackathon' };
    }

    return { message: 'Checks passed' };
  } catch (error) {
    console.error('Error checking registration:', error);
    return { error: 'Internal Server Error' };
  }
}

export async function POST(request) {
  try {
    const { users, teamName, hackathonName } = await request.json();

    // Perform the checks
    const checkResult = await checkUsersAndTeam(users, teamName, hackathonName);

    if (checkResult.error) {
      return new Response(JSON.stringify({ error: checkResult.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: checkResult.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error checking registration:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}