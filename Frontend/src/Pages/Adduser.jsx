import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './AddUser.css';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    country: '',
    managerId: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };
    fetchUsers();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3000/api/admin/addUser', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User added successfully!');
      console.log('User added', response.data);
      setFormData({ name: '', email: '', role: 'employee', country: '', managerId: '' });
      // Refresh users list
      const updatedResponse = await axios.get('http://localhost:3000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(updatedResponse.data.users);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add user');
      console.error('Add user failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adduser-container">
      <h2>Add User</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
        <input type="text" name="managerId" placeholder="Manager ID (optional)" value={formData.managerId} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add User'}</button>
      </form>
      <p>
        <Link to="/roles" style={{ color: '#556B2F', textDecoration: 'underline' }}>Go to Roles</Link>
      </p>

      <h3>Existing Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.Fullname} ({user.email}) - Role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddUser;