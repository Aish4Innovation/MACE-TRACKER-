// salesapp/src/components/ForgotPasswordPage.js

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css'; // Reuse existing styling

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST to backend to trigger email/send reset logic
      const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('Failed to process request. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p style={{ marginTop: '15px' }}>{message}</p>}
    </div>
  );
}

export default ForgotPasswordPage;
