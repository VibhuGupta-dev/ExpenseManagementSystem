import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    Fullname: '',
    email: '',
    password: '',
    country: ''
  });

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState('');

  // Fetch countries from REST Countries API on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        setCountriesError('');
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
        
        // Sort countries alphabetically by common name
        const sortedCountries = response.data
          .map(country => ({
            name: country.name.common,
            official: country.name.official
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(sortedCountries);
      } catch (err) {
        setCountriesError('Failed to load countries. Please refresh the page.');
        console.error('Error fetching countries:', err);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.Fullname.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.country) {
      setError('Please select a country');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/auth/signup', formData);
      console.log('Signup successful', response.data);
      setSuccess('Signup successful! Redirecting...');
      
      // Redirect to login or dashboard after 2 seconds
      setTimeout(() => {
        // window.location.href = '/login';
        // or use React Router: navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Signup failed', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;
        
        if (status === 400) {
          setError(message || 'Invalid input. Please check your details.');
        } else if (status === 409) {
          setError('Email already exists. Please use a different email or login.');
        } else if (status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(message || 'Signup failed. Please try again.');
        }
      } else if (err.request) {
        // Request made but no response received
        setError('Network error. Please check your internet connection.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      
      {/* Error Message */}
      {error && (
        <div className="error-message" style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="success-message" style={{
          backgroundColor: '#efe',
          color: '#3c3',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #cfc'
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="Fullname" 
          placeholder="Full Name" 
          value={formData.Fullname}
          onChange={handleChange} 
          disabled={loading}
          required 
        />
        
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email}
          onChange={handleChange} 
          disabled={loading}
          required 
        />
        
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password}
          onChange={handleChange} 
          disabled={loading}
          required 
        />
        
        {/* Country Dropdown with REST Countries API */}
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          disabled={loading || countriesLoading}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">
            {countriesLoading ? 'Loading countries...' : 'Select Country'}
          </option>
          {countries.map((country, index) => (
            <option key={index} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>

        {/* Countries Error */}
        {countriesError && (
          <div style={{
            fontSize: '12px',
            color: '#c33',
            marginBottom: '10px'
          }}>
            {countriesError}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || countriesLoading}
          style={{
            opacity: loading || countriesLoading ? 0.6 : 1,
            cursor: loading || countriesLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
};

export default Signup;