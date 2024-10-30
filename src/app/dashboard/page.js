'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const router = useRouter();

  // Fetch hackathons on component mount
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch('/api/hackathons');
        if (res.ok) {
          const data = await res.json();
          setHackathons(data.hackathons);
        } else {
          console.error('Failed to fetch hackathons');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchHackathons();
  }, []);

  // Handle sign-out
  const handleSignOut = () => {
    // Clear session logic (optional if you implement cookies/localStorage)
    router.push('/'); // Redirect to login page
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <button className={styles.signOutButton} onClick={handleSignOut}>
          Sign Out
        </button>
      </header>

      <div className={styles.content}>
        <h2>Hackathons</h2>
        <ul>
          {hackathons.map((hackathon, index) => (
            <li key={index} className={styles.hackathonItem}>
              {hackathon.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
