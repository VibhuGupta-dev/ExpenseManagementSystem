import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Expense Management System</div>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/add-user">Add User</Link></li>
        <li><Link to="/roles">Roles</Link></li>
        <li><Link to="/logout">Logout</Link></li> {/* Add logout logic if needed */}
      </ul>
    </nav>
  );
};

export default Navbar;