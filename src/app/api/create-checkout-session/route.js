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
  try {
    const { users, teamName, hackathonName, projectName, googleSlides, githubLink, price } = await request.json();
    console.log(price);

    const origin = request.headers.get('origin');
    if (!origin) {
      throw new Error('Origin header is missing');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['amazon_pay'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Payment for ${hackathonName}`,
            },
            unit_amount: price * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&teamName=${teamName}&hackathonName=${hackathonName}&projectName=${projectName}&googleSlides=${googleSlides}&githubLink=${githubLink}&users=${JSON.stringify(users)}`,
      cancel_url: `${origin}/cancel`,
    });

    return new Response(JSON.stringify({ id: session.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}