import React from "react";
import { Link } from "react-router-dom";
import "../style/Navbar.css";
import TextToSpeech from "./TextToSpeech";

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">MedTime</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/medication">Medication</Link></li>
        <li><Link to="/auth">Login</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
