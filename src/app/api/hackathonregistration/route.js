import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'HackathonManagement',
});

export async function POST(request) {
  try {
    const { teamName, hackathonName, projectName, googleSlides, githubLink, users } = await request.json();

    // Check if the hackathon exists and retrieve its hackathon_id
    const [hackathonRows] = await pool.query('SELECT hackathon_id FROM hackathons WHERE name = ?', [hackathonName]);

    let hack_id = 0;
    // If hackathon does not exist, insert it
    if (hackathonRows.length === 0) {
      const [q] = await pool.query('INSERT INTO hackathons (name) VALUES (?)', [hackathonName]);
      hack_id = q.insertId;
    } else {
      hack_id = hackathonRows[0].hackathon_id;
    }

    console.log('Hackathon ID:', hack_id);

    // Insert the team into the `teams` table
    const [registrationResult] = await pool.query(
      'INSERT INTO teams (name, project_name, google_slides, github_link) VALUES (?, ?, ?, ?)',
      [teamName, projectName, googleSlides, githubLink]
    );
    const teamId = registrationResult.insertId;

    // Insert the registration details into the `registrations` table
    await pool.query(
      'INSERT INTO registrations (team_id, hackathon_id) VALUES (?, ?)',
      [teamId, hack_id]  // Use the hackathon_id retrieved above
    );

    // Insert each user into the `team_members` table with the team_id
    for (const user of users) {
      const [userRows] = await pool.query('SELECT id FROM users WHERE username = ?', [user.name]);
      console.log("User registration for Team ID:", teamId);
      if (userRows.length > 0) {
        const userId = userRows[0].id;
        await pool.query(
          'INSERT INTO team_members (team_id, user_id) VALUES (?, ?)',
          [teamId, userId]
        );
      } else {
        console.error(`User ${user.name} not found in the users table.`);
      }
    }

    return new Response(
      JSON.stringify({ message: 'Registration successful', registrationId: registrationResult.insertId }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Database error:", error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
