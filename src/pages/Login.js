import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Firebase configuration
import "./Login.css"; // CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState(""); // New state for location
  const [type, setType] = useState(""); // New state for type
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const username = userCredential.user.displayName || "Guest";
      navigate("/home", { state: { username } }); // Navigate to the home page
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      // Add user details to Firestore with email as the document ID
      const user = userCredential.user;
      await setDoc(doc(db, "user", email), {
        id: user.uid, // Firebase Authentication user ID
        username, // Username entered during sign-up
        location, // Location provided by the user
        type, // Type provided by the user
        email, // Email address as a field
      });

      navigate("/home", { state: { username } }); // Navigate to the home page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>{isSignUp ? "Sign Up" : "Login"}</h1>
      </div>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="login-form">
        {isSignUp && (
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isSignUp && (
          <>
            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                placeholder="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="type">Type</label>
              <input
                type="text"
                id="type"
                placeholder="Enter Type (e.g., hospital)"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              />
            </div>
          </>
        )}
        {!isSignUp && (
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
        )}
        <button type="submit" className="login-btn">
          {isSignUp ? "Sign Up" : "Log In"}
        </button>
      </form>
      {!isSignUp && (
        <Link to="/reset-password" className="forgot-password">
          Forgot Password?
        </Link>
      )}
      <div className="signup-link">
        <p>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => {
              setError("");
              setIsSignUp(!isSignUp);
            }}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;



//bedtimestories5322@gmail.com
//bedtimes12345
