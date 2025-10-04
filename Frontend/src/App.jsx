import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import AddUser from './Pages/Adduser';
import Roles from './Pages/Roles';
import EmployeeDashboard from './Pages/EmployeeDashboard';
import EmployeeNewBill from './Pages/EmployeeNewBill';

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
          path="/employee-new-bill"
          element={
            <ProtectedRoute role="employee">
              <EmployeeNewBill />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Login />} /> {/* Default to login */}
      </Routes>
    </Router>
  );
};

export default App;