import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebaseConfig";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/"); // Redirect to Login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };



  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <button style={styles.navButton} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to home!</h1>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    color: "white",
    background: "linear-gradient(135deg, #1a1a40, #4e148c,rgb(188, 162, 237))",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  navbar: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    padding: "10px 20px",
    position: "absolute",
    top: 0,
    right: 0,
  },
  navButton: {
    marginLeft: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "white",
    border: "2px solid white",
    borderRadius: "5px",
    transition: "0.3s ease",
  },
  content: {
    textAlign: "center",
    maxWidth: "600px",
    marginBottom: "50px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "10px",
  },
  sessionButton: {
    marginTop: "20px",
    padding: "15px 30px",
    fontSize: "18px",
    cursor: "pointer",
    backgroundColor: "#ff007f",
    color: "white",
    border: "none",
    borderRadius: "25px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "0.3s ease",
  },
  robotContainer: {
    position: "absolute",
    bottom: "30px",
    right: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  robot: {
    width: "120px",
    height: "auto",
  },
  robotSpeech: {
    marginBottom: "10px",
    backgroundColor: "white",
    color: "#4e148c",
    padding: "10px 15px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    fontSize: "14px",
    textAlign: "center",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    color: "#4e148c",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    zIndex: 1000,
  },
  modalTitle: {
    fontSize: "1.5rem",
    marginBottom: "20px",
  },
  modalButton: {
    padding: "10px 20px",
    margin: "10px",
    fontSize: "16px",
    backgroundColor: "#4e148c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s ease",
  },
  cancelButton: {
    padding: "10px 20px",
    margin: "10px",
    fontSize: "16px",
    backgroundColor: "#ff6f61",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s ease",
  },
};

export default Home;
