import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Home.css';
import TextToSpeech from './TextToSpeech';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">💊 Never Miss a Dose Again</h1>
      <TextToSpeech />
      <p className="home-description">
        Our web app helps you schedule your medications by day and time and automatically reminds you via email so you never miss a dose.
      </p>

      <div className="steps">
        <div className="step">
          <h2>🔍 1. Search</h2>
          <p>Find your medication using our FDA-powered lookup tool.</p>
        </div>
        <div className="step">
          <h2>⏰ 2. Schedule</h2>
          <p>Select days and times for each dose with a simple form.</p>
        </div>
        <div className="step">
          <h2>📧 3. Get Reminded</h2>
          <p>You’ll receive email alerts right when it’s time to take your meds.</p>
        </div>
      </div>

      <button className="get-started-btn" onClick={() => navigate('/auth')}>
        Get Started
      </button>
    </div>
  );
};

export default Home;
