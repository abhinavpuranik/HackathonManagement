'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [allHackathons, setAllHackathons] = useState([]);
  const [registeredHackathons, setRegisteredHackathons] = useState([]);
  const [statistics, setStatistics] = useState({ userCount: 0, hackathonCount: 0, registrationCount: 0 });
  const router = useRouter();

  // Fetch all hackathons and user registered hackathons on component mount
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch('/api/hackathons');
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

    const fetchStatistics = async () => {
      try {
        const res = await fetch('/api/statistics');
        if (res.ok) {
          const data = await res.json();
          setStatistics(data);
        } else {
          console.error('Failed to fetch statistics');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchHackathons();
    fetchRegisteredHackathons();
    fetchStatistics();
  }, []);

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

      <div className={styles.statisticsBox}>
        <h2>Statistics</h2>
        <p>Total Users Registered: {statistics.userCount}</p>
        <p>Total Hackathons: {statistics.hackathonCount}</p>
        <p>Total Hackathon Registrations: {statistics.registrationCount}</p>
      </div>
    </div>
  );
};

export default Dashboard;
