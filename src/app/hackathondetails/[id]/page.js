'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const HackathonDetails = ({ params }) => {
  const [hackathon, setHackathon] = useState(null);
  const router = useRouter();
  const { id } = params;

  // Debugging logs
  console.log('Hackathon ID:', id);

  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        console.log('Fetching hackathon details for ID:', id);
        const res = await fetch('/api/hackathonsdet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          const data = await res.json();
          console.log('Hackathon data:', data);
          setHackathon(data.hackathon);
        } else {
          console.error('Failed to fetch hackathon details');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (id) {
      fetchHackathonDetails();
    }
  }, [id]);

  useEffect(() => {
    console.log('Hackathon state:', hackathon);
  }, [hackathon]);

  if (!hackathon) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{hackathon.name}</h1>
      <p>Date: {hackathon.date}</p>
      <p>Time: {hackathon.time}</p>
      <p>Location: {hackathon.location}</p>
      <p>Summary: {hackathon.summary}</p>
      <p>Topics: {hackathon.topics}</p>
      <button onClick={() => router.push(`/hackathonregistration/${id}`)}>
        Register for this Hackathon
      </button>
    </div>
  );
};

export default HackathonDetails;