import React from "react";
import { Link } from "react-router-dom";
import "../style/Home.css"; 

const Home = () => {
  return (
    <div className="home-container">
      <div className="top-login">
        <Link to="/login" className="cta-button">Log In</Link>
      </div>

      <section className="hero">
        <div className="hero-overlay">
          <h1>Never Miss a Dose Again</h1>
          <p>
            MedTime is a **simple, effective, and life-saving** reminder system 
            designed to help seniors stay on track with their medications.
          </p>
        </div>
      </section>

      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          Every year, **millions of seniors** suffer from missed or incorrect medication doses.
          At **MedTime**, we are on a mission to **eliminate medication non-adherence** 
          by providing **personalized reminders and caregiver support**.
        </p>
      </section>

      <section className="stats">
        <h2>Why MedTime Matters</h2>
        <div className="stat-cards">
          <div className="stat-card">
            <h3>💊 50%</h3>
            <p>of prescribed medications are not taken as directed.</p>
          </div>
          <div className="stat-card">
            <h3>⚕️ 125,000</h3>
            <p>preventable deaths occur annually due to medication non-adherence.</p>
          </div>
          <div className="stat-card">
            <h3>📅 80%</h3>
            <p>of seniors take at least one prescription medication daily.</p>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>How MedTime Helps You</h2>
        <div className="feature">
          <h3>📅 Smart Reminders</h3>
          <p>Get customized notifications for each medication.</p>
        </div>
        <div className="feature">
          <h3>👨‍👩‍👦 Caregiver Access</h3>
          <p>Family members can track medication adherence.</p>
        </div>
        <div className="feature">
          <h3>📱 Simple & Easy to Use</h3>
          <p>Designed with seniors in mind – no tech skills required.</p>
        </div>
      </section>

      
      <section className="why-choose">
        <h2>Why Choose MedTime?</h2>
        <p>
          MedTime is more than just a reminder system—it's a **trusted solution** designed for 
          peace of mind. Our easy-to-use platform ensures you or your loved ones never miss a dose.
        </p>
        <ul>
          <li>✔️ Reduce the risk of medication errors</li>
          <li>✔️ Improve health outcomes</li>
          <li>✔️ Stay connected with caregivers</li>
          <li>✔️ Built for seniors, with **no complicated setup**</li>
        </ul>
      </section>

      <section className="cta">
        <div className="cta-overlay">
          <h2>Take Control of Your Medications Today</h2>
          <p>Sign up now and stay on track with your health.</p>
          <Link to="/signup" className="cta-button">Sign Up</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
