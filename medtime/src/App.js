import './App.css';
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './pages/Navbar';
import Profile from "./pages/Profile";
import Medication from './pages/Medication';

function App() {
  return (
    <>
    <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/medication" element={<Medication />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
