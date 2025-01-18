import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebaseConfig";

const Hospital_specific = () => {
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

export default Hospital_specific;
/*
import React, { useState, useEffect } from 'react';
import { auth, db } from "../firebaseConfig";
import { DatePicker } from 'react-date-picker';
import Papa from 'papaparse';
import './hospital_specific.css'; // Import your custom styles

const HospitalSpecific = () => {
  const [formData, setFormData] = useState({
    date: '',
    no_of_patients: '',
    syringes_left_in_stock: '',
    iv_fluid_left_in_stock: '',
    vaccines_left_in_stock: '',
    testing_kits_left_in_stock: '',
    oxygen_cylinders_left_in_stock: '',
    blood_units_left_in_stock: '',
    surgical_kits_left_in_stock: ''
  });

  const [currentValues, setCurrentValues] = useState({});
  const [predictedData, setPredictedData] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  
  // Resource ratios (resources per patient)
  const resourceRatios = {
    syringes_left_in_stock: 1, // 1 syringe per patient
    iv_fluid_left_in_stock: 2, // 2 units of IV fluid per patient
    vaccines_left_in_stock: 1, // 1 vaccine per patient
    testing_kits_left_in_stock: 1, // 1 testing kit per patient
    oxygen_cylinders_left_in_stock: 0.5, // 0.5 oxygen cylinder per patient
    blood_units_left_in_stock: 0.2, // 0.2 blood units per patient
    surgical_kits_left_in_stock: 1, // 1 surgical kit per patient
  };

  // Calculate required resources based on number of patients
  const calculateRequiredResources = (numOfPatients) => {
    let requiredResources = {};
    
    for (const [resource, ratio] of Object.entries(resourceRatios)) {
      requiredResources[resource] = numOfPatients * ratio;
    }

    return requiredResources;
  };

  // Fetch data for the current day and suppliers list
  useEffect(() => {
    // Get current day data
    const today = new Date().toISOString().split('T')[0];
    db.ref('dailyData/' + today).once('value').then(snapshot => {
      setCurrentValues(snapshot.val() || {});
    });
    
    // Get supplier list
    db.ref('suppliers').once('value').then(snapshot => {
      setSuppliers(snapshot.val() || []);
    });

    // Fetch forecasted patients from CSV
    fetch('forecast_results.csv')
      .then(response => response.text())
      .then(csvData => {
        const parsedData = Papa.parse(csvData, { header: true }).data;
        setPredictedData(parsedData);
      });
  }, []);

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Submit form data to Firebase
  const handleSubmit = () => {
    if (formData.date) {
      // Calculate the required resources based on the number of patients
      const requiredResources = calculateRequiredResources(formData.no_of_patients);
      
      // Save to Firebase
      db.ref('dailyData/' + formData.date).set({
        ...formData,
        ...requiredResources
      });
      
      alert('Data submitted successfully!');
    }
  };

  // Handle date change in calendar
  const handleDateChange = (date) => {
    const selectedDate = date.toISOString().split('T')[0];
    setFormData({ ...formData, date: selectedDate });
  };

  // Get predicted number of patients and their limits for selected date
  const getPredictedPatients = (selectedDate) => {
    const prediction = predictedData.find(item => item.date === selectedDate);
    return prediction || null;
  };

  // Calculate required resources for the predicted number of patients
  const predictedValues = getPredictedPatients(formData.date);
  const predictedResources = predictedValues ? calculateRequiredResources(predictedValues.average_value) : null;
  const predictedResourcesLowerLimit = predictedValues ? calculateRequiredResources(predictedValues.lower_limit) : null;
  const predictedResourcesUpperLimit = predictedValues ? calculateRequiredResources(predictedValues.upper_limit) : null;

  return (
    <div className="hospital-specific">
      <header>
        <h1>Hospital Management System</h1>
        <div className="current-values">
          <p><strong>Syringes Left:</strong> {currentValues.syringes_left_in_stock || 'N/A'}</p>
          <p><strong>IV Fluid Left:</strong> {currentValues.iv_fluid_left_in_stock || 'N/A'}</p>
          <p><strong>Vaccines Left:</strong> {currentValues.vaccines_left_in_stock || 'N/A'}</p>
          <p><strong>Testing Kits Left:</strong> {currentValues.testing_kits_left_in_stock || 'N/A'}</p>
          <p><strong>Oxygen Cylinders Left:</strong> {currentValues.oxygen_cylinders_left_in_stock || 'N/A'}</p>
          <p><strong>Blood Units Left:</strong> {currentValues.blood_units_left_in_stock || 'N/A'}</p>
          <p><strong>Surgical Kits Left:</strong> {currentValues.surgical_kits_left_in_stock || 'N/A'}</p>
        </div>
      </header>

      <div className="main-content">
        <div className="form-section">
          <h2>Enter Daily Data</h2>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
          <input type="number" name="no_of_patients" placeholder="No. of Patients" onChange={handleChange} />
          <input type="number" name="syringes_left_in_stock" placeholder="Syringes Left" onChange={handleChange} />
          <input type="number" name="iv_fluid_left_in_stock" placeholder="IV Fluids Left" onChange={handleChange} />
          <input type="number" name="vaccines_left_in_stock" placeholder="Vaccines Left" onChange={handleChange} />
          <input type="number" name="testing_kits_left_in_stock" placeholder="Testing Kits Left" onChange={handleChange} />
          <input type="number" name="oxygen_cylinders_left_in_stock" placeholder="Oxygen Cylinders Left" onChange={handleChange} />
          <input type="number" name="blood_units_left_in_stock" placeholder="Blood Units Left" onChange={handleChange} />
          <input type="number" name="surgical_kits_left_in_stock" placeholder="Surgical Kits Left" onChange={handleChange} />
          <button onClick={handleSubmit}>Submit Data</button>
        </div>

        <div className="calendar-section">
          <h2>Select Date</h2>
          <DatePicker
            onChange={handleDateChange}
            value={new Date(formData.date)}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 90))}
          />
          {predictedValues ? (
            <>
              <h3>Predicted Patients: {predictedValues.average_value}</h3>
              <p><strong>Lower Limit:</strong> {predictedValues.lower_limit}</p>
              <p><strong>Upper Limit:</strong> {predictedValues.upper_limit}</p>
            </>
          ) : (
            <h3>Prediction Not Available</h3>
          )}

          {predictedResources && (
            <div className="predicted-resources">
              <h4>Predicted Resource Requirements (Average):</h4>
              <ul>
                <li>Syringes: {predictedResources.syringes_left_in_stock}</li>
                <li>IV Fluids: {predictedResources.iv_fluid_left_in_stock}</li>
                <li>Vaccines: {predictedResources.vaccines_left_in_stock}</li>
                <li>Testing Kits: {predictedResources.testing_kits_left_in_stock}</li>
                <li>Oxygen Cylinders: {predictedResources.oxygen_cylinders_left_in_stock}</li>
                <li>Blood Units: {predictedResources.blood_units_left_in_stock}</li>
                <li>Surgical Kits: {predictedResources.surgical_kits_left_in_stock}</li>
              </ul>
            </div>
          )}

          {predictedResourcesLowerLimit && predictedResourcesUpperLimit && (
            <div className="predicted-resources-limits">
              <h4>Resource Requirements (Limits):</h4>
              <ul>
                <li><strong>Lower Limit:</strong> Syringes: {predictedResourcesLowerLimit.syringes_left_in_stock}, IV Fluids: {predictedResourcesLowerLimit.iv_fluid_left_in_stock}, Vaccines: {predictedResourcesLowerLimit.vaccines_left_in_stock}, Testing Kits: {predictedResourcesLowerLimit.testing_kits_left_in_stock}, Oxygen Cylinders: {predictedResourcesLowerLimit.oxygen_cylinders_left_in_stock}, Blood Units: {predictedResourcesLowerLimit.blood_units_left_in_stock}, Surgical Kits: {predictedResourcesLowerLimit.surgical_kits_left_in_stock}</li>
                <li><strong>Upper Limit:</strong> Syringes: {predictedResourcesUpperLimit.syringes_left_in_stock}, IV Fluids: {predictedResourcesUpperLimit.iv_fluid_left_in_stock}, Vaccines: {predictedResourcesUpperLimit.vaccines_left_in_stock}, Testing Kits: {predictedResourcesUpperLimit.testing_kits_left_in_stock}, Oxygen Cylinders: {predictedResourcesUpperLimit.oxygen_cylinders_left_in_stock}, Blood Units: {predictedResourcesUpperLimit.blood_units_left_in_stock}, Surgical Kits: {predictedResourcesUpperLimit.surgical_kits_left_in_stock}</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <footer>
        <h3>Suppliers</h3>
        <ul>
          {suppliers.map(supplier => (
            <li key={supplier.name}>
              <strong>{supplier.name}</strong> sells {supplier.resource} at {supplier.price}
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
};

export default HospitalSpecific;
*/
