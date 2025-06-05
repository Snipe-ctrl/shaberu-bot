"use client";

import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for a confirmation link!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: 320 }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#222' }}>Sign Up</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 6, color: '#555' }}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 6, color: '#555' }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 6, color: '#555' }}>Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 16, cursor: 'pointer' }} disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        {message && <div style={{ marginTop: 16, color: message.includes('match') ? '#e74c3c' : '#27ae60', textAlign: 'center' }}>{message}</div>}
      </form>
    </div>
  );
}
