"use client";
import React, { useState } from 'react';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message);
        return;
      }

      const data = await res.json();
      console.log(data)
      alert(`Welcome ${data.message.username}!`);
      // Handle successful login (e.g., redirect or set user session)
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Login</h2>

      {error && <p className={styles.error}>{error}</p>}

      <label className={styles.label}>Username</label>
      <input
        type="text"
        className={styles.input}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label className={styles.label}>Password</label>
      <input
        type="password"
        className={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className={styles.button}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
