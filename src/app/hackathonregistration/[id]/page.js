'use client';
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styles from './HackathonRegistrationForm.module.css';

const stripePromise = loadStripe('pk_test_51QImcbCthuaqKWaWLNnOmuDTndiePHs3HVhRHc1RyreSomee2OcVROXsEYwYQnK6yRHEWdy31splsxpgsSeOUbpj00vdUUa1TD');

const HackathonRegistrationForm = ({ params }) => {
  const [users, setUsers] = useState([{ name: '' }]);
  const [teamName, setTeamName] = useState('');
  const [hackathonName, setHackathonName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [googleSlides, setGoogleSlides] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [maxUsers, setMaxUsers] = useState(4); // Default value
  const [price, setPrice] = useState(0); // Price for the hackathon
  const params1=React.use(params)
  const { id } = params1;

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
          console.log(data);
          setHackathonName(data.hackathon.name);
          setMaxUsers(data.hackathon.max_participants_in_a_team);
          setPrice(data.hackathon.pay); // Assuming price is in the hackathon details
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

  const handleUserChange = (index, value) => {
    const newUsers = [...users];
    newUsers[index].name = value;
    setUsers(newUsers);
  };

  const addUser = () => {
    if (users.length < maxUsers) {
      setUsers([...users, { name: '' }]);
    } else {
      alert(`You can only add up to ${maxUsers} participants.`);
    }
  };

  const removeUser = (index) => {
    const newUsers = users.filter((_, i) => i !== index);
    setUsers(newUsers);
  };

  const handlePayment = async () => {
    const stripe = await stripePromise;

    const formData = {
      users,
      teamName,
      hackathonName,
      projectName,
      googleSlides,
      githubLink,
      price,
    };

    // Call the API endpoint to perform the checks
    const checkResponse = await fetch('/api/check-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({users,teamName,hackathonName}),
    });

    const checkData = await checkResponse.json();

    if (checkResponse.ok) {
      // Proceed to payment if the checks pass
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } else {
      // Handle the error if the checks fail
      alert(checkData.error);
    }
  };

  return (
    <form className={styles.form}>
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

      <label className={styles.label}>Hackathon Name</label>
      <input
        type="text"
        className={styles.input}
        value={hackathonName}
        onChange={(e) => setHackathonName(e.target.value)}
        required
        readOnly
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

      <button type="button" className={`${styles.button} ${styles.paymentButton}`} onClick={handlePayment}>Pay ${price}</button>
    </form>
  );
};

export default HackathonRegistrationForm;