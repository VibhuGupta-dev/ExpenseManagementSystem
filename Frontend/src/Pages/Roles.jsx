import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Roles = () => {
  const [formData, setFormData] = useState({
    description: '',
    approvers: '',
    minApprovalPercentage: ''
  });
  const [rules, setRules] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/rules', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRules(response.data.rules);
      } catch (error) {
        console.error('Failed to fetch rules', error);
      }
    };
    fetchRules();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const approversArray = formData.approvers.split(',').map(id => id.trim());
      const payload = {
        description: formData.description,
        approvers: approversArray,
        minApprovalPercentage: parseInt(formData.minApprovalPercentage)
      };
      const response = await axios.post('http://localhost:3000/api/admin/rules', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Rule added', response.data);
      setFormData({ description: '', approvers: '', minApprovalPercentage: '' });
      // Refresh rules
      const updatedResponse = await axios.get('http://localhost:3000/api/admin/rules', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRules(updatedResponse.data.rules);
    } catch (error) {
      console.error('Add rule failed', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', backgroundColor: '#ffffff', border: '1px solid #556B2F', borderRadius: '5px' }}>
      <h2 style={{ textAlign: 'center', color: '#556B2F' }}>Add Approval Rule</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="description" value={formData.description} placeholder="Description" onChange={handleChange} required style={{ border: '1px solid #556B2F', padding: '10px', margin: '10px 0', width: '100%', boxSizing: 'border-box', borderRadius: '5px' }} />
        <input type="text" name="approvers" value={formData.approvers} placeholder="Approvers IDs (comma separated)" onChange={handleChange} required style={{ border: '1px solid #556B2F', padding: '10px', margin: '10px 0', width: '100%', boxSizing: 'border-box', borderRadius: '5px' }} />
        <input type="number" name="minApprovalPercentage" value={formData.minApprovalPercentage} placeholder="Min Approval Percentage (81+)" onChange={handleChange} required min="81" style={{ border: '1px solid #556B2F', padding: '10px', margin: '10px 0', width: '100%', boxSizing: 'border-box', borderRadius: '5px' }} />
        <button type="submit" style={{ backgroundColor: '#556B2F', color: '#ffffff', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}>Add Rule</button>
      </form>

      <h3 style={{ textAlign: 'center', color: '#556B2F' }}>Existing Rules</h3>
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {rules.map((rule) => (
          <li key={rule._id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #556B2F', borderRadius: '5px' }}>
            <p>Description: {rule.description}</p>
            <p>Min Approval Percentage: {rule.minApprovalPercentage}%</p>
            <p>Approvers: {rule.approvers.map(approver => approver.Fullname).join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Roles;