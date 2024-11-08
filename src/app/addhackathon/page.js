'use client';
import React, { useState } from 'react';
import styles from './AddHackathonForm.module.css';

const AddHackathonForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    poster_image: '',
    ppt_url: '',
    URL: '',
    summary: '',
    topics: '',
    max_participants_in_a_team: '',
    stall_id: '',
    judge_id: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/hackathons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          topics: JSON.parse(formData.topics || '[]'), // Parse topics as JSON array
        }),
      });

      if (response.ok) {
        setMessage('Hackathon added successfully!');
        setFormData({
          name: '',
          date: '',
          time: '',
          location: '',
          poster_image: '',
          ppt_url: '',
          URL: '',
          summary: '',
          topics: '',
          max_participants_in_a_team: '',
          stall_id: '',
          judge_id: '',
        });
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add hackathon');
      }
    } catch (error) {
      console.error('Error adding hackathon:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Add New Hackathon</h2>

      <label>Hackathon Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label>Date</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />

      <label>Time</label>
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
      />

      <label>Location</label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
      />

      <label>Poster Image URL</label>
      <input
        type="text"
        name="poster_image"
        value={formData.poster_image}
        onChange={handleChange}
      />

      <label>Presentation URL</label>
      <input
        type="text"
        name="ppt_url"
        value={formData.ppt_url}
        onChange={handleChange}
      />

      <label>Event URL</label>
      <input
        type="text"
        name="URL"
        value={formData.URL}
        onChange={handleChange}
      />

      <label>Summary</label>
      <textarea
        name="summary"
        value={formData.summary}
        onChange={handleChange}
      ></textarea>

      <label>Topics (JSON Array)</label>
      <input
        type="text"
        name="topics"
        placeholder='e.g., ["AI", "Blockchain"]'
        value={formData.topics}
        onChange={handleChange}
      />

      <label>Max Participants in a Team</label>
      <input
        type="number"
        name="max_participants_in_a_team"
        value={formData.max_participants_in_a_team}
        onChange={handleChange}
      />

      <label>Stall ID</label>
      <input
        type="number"
        name="stall_id"
        value={formData.stall_id}
        onChange={handleChange}
      />

      <label>Judge ID</label>
      <input
        type="number"
        name="judge_id"
        value={formData.judge_id}
        onChange={handleChange}
      />

      {message && <p className={styles.message}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.button}>
        Add Hackathon
      </button>
    </form>
  );
};

export default AddHackathonForm;
