import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthErrorCodes, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebaseApp, signInWithGooglePopup } from "../firebase/firebaseConfig";
import "../style/Signup.css"
import TextToSpeech from "./TextToSpeech";

function Signup() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const auth = getAuth(firebaseApp);

  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    console.log(response);
    navigate("/Profile");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    let email = input.email.toLowerCase().trim();
    let password = input.password;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential.user);
      navigate("/Profile")
    })
    .catch((err) => {
      if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
        setError("Password is too weak.");
      } else if (err.code === AuthErrorCodes.EMAIL_EXISTS) {
        setError("The email address is already is use.") 
      } else {
        console.log(err.code);
        alert(err.code);
      }
    });
  };

   const handleChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="form-body">
      <form autoComplete="off" className="form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <p>Fill the form below to create your account.</p>
        <div className="email-input">
          <input
            name="email"
            placeholder="Enter email"
            type="text"
            onChange={handleChange}
            value={input.email}
            required
            autoComplete="true"
          />
        </div>
        <div className="password-input">
          <input
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            value={input.password}
            type="password"
            required
            autoComplete="true"
          />
        </div>
        <div className="btn">
          {error ? <p className="login-error">{error}</p> : null}
          <button title="Sign up" aria-label="Signup" type="submit">
            Create account
          </button>
          <button onClick={logGoogleUser}>Sign Up With Google</button>
        </div>
      </form>
      <div className="option">
        <p>
          Already have an account?
          <Link to="/login">Sign in</Link>
        </p>
      </div>
      <TextToSpeech/>
    </div>
  );
}
export default Signup;
