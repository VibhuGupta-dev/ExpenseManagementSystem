import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./AddUser.css";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    country: '',
    managerId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error on change
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.country.trim()) {
      setError('Country is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!token) {
      setError('Authentication required. Please log in.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3000/api/admin/addUser', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        timeout: 10000 // 10 seconds timeout
      });
      setSuccess('User added successfully!');
      console.log('User added', response.data);
      setFormData({ name: '', email: '', role: 'employee', country: '', managerId: '', password: '' });
    } catch (error) {
      console.error('Add user failed', error);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError(error.response.data?.message || 'Invalid data. Please check your input.');
            break;
          case 401:
            setError('Unauthorized access. Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            break;
          case 404:
            setError('Endpoint /api/admin/addUser not found. Please check backend configuration.');
            break;
          default:
            setError('Failed to add user. Please try again.');
        }
      } else if (error.request) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid #556B2F',
        borderRadius: '5px',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          color: '#556B2F',
        }}
      >
        Add User
      </h2>

      {error && (
        <div
          style={{
            textAlign: 'center',
            color: 'red',
            margin: '10px 0',
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            textAlign: 'center',
            color: '#556B2F',
            margin: '10px 0',
          }}
        >
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            border: '1px solid #556B2F',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            border: '1px solid #556B2F',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
          }}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{
            border: '1px solid #556B2F',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
          }}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          required
          style={{
            border: '1px solid #556B2F',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
          }}
        />
        <input
          type="text"
          name="managerId"
          placeholder="Manager ID (optional)"
          value={formData.managerId}
          onChange={handleChange}
          style={{
            border: '1px solid #556B2F',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            border: '1px solid #556B2F',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#556B2F',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            borderRadius: '5px',
            marginTop: '10px',
          }}
        >
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
      <p
        style={{
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        <Link
          to="/roles"
          style={{
            color: '#556B2F',
            textDecoration: 'underline',
          }}
        >
          Go to Roles
        </Link>
      </p>
    </div>
  );
};

export default AddUser;