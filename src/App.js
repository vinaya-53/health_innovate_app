import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Hospital_normal from "./pages/hospital_normal";
import Hospital_specific from "./pages/hospital_specific";
import Owner from "./pages/owner";

const App = () => {
  return (
    <Router>
      <Routes>
        <></>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hospital_normal" element={<Hospital_normal />} />
        <Route path="/hospital_specific" element={<Hospital_specific />} />
        <Route path="/owner" element={<Owner/>} />
      </Routes>
    </Router>
  );
};

export default App;
