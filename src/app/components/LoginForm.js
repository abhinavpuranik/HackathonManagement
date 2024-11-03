'use client';
import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
  
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, userType }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Store the user ID and username in local storage
        localStorage.setItem('userId', data.userId); // Save user ID
        localStorage.setItem('username', data.username); // Save username (optional)
  
        setUsername('');
        setPassword('');
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Login</h2>

      <label className={styles.label}>User Type</label>
      <select
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        className={styles.select}
      >
        <option value="user">User</option>
        <option value="club">Club</option>
        <option value="admin">Admin</option>
      </select>

      <label className={styles.label}>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={styles.input}
        required
      />

      <label className={styles.label}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
        required
      />

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}

      <button type="submit" className={styles.button}>
        Login
      </button>
      <button className={styles.button} onClick={() => { router.push('/SignUp'); }}>
        Sign Up
      </button>
    </form>
  );
};

export default LoginForm;
