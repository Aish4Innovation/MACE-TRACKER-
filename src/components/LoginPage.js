import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const navigate = useNavigate();

  // On component load, pre-fill email/password if stored
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
        rememberMe: true
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/login', {
      email: formData.email,
      password: formData.password
    })
    .then(response => {
      alert(response.data.message);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // If Remember Me is checked, store credentials
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberedPassword', formData.password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      navigate('/dashboard');
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('Invalid email or password!');
    });
  };

  return (
    <div className="container">
      <h2>Sign In</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="options-group">
          <label className="remember-me">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            Remember Me
          </label>
          <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
        </div>

        <button type="submit">Sign In</button>
      </form>

      <p className="register-link">
        New User? <Link to="/register">Register Now</Link>
      </p>
    </div>
  );
}

export default LoginPage;
