import React, { useState } from 'react';
import axios from 'axios';
import './Roles.css';

const Roles = () => {
  const [formData, setFormData] = useState({
    description: '',
    approvers: '',
    minApprovalPercentage: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const approversArray = formData.approvers.split(',').map(id => id.trim());
      const payload = {
        description: formData.description,
        approvers: approversArray,
        minApprovalPercentage: parseInt(formData.minApprovalPercentage)
      };
      const response = await axios.post('http://localhost:3000/api/admin/rules', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Role added', response.data);
    } catch (error) {
      console.error('Add role failed', error);
    }
  };

  return (
    <div className="roles-container">
      <h2>Add Approval Rule</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="description" placeholder="Description" onChange={handleChange} required />
        <input type="text" name="approvers" placeholder="Approvers IDs (comma separated)" onChange={handleChange} required />
        <input type="number" name="minApprovalPercentage" placeholder="Min Approval Percentage (81+)" onChange={handleChange} required min="81" />
        <button type="submit">Add Rule</button>
      </form>
    </div>
  );
};

export default Roles;