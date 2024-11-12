'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [allHackathons, setAllHackathons] = useState([]);
  const [registeredHackathons, setRegisteredHackathons] = useState([]);
  const [pastHackathons, setPastHackathons] = useState([]);
  const [view, setView] = useState('present'); // State variable to track the current view
  const router = useRouter();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch('/api/presenthackathons');
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
      const userId = localStorage.getItem('userId');
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

  const fetchPastHackathons = async () => {
    try {
      const res = await fetch('/api/pasthackathons');
      if (res.ok) {
        const data = await res.json();
        setPastHackathons(data.hackathons);
      } else {
        console.error('Failed to fetch past hackathons');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleShowPresentHackathons = () => {
    setView('present');
  };

  const handleShowPastHackathons = () => {
    setView('past');
    fetchPastHackathons();
  };

  const handleSignOut = () => {
    localStorage.removeItem('userId');
    router.push('/');
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
          <button className={styles.presentHackathonsButton} onClick={handleShowPresentHackathons}>
            Show Present Hackathons
          </button>
          <button className={styles.pastHackathonsButton} onClick={handleShowPastHackathons}>
            Show Past Hackathons
          </button>
          <ul>
            {view === 'present' && allHackathons.map((hackathon, index) => (
              <li key={index} className={styles.hackathonItem} onClick={() => router.push(`/hackathondetails/${hackathon.hackathon_id}`)}>
                {hackathon.name}
              </li>
            ))}
            {view === 'past' && pastHackathons.map((hackathon, index) => (
              <li key={index} className={styles.hackathonItem} onClick={() => router.push(`/hackathondetails/${hackathon.hackathon_id}`)}>
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