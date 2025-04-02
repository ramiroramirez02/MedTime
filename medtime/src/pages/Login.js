import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  AuthErrorCodes, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp, signInWithGooglePopup } from "../firebase/firebaseConfig";
import "../style/Signup.css"
import TextToSpeech from "./TextToSpeech";

function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // initialised auth instance
  const auth = getAuth(firebaseApp);

  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    console.log(response);
    navigate("/Profile");
  }

// handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    let email = input.email.toLowerCase().trim();
    let password = input.password;

    
    // sign in user
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        console.log(userCredential.user);
        // ...
        navigate("/Profile");
      })
      .catch((err) => {
        if (
        err.code === AuthErrorCodes.INVALID_PASSWORD ||
        err.code === AuthErrorCodes.USER_DELETED
      ) {
        setError("The email address or password is incorrect");
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
        <h1>Log In</h1>
        <p>Fill the form below to sign in to your account.</p>
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
          <button title="Login" aria-label="Login" type="submit">
            Login
          </button>
          <button onClick={logGoogleUser}>Sign In With Google</button>
        </div>
      </form>
      <div className="option">
        <p>
          Don't have an account?
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
      <TextToSpeech/>
    </div>
  );
}

export default Login;
