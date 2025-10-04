import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
      setSuccess('New password sent to your email.');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', backgroundColor: '#ffffff', border: '1px solid #556B2F', borderRadius: '5px' }}>
      <h2 style={{ textAlign: 'center', color: '#556B2F' }}>Forgot Password</h2>
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
      {success && <p style={{ textAlign: 'center', color: '#556B2F' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ border: '1px solid #556B2F', padding: '10px', margin: '10px 0', width: '100%', boxSizing: 'border-box', borderRadius: '5px' }}
        />
        <button type="submit" disabled={loading} style={{ backgroundColor: '#556B2F', color: '#ffffff', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}>
          {loading ? 'Sending...' : 'Send New Password'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;