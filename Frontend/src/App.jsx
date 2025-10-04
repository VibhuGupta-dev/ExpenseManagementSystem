import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';

import AddUser from './Pages/Adduser';
import Roles from './Pages/Roles';
import EmployeeDashboard from './Pages/EmployeeDashboard';
import ManagerDashboard from './Pages/ManagerDashboard'; // New import
import ForgotPassword from './Pages/Forget-Password'; // New importP
// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      const user = JSON.parse(localStorage.getItem('user')); // Assume user data is stored after login
      if (user && user.role !== role) {
        if (user.role === 'employee') {
          navigate('/employee-dashboard');
        } else if (user.role === 'manager') {
          navigate('/manager-dashboard');
        } else if (user.role === 'admin') {
          navigate('/add-user');
        } else {
          navigate('/login');
        }
      }
    }
  }, [token, navigate, role]);

  return token ? children : null;
};

// App Component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* New route */}
        <Route
          path="/add-user"
          element={
            <ProtectedRoute role="admin">
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute role="admin">
              <Roles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Login />} /> {/* Default to login */}
      </Routes>
    </Router>
  );
};

export default App;