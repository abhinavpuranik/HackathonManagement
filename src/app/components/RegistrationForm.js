"use client";
import React, { useState } from 'react';
import styles from './RegistrationForm.module.css';

const RegistrationForm = () => {
  const [users, setUsers] = useState([{ name: '' }]); // Start with one user
  const maxUsers = 4;
  const [teamName, setTeamName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [googleSlides, setGoogleSlides] = useState('');
  const [githubLink, setGithubLink] = useState('');

  const handleUserChange = (index, value) => {
    const newUsers = [...users];
    newUsers[index].name = value;
    setUsers(newUsers);
  };

  const addUser = () => {
    if (users.length < maxUsers) {
      setUsers([...users, { name: '' }]);
    }
  };

  const removeUser = (index) => {
    const newUsers = users.filter((_, i) => i !== index);
    setUsers(newUsers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare form submission data here
    const formData = {
      users,
      teamName,
      projectName,
      googleSlides,
      githubLink,
    };
    console.log("Submitted form data: ", formData);
    // Add your form submission logic here (e.g., send data to an API)
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Team Registration Form</h2>
      
      {users.map((user, index) => (
        <div key={index} className={styles.userInputContainer}>
          <label className={styles.label}>User {index + 1}</label>
          <input
            type="text"
            className={styles.input}
            value={user.name}
            onChange={(e) => handleUserChange(index, e.target.value)}
            required
          />
          <button type="button" className={`${styles.button} ${styles.removeButton}`} onClick={() => removeUser(index)}>
            Remove User
          </button>
        </div>
      ))}

      <button type="button" className={styles.button} onClick={addUser}>
        Add User
      </button>

      <label className={styles.label}>Team Name</label>
      <input
        type="text"
        className={styles.input}
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        required
      />

      <label className={styles.label}>Project Name</label>
      <input
        type="text"
        className={styles.input}
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        required
      />

      <label className={styles.label}>Link to Google Slides</label>
      <input
        type="url"
        className={styles.input}
        value={googleSlides}
        onChange={(e) => setGoogleSlides(e.target.value)}
        required
      />

      <label className={styles.label}>Link to GitHub</label>
      <input
        type="url"
        className={styles.input}
        value={githubLink}
        onChange={(e) => setGithubLink(e.target.value)}
        required
      />

      <button type="submit" className={`${styles.button} ${styles.registerButton}`}>Register</button>
    </form>
  );
};

export default RegistrationForm;
