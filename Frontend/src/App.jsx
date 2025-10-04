import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import AddUser from './Pages/Adduser';
import Roles from './Pages/Roles';
import Navbar from './Components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/" element={<Login />} /> {/* Default to login */}
      </Routes>
    </Router>
  );
};

export default App;