import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/employee/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(response.data);
      } catch (error) {
        console.error('Failed to fetch expenses', error);
      }
    };
    fetchExpenses();
  }, [token]);

  const handleSubmitToPending = async (expenseId) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/employee/expenses/${expenseId}/submit`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Bill submitted for approval', response.data);
      const updatedResponse = await axios.get('http://localhost:3000/api/employee/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(updatedResponse.data);
    } catch (error) {
      console.error('Submit to pending failed', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', backgroundColor: '#ffffff', border: '1px solid #556B2F', borderRadius: '5px' }}>
      <h2 style={{ textAlign: 'center', color: '#556B2F' }}>Employee Dashboard</h2>
      <p style={{ textAlign: 'center' }}><a href="/employee-new-bill" style={{ color: '#556B2F', textDecoration: 'underline' }}>Create New Bill</a></p>
      <h3 style={{ textAlign: 'center', color: '#556B2F' }}>My Expenses</h3>
      {expenses.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {expenses.map((expense) => (
            <li key={expense._id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #556B2F', borderRadius: '5px' }}>
              <p>Description: {expense.description}</p>
              <p>Amount: {expense.amount}</p>
              <p>Status: {expense.status}</p>
              <p>Date: {new Date(expense.billDate).toLocaleDateString()}</p>
              {expense.status === 'Draft' && (
                <button onClick={() => handleSubmitToPending(expense._id)} style={{ backgroundColor: '#556B2F', color: '#ffffff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px', marginLeft: '10px' }}>Submit</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: 'center', color: '#556B2F' }}>No expenses found.</p>
      )}
    </div>
  );
};

export default EmployeeDashboard;