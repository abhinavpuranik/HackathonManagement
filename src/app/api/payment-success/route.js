import Stripe from 'stripe';
import mysql from 'mysql2/promise';

const stripe = new Stripe('sk_test_51QImcbCthuaqKWaWg1fbmcAvaHNj7FTP19gmkvplz99fAm42D4QLQq8xhsHNND5j857TTmvGpchYOyGvjJkIiEZI006VsGNXVG');


const pool = mysql.createPool({
  host: 'localhost',  // Replace with your DB host
  user: 'root',       // Replace with your DB user
  password: 'Aadi@157', // Replace with your DB password
  database: 'HackathonManagement', // Replace with your database name
});

export async function POST(request) {
    const {session_id,teamName,hackathonName,projectName,googleSlides,githubLink,users}  = await request.json();
  
    if (!session_id) {
      return new Response(JSON.stringify({ error: 'Session ID is missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ error: 'Payment not completed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { amount_total } = session;

    // Assuming you have a way to get hackathon_id from hackathonName
    const [hackathon] = await pool.query('SELECT hackathon_id FROM hackathons WHERE name = ?', [hackathonName]);
    const hackathon_id = hackathon[0].hackathon_id;

    const [result] = await pool.query('CALL RegisterTeamAndHackathon(?, ?, ?, ?, ?, @team_id)', [teamName, projectName, googleSlides, githubLink, hackathon_id]);
    const [[{ team_id }]] = await pool.query('SELECT @team_id AS team_id');

    // Insert users
    const usersJson = JSON.stringify(users); // Convert users array to JSON
    console.log(users);
    console.log(usersJson);
await pool.query('CALL InsertUsersToTeam(?, ?)', [team_id, users]);
    // Insert payment details
    await pool.query('INSERT INTO payment (team_id, hackathon_id, payment_money, status) VALUES (?, ?, ?, ?)', [team_id, hackathon_id, amount_total / 100, 'Paid']);

    return new Response(JSON.stringify({ message: 'Payment and registration recorded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
}