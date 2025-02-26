import './App.css';
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './pages/Navbar'

function App() {
  return (
    <>
    <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
