import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, where, query, orderBy, limit } from 'firebase/firestore';
import { app, db } from '../firebaseConfig'; // Import the initialized app
import { useLocation } from 'react-router-dom'; // Use react-router-dom for navigation

const Hospital_normal = () => {
  const location = useLocation();
  const { hospitalName } = location.state; // Get hospital name passed from the previous page
  const [hospitalData, setHospitalData] = useState(null);

  useEffect(() => {
    const db = getFirestore(app); // Get Firestore instance
    const fetchData = async () => {
      try {
        // Query to get the latest data for the specific hospital from the 'hospital' collection
        const q = query(
          collection(db, 'hospital'), // Query the 'hospital' collection
          where('name', '==', hospitalName), // Filter by hospital name
          orderBy('date', 'desc'), // Order by date to get the latest entry
          limit(1) // Get only the latest document
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setHospitalData(data);
        } else {
          console.log("No data found for the specified hospital.");
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [hospitalName]); // Run effect when hospitalName changes

  if (!hospitalData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{hospitalName}</h1>

      {/* Iterate through the data keys to display them */}
      {Object.keys(hospitalData).map((key) => {
        if (key !== 'tot_no_patients' && key !== 'date' && key !== 'name') {
          return (
            <div key={key} style={{ marginBottom: 20 }}>
              <img
                src="path_to_icon.png" // Use your icon here
                alt={key}
                style={{ width: 50, height: 50 }}
              />
              <p>{key.replace(/_/g, ' ')}: {hospitalData[key]}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Hospital_normal;
