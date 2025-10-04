import React, { useState } from 'react';
import axios from 'axios';

const EmployeeNewBill = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    billDate: '',
    category: 'Travel',
    paidBy: '',
    remarks: '',
    amount: ''
  });
  const [file, setFile] = useState(null);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    if (e.target.name === 'receipt') {
      setFile(e.target.files[0]);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('billDate', formData.billDate);
    data.append('category', formData.category);
    data.append('paidBy', formData.paidBy);
    data.append('remarks', formData.remarks);
    data.append('amount', formData.amount);
    if (file) data.append('receipt', file);

    try {
      const response = await axios.post('http://localhost:3000/api/employee/expenses', data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      console.log('Bill saved as draft', response.data);
      setFormData({ name: '', description: '', billDate: '', category: 'Travel', paidBy: '', remarks: '', amount: '' });
      setFile(null);
    } catch (error) {
      console.error('Bill submission failed', error);
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
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
        New Bill
      </h2>
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
          value={formData.name}
          placeholder="Your Name"
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
          name="description"
          value={formData.description}
          placeholder="Description"
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
          type="date"
          name="billDate"
          value={formData.billDate}
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
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{
            border: '1px solid #556B2F',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
          }}
        >
          <option value="Travel">Travel</option>
          <option value="Food">Food</option>
          <option value="Supplies">Supplies</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="paidBy"
          value={formData.paidBy}
          placeholder="Paid By"
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
          name="remarks"
          value={formData.remarks}
          placeholder="Remarks (optional)"
          onChange={handleChange}
          style={{
            border: '1px solid #556B2F',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
          }}
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          placeholder="Amount"
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
          type="file"
          name="receipt"
          onChange={handleChange}
          style={{
            border: '1px solid #556B2F',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#556B2F',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Save as Draft
        </button>
      </form>
    </div>
  );
};

export default EmployeeNewBill;