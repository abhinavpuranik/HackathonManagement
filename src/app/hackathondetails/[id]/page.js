'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HackathonDetails.module.css'; // Import CSS Module

const HackathonDetails = ({ params }) => {
  const [hackathon, setHackathon] = useState(null);
  const router = useRouter();
  
  const { id } = React.use(params); // Assuming React.use() is necessary

  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        const res = await fetch('/api/hackathonsdet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          const data = await res.json();
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

  if (!hackathon) {
    return <div>Loading...</div>;
  }
  console.log(hackathon.poster_image);

  return (
    <div className={styles['hackathon-details-container']}>
      <h1>{hackathon.name}</h1>
      
      {/* Render Image if available */}
      {hackathon.poster_image && (
        <div className={styles['image-container']}>
          <img src={`/api/proxy?url=${encodeURIComponent(hackathon.poster_image)}`} alt={`${hackathon.name} Poster`} className={styles['poster-image']} />
        </div>
      )}

      {/* Render hackathon details */}
      {hackathon.date && <p className={styles['hackathon-details-text']}><strong>Date:</strong> {hackathon.date}</p>}
      {hackathon.time && <p className={styles['hackathon-details-text']}><strong>Time:</strong> {hackathon.time}</p>}
      {hackathon.location && <p className={styles['hackathon-details-text']}><strong>Location:</strong> {hackathon.location}</p>}
      {hackathon.summary && <p className={styles['hackathon-details-text']}><strong>Summary:</strong> {hackathon.summary}</p>}

      {hackathon.topics && hackathon.topics.length > 0 && (
        <p className={styles['hackathon-details-text']}><strong>Topics:</strong> {hackathon.topics.join(', ')}</p>
      )}

      {hackathon.max_participants_in_a_team && (
        <p className={styles['hackathon-details-text']}><strong>Max participants per team:</strong> {hackathon.max_participants_in_a_team}</p>
      )}

      {hackathon.cashprize && (
        <p className={styles['hackathon-details-text']}><strong>Cash Prize:</strong> ${hackathon.cashprize}</p>
      )}

      {hackathon.pay && (
        <p className={styles['hackathon-details-text']}><strong>Entry Fee:</strong> ${hackathon.pay}</p>
      )}

      {hackathon.URL && (
        <p className={styles['hackathon-details-text']}><strong>Hackathon URL:</strong> <a href={hackathon.URL} target="_blank" rel="noopener noreferrer">Visit the site</a></p>
      )}

      {hackathon.ppt_url && (
        <p className={styles['hackathon-details-text']}><strong>PPT URL:</strong> <a href={hackathon.ppt_url} target="_blank" rel="noopener noreferrer">Download PPT</a></p>
      )}

      {/* Register Button */}
      <button className={styles['register-button']} onClick={() => router.push(`/hackathonregistration/${id}`)}>
        Register for this Hackathon
      </button>
    </div>
  );
};

export default HackathonDetails;
