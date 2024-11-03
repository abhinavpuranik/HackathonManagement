'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [allHackathons, setAllHackathons] = useState([]);
  const [registeredHackathons, setRegisteredHackathons] = useState([]);
  const router = useRouter();

  // Fetch all hackathons and user registered hackathons on component mount
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch('/api/hackathons'); // Fetch all hackathons
        if (res.ok) {
          const data = await res.json();
          setAllHackathons(data.hackathons);
        } else {
          console.error('Failed to fetch hackathons');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchRegisteredHackathons = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
      if (userId) {
        try {
          const res = await fetch(`/api/userHackathons?userId=${userId}`);
          if (res.ok) {
            const data = await res.json();
            setRegisteredHackathons(data.hackathons);
          } else {
            console.error('Failed to fetch registered hackathons');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchHackathons();
    fetchRegisteredHackathons();
  }, []);

  // Handle sign-out
  const handleSignOut = () => {
    localStorage.removeItem('userId'); // Optionally clear user ID on sign-out
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
        <div className={styles.hackathons}>
          <h2>All Hackathons</h2>
          <ul>
            {allHackathons.map((hackathon, index) => (
              <li key={index} className={styles.hackathonItem}>
                {hackathon.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.sidebar}>
          <h2>Your Registered Hackathons</h2>
          <ul>
            {registeredHackathons.map((hackathon, index) => (
              <li key={index} className={styles.hackathonItem}>
                {hackathon.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
