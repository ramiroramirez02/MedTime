import React from "react";
import { Link } from "react-router-dom";
import "../style/Navbar.css"; // Make sure this file exists for styling

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">MedTime</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/signup">Signup</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
