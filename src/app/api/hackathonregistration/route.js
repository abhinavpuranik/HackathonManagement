import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Aadi@157',
    database: 'HackathonManagement',
});

export async function POST(request) {
  try {
    const { teamName, hackathonName, projectName, googleSlides, githubLink, users } = await request.json();

    // Check if the hackathon exists
   var hack_id=0;
    const [hackathonRows] = await pool.query('SELECT * FROM hackathons WHERE name = ?', [hackathonName]);
    hack_id= await pool.query('SELECT hackathon_id FROM hackathons WHERE name = ?', [hackathonName])[0];
    // If hackathon does not exist, insert it
    if (hackathonRows.length === 0) {
        const [q]=await pool.query(
            'INSERT INTO hackathons (name) VALUES (?)',
            [hackathonName]
        );
        hack_id=q.insertId;
    }
    console.log(hack_id);

    // Insert the team into the `teams` table
    

    // Insert the registration details into the `registrations` table
    const [registrationResult] = await pool.query(
      'INSERT INTO teams (name, project_name, google_slides, github_link) VALUES (?, ?, ?, ?)',
      [teamName, projectName, googleSlides, githubLink]
    );
const teamId=registrationResult.insertId;
await pool.query(
  'INSERT INTO registrations (team_id, hackathon_id) VALUES (?, ?)',
  [teamId,hack_id]
);
    // Insert each user into the `team_members` table with the team_id
    for (const user of users) {
      // Assuming `user.username` contains the username, find the user's ID from the `users` table
      const [userRows] = await pool.query(
        'SELECT id FROM users WHERE username = ?',
        [user.name]
      );
      console.log("hiii "+teamId)
      if (userRows.length > 0) {
        const userId = userRows[0].id;
        await pool.query(
          'INSERT INTO team_members (team_id, user_id) VALUES (?, ?)',
          [teamId, userId]
        );
      } else {
        console.error(`User ${user.username} not found in the users table.`);
      }
    }

    return new Response(JSON.stringify({ message: 'Registration successful', registrationId: registrationResult.insertId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
