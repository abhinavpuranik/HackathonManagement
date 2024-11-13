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
        const res = await fetch('/api/presenthackathons');
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

  // Handle deleting a hackathon
  const deleteHackathon = async (hackathonName) => {
    try {
      const res = await fetch(`/api/hackathons?name=${encodeURIComponent(hackathonName)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setHackathons((prevHackathons) =>
          prevHackathons.filter((hackathon) => hackathon.name !== hackathonName)
        );
      } else {
        console.error('Failed to delete hackathon');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle sign-out
  const handleSignOut = () => {
    router.push('/'); // Redirect to login page
  };

  // Navigate to the Add Hackathon page
  const goToAddHackathon = () => {
    router.push('/addhackathon');
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <div className={styles.buttonGroup}>
          <button className={styles.addHackathonButton} onClick={goToAddHackathon}>
            Add Hackathon
          </button>
          <button className={styles.signOutButton} onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <h2>Hackathons</h2>
        <ul>
          {hackathons.map((hackathon, index) => (
            <li key={index} className={styles.hackathonItem}>
              {hackathon.name}
              {/* <button
                className={styles.deleteButton}
                onClick={() => deleteHackathon(hackathon.name)}
              >
                Delete
              </button> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
