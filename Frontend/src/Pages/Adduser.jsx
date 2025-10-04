import React, { useState } from 'react';
import axios from 'axios';
import './AddUser.css';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    country: '',
    managerId: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/admin/addUser', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('User added', response.data);
    } catch (error) {
      console.error('Add user failed', error);
    }
  };

  return (
    <div className="adduser-container">
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <select name="role" onChange={handleChange}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <input type="text" name="country" placeholder="Country" onChange={handleChange} required />
        <input type="text" name="managerId" placeholder="Manager ID (optional)" onChange={handleChange} />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;