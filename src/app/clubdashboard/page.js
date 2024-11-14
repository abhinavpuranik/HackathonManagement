'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [teams, setTeams] = useState(null);
  const [rows, setrows] = useState(null);

  const router = useRouter();

  // Fetch hackathons on component mount
  useEffect(() => {
    const fetchRegisteredHackathons = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const res = await fetch(`/api/hackathons/clubs?userId=${userId}`);
          if (res.ok) {
            const data = await res.json();
            setHackathons(data.hackathons);
          } else {
            console.error('Failed to fetch registered hackathons');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };


    fetchRegisteredHackathons();
  }, []);

  // Fetch teams and users for a selected hackathon
  const fetchTeamsAndUsers = async (hackathonName) => {
    try {
      const res = await fetch(`/api/hackathons/teams?hackathonName=${encodeURIComponent(hackathonName)}`);
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams);
        console.log(data.teams);
        setSelectedHackathon(hackathonName);
      } else {
        console.error('Failed to fetch teams and users');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(()=>{
    if(teams)
    {
    setrows(teams.reduce((acc, team) => {
      // Check if the team already exists in the accumulator
      const existingTeam = acc.find(t => t.team_name === team.team_name);
    
      // If team exists, merge users and check for unique links
      if (existingTeam) {
        // Extract and add unique users
        const users = Object.keys(team)
          .filter(key => key.startsWith('user'))
          .map(key => team[key]);
        existingTeam.users.push(...users);
    
        // Add unique github_link if it’s not already present
        if (!existingTeam.github_links.includes(team.github_link)) {
          existingTeam.github_links.push(team.github_link);
        }
    
        // Add unique google_slides link if it’s not already present
        if (!existingTeam.google_slides.includes(team.google_slides)) {
          existingTeam.google_slides.push(team.google_slides);
        }
      } else {
        // If the team doesn't exist, create a new entry
        const users = Object.keys(team)
          .filter(key => key.startsWith('user'))
          .map(key => team[key]);
        
        // Initialize the team entry with users and links arrays
        acc.push({
          team_name: team.team_name,
          github_links: [team.github_link],
          google_slides: [team.google_slides],
          users
        });
      }
    
      return acc;
    }, []));
  }
  },[teams])
  useEffect(()=>{console.log(hackathons)},[hackathons])
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
              <button
                className={styles.viewTeamsButton}
                onClick={() => fetchTeamsAndUsers(hackathon.name)}
              >
                View Teams
              </button>
              {/* <button
                className={styles.deleteButton}
                onClick={() => deleteHackathon(hackathon.name)}
              >
                Delete
              </button> */}
            </li>
          ))}
        </ul>

        {selectedHackathon && teams && rows && (
          <div className={styles.teamsSection}>
            <h3>Teams for {selectedHackathon}</h3>
            <table className={styles.teamsTable}>
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>GitHub Link</th>
                  <th>Google Slides</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                  {rows.reduce((acc, team, teamIndex) => {
  team.users.forEach((user, userIndex) => {
    const row = (
      <tr key={`${teamIndex}-${userIndex}`}>
        {userIndex === 0 && (
          <>
            <td rowSpan={team.users.length}>{team.team_name}</td>
            <td rowSpan={team.users.length}>
              {team.github_links.map((link, linkIndex) => (
                <div key={linkIndex}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </div>
              ))}
            </td>
            <td rowSpan={team.users.length}>
              {team.google_slides.map((slide, slideIndex) => (
                <div key={slideIndex}>
                  <a href={slide} target="_blank" rel="noopener noreferrer">
                    {slide}
                  </a>
                </div>
              ))}
            </td>
          </>
        )}
        <td>{user}</td>
      </tr>
    );
    acc.push(row);
  });
  return acc;
}, [])}

              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
