import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore"; // Import Firestore methods
import { app } from '../firebaseConfig'; // Import initialized Firebase app
import Papa from 'papaparse';
import './hospital_specific.css';

const HospitalSpecific = () => {
  const [formData, setFormData] = useState({
    dateYear: '',
    dateMonth: '',
    dateDay: '',
  });

  const [predictedData, setPredictedData] = useState([]);
  const [predictedValues, setPredictedValues] = useState(null);
  const [ownerData, setOwnerData] = useState([]); // State to store owner data

  const resourceRatios = {
    syringes: 1,
    iv_fluid: 2,
    vaccines: 1,
    testing_kits: 1,
    oxygen_cylinders: 0.5,
    blood_units: 0.2,
    surgical_kits: 1,
  };

  const calculateRequiredResources = (numOfPatients) => {
    let requiredResources = {};
    for (const [resource, ratio] of Object.entries(resourceRatios)) {
      requiredResources[resource] = Math.round(numOfPatients * ratio);
    }
    return requiredResources;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CSV data
        const response = await fetch('forecast_results.csv');
        const csvData = await response.text();
        const parsedData = Papa.parse(csvData, { header: true }).data;
        setPredictedData(parsedData);
      } catch (error) {
        console.error('Error fetching the CSV file:', error);
      }
    };

    const fetchOwnerData = async () => {
      try {
        // Fetch owner data from Firestore
        const db = getFirestore(app);
        const ownerCollection = collection(db, 'owner');
        const ownerSnapshot = await getDocs(ownerCollection);
        const ownerDetails = ownerSnapshot.docs.map((doc) => doc.data());
        setOwnerData(ownerDetails);
      } catch (error) {
        console.error('Error fetching owner data:', error);
      }
    };

    fetchData();
    fetchOwnerData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePrediction = () => {
    const formattedInputDate = `${formData.dateYear}-${formData.dateMonth.padStart(2, '0')}-${formData.dateDay.padStart(2, '0')}`;
    const foundPrediction = predictedData.find((item) => item.ds === formattedInputDate);
    setPredictedValues(foundPrediction || null);
  };

  const predictedResources = predictedValues ? calculateRequiredResources(predictedValues.yhat) : null;

  const formatResourceName = (resource) => {
    return resource.replace(/_/g, ' ')
                   .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="hospital-specific">
      <div className="main-content">
        <div className="calendar-section">
          <h3>Enter Date for Prediction</h3>
          <input
            type="number"
            name="dateYear"
            value={formData.dateYear}
            onChange={handleChange}
            placeholder="Year"
          />
          <input
            type="number"
            name="dateMonth"
            value={formData.dateMonth}
            onChange={handleChange}
            placeholder="Month"
          />
          <input
            type="number"
            name="dateDay"
            value={formData.dateDay}
            onChange={handleChange}
            placeholder="Day"
          />
          <button onClick={handlePrediction}>Predict</button>

          {predictedValues ? (
            <>
              <h3>Predicted Patients: {Math.round(predictedValues.yhat)}</h3>
              <div className="predicted-resources">
                <h4>REQUIRED RESOURCES:</h4>
                {Object.keys(predictedResources || {}).map((resource) => (
                  <div key={resource}>
                    <strong>{formatResourceName(resource)}:</strong> {predictedResources[resource]}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <h3>Prediction Not Available</h3>
          )}
        </div>

        {/* Display Owner Data */}
        <div className="owner-section">
          <h3>Supplier Details</h3>
          {ownerData.length > 0 ? (
            ownerData.map((owner, index) => (
              <div key={index} className="owner-card" style={{
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '10px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              }}>
                <p style={{ margin: '0 20px' }}>
                  <strong>Name:</strong> <span style={{ color: 'blue', fontWeight: 'bold' }}>{owner.name}</span>
                </p>
                <p style={{ margin: '0 20px' }}>
                  <strong>Contact:</strong> {owner.contacts}
                </p>
                <p style={{ margin: '0 20px' }}>
                  <strong>Product:</strong> {owner.product_name}
                </p>
                <p style={{ margin: '0 20px' }}>
                  <strong>Price per Unit:</strong> {owner.price_per_unit}
                </p>
                <p style={{ margin: '0 20px' }}>
                  <strong>Quantity:</strong> {owner.quantity}
                </p>
              </div>
            ))
          ) : (
            <p>No supplier details available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalSpecific;
