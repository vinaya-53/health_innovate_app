import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { app } from "../firebaseConfig"; // Import the initialized app
import { useLocation, useNavigate } from "react-router-dom"; // Use react-router-dom for navigation

// Import images explicitly
import bloodBagIcon from "../images/blood-bag.png";
import ivFluidIcon from "../images/iv_fluid2.jpg";
import vaccineIcon from "../images/surgical-instrument.png";
import testingKitIcon from "../images/testing-kit.png";
import oxygenCylinderIcon from "../images/vaccine.png";
import bloodBagAlternateIcon from "../images/oxygen.png";
import surgicalComponentsIcon from "../images/testing-kit2.png.jpg";

const Hospital_normal = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation
  const { hospitalName } = location.state; // Get hospital name passed from the previous page
  const [hospitalData, setHospitalData] = useState(null);
  const [ownerData, setOwnerData] = useState([]); // State to store data from 'owner' collection

  // Mapping of keys to imported image paths
  const iconMapping = {
    syringes: bloodBagIcon,
    iv_fluid: ivFluidIcon,
    vaccines: vaccineIcon,
    testing_kits: testingKitIcon,
    oxygen_cylinder: oxygenCylinderIcon,
    blood_bag: bloodBagAlternateIcon,
    surgical_components: surgicalComponentsIcon,
  };

  useEffect(() => {
    const db = getFirestore(app); // Get Firestore instance

    const fetchHospitalData = async () => {
      try {
        // Query to get the latest data for the specific hospital from the 'hospital' collection
        const q = query(
          collection(db, "hospital"), // Query the 'hospital' collection
          where("name", "==", hospitalName), // Filter by hospital name
          orderBy("date", "desc"), // Order by date to get the latest entry
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
        console.error("Error fetching hospital data: ", error);
      }
    };

    const fetchOwnerData = async () => {
      try {
        // Query to fetch all data from the 'owner' collection
        const q = collection(db, "owner");
        const querySnapshot = await getDocs(q);

        const ownerDetails = querySnapshot.docs.map((doc) => doc.data());
        setOwnerData(ownerDetails);
      } catch (error) {
        console.error("Error fetching owner data: ", error);
      }
    };

    fetchHospitalData();
    fetchOwnerData();
  }, [hospitalName]);

  if (!hospitalData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Navigation Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => navigate("/hospital_specific")}
          style={{
            backgroundColor: "#007BFF",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          View Details
        </button>
      </div>

      <h1>{hospitalName}</h1>

      {/* Display hospital data */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {Object.keys(hospitalData).map((key) => {
          if (key !== "tot_no_patients" && key !== "date" && key !== "name") {
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "150px",
                }}
              >
                {/* Display the specific icon for each key */}
                <img
                  src={iconMapping[key] || "/icons/default_icon.png"} // Use specific icon or fallback to default
                  alt={key}
                  style={{
                    width: 50,
                    height: 50,
                    marginBottom: 10,
                    border: "2px solid #ccc", // Add border
                    borderRadius: "8px", // Optional: round corners
                    padding: "5px", // Add padding around the icon
                  }}
                />
                <p style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold" }}>
                  {key.replace(/_/g, " ")}
                </p>
                <p style={{ textAlign: "center", fontSize: "14px" }}>
                  {hospitalData[key]}
                </p>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Display owner data */}
      <div style={{ marginTop: "30px" }}>
        <h2>Supplier Details</h2>
        {ownerData.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p>
              <strong>Contact:</strong> {item.contacts}
            </p>
            <p>
              <strong>Product:</strong> {item.product_name}
            </p>
            <p>
              <strong>Price per Unit:</strong> {item.price_per_unit}
            </p>
            <p>
              <strong>Quantity:</strong> {item.quantity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hospital_normal;


