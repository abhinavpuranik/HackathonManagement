import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Aadi@157',
  database: 'HackathonManagement',
});

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT name FROM hackathons');

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

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    console.log("Received name:", name);  // Log to check if it's being parsed

    if (!name) {
      return new Response(JSON.stringify({ message: 'Hackathon name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [result] = await pool.query('DELETE FROM hackathons WHERE name = ?', [name]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'Hackathon not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Hackathon deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const {
      userId,
      name,
      date,
      time,
      location,
      poster_image,
      ppt_url,
      URL,
      summary,
      topics,
      max_participants_in_a_team,
      cashprize,
      pay
    } = await req.json();

    // Insert hackathon details
    const [result] = await pool.query(
      `INSERT INTO hackathons 
      (name, date, time, location, poster_image, ppt_url, URL, summary, topics, max_participants_in_a_team,cashprize,pay,club_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        name,
        date,
        time,
        location,
        poster_image,
        ppt_url,
        URL,
        summary,
        JSON.stringify(topics),
        max_participants_in_a_team,
        cashprize,
        pay,
        userId
      ]
    );

    return new Response(
      JSON.stringify({ message: 'Hackathon added successfully', hackathonId: result.insertId }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error inserting hackathon:', error);
    return new Response(JSON.stringify({ message: 'Failed to add hackathon' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// New function to fetch teams and users for a specific hackatho