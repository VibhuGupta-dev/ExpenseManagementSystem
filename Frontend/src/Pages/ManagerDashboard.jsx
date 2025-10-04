import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagerDashboard = () => {
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPendingExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/manager/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingExpenses(response.data);
      } catch (error) {
        console.error('Failed to fetch pending expenses', error);
      }
    };

    const fetchAllExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/manager/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllExpenses(response.data);
      } catch (error) {
        console.error('Failed to fetch all expenses', error);
      }
    };

    fetchPendingExpenses();
    fetchAllExpenses();
  }, [token]);

  const handleUpdateStatus = async (expenseId, status) => {
    try {
      const comments = prompt('Add comments (optional):');
      const response = await axios.put(`http://localhost:3000/api/manager/update/${expenseId}`, { status, comments }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Expense updated', response.data);
      // Refresh lists
      const updatedPending = await axios.get('http://localhost:3000/api/manager/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingExpenses(updatedPending.data);
      const updatedAll = await axios.get('http://localhost:3000/api/manager/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllExpenses(updatedAll.data);
    } catch (error) {
      console.error('Update status failed', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', backgroundColor: '#ffffff', border: '1px solid #556B2F', borderRadius: '5px' }}>
      <h2 style={{ textAlign: 'center', color: '#556B2F' }}>Manager Dashboard</h2>
      <h3 style={{ textAlign: 'center', color: '#556B2F' }}>Pending Expenses</h3>
      {pendingExpenses.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {pendingExpenses.map((expense) => (
            <li key={expense._id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #556B2F', borderRadius: '5px' }}>
              <p>Description: {expense.description}</p>
              <p>Amount: {expense.amount}</p>
              <p>Employee: {expense.employee.Fullname}</p>
              <p>Date: {new Date(expense.billDate).toLocaleDateString()}</p>
              <button onClick={() => handleUpdateStatus(expense._id, 'Approved')} style={{ backgroundColor: '#556B2F', color: '#ffffff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px', marginRight: '10px' }}>Approve</button>
              <button onClick={() => handleUpdateStatus(expense._id, 'Rejected')} style={{ backgroundColor: '#556B2F', color: '#ffffff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' }}>Reject</button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: 'center', color: '#556B2F' }}>No pending expenses.</p>
      )}

      <h3 style={{ textAlign: 'center', color: '#556B2F' }}>All Expenses</h3>
      {allExpenses.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {allExpenses.map((expense) => (
            <li key={expense._id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #556B2F', borderRadius: '5px' }}>
              <p>Description: {expense.description}</p>
              <p>Amount: {expense.amount}</p>
              <p>Employee: {expense.employee.Fullname}</p>
              <p>Status: {expense.status}</p>
              <p>Date: {new Date(expense.billDate).toLocaleDateString()}</p>
              <p>Comments: {expense.comments}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: 'center', color: '#556B2F' }}>No expenses found.</p>
      )}
    </div>
  );
};

export default ManagerDashboard;