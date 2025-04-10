import './App.css';
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";
import Navbar from './pages/Navbar';
import Profile from "./pages/Profile";
import Medication from './pages/Medication';
import Auth from "./pages/Auth";

function App() {
  return (
    <>
    <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/medication" element={<Medication />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
