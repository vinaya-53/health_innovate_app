import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, where, query, orderBy, limit } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useLocation, useNavigate } from "react-router-dom"; // React Router for navigation

// Import images explicitly
import bloodBagIcon from "../images/blood bag.png";
import ivFluidIcon from "../images/iv-drip (1).png";
import vaccineIcon from "../images/vaccine (1).png";
import testingKitIcon from "../images/testing kit (1).png";
import oxygenCylinderIcon from "../images/oxygen_cylinder.png";
import syrinIcon from "../images/syringes.png";
import surgicalComponentsIcon from "../images/surgical-instrument (1).png";
import defaultProfile from "../images/profile.png.jpg"; // Default profile image

const Hospital_normal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hospitalName } = location.state;
  const [hospitalData, setHospitalData] = useState(null);
  const [ownerData, setOwnerData] = useState([]);

  useEffect(() => {
    const db = getFirestore(app);

    const fetchHospitalData = async () => {
      try {
        const q = query(
          collection(db, "hospital"),
          where("name", "==", hospitalName),
          orderBy("date", "desc"),
          limit(1)
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
    <div style={styles.container}>
      <div style={styles.buttonContainer}>
        <button
          onClick={() => navigate("/hospital_specific")}
          style={styles.viewDetailsButton}
        >
          Specific Mode
        </button>
      </div>

      <h1>{hospitalName} - Equipment Stocks</h1>

      <div style={styles.iconGrid}>
  {/* Icon containers */}
  <div style={styles.iconContainer}>
    <img
      src={bloodBagIcon}
      alt="blood_bag"
      style={styles.iconImage}
    />
    <p style={styles.iconLabel}>Blood Bag</p>
    <div style={styles.valueBox}>
      <p>{hospitalData?.blood_bag}</p>
    </div>
  </div>

  <div style={styles.iconContainer}>
    <img
      src={ivFluidIcon}
      alt="iv_fluid"
      style={styles.iconImage}
    />
    <p style={styles.iconLabel}>IV Fluid</p>
    <div style={styles.valueBox}>
      <p>{hospitalData?.iv_fluid}</p>
    </div>
  </div>

  <div style={styles.iconContainer}>
    <img
      src={vaccineIcon}
      alt="vaccines"
      style={styles.iconImage}
    />
    <p style={styles.iconLabel}>Vaccines</p>
    <div style={styles.valueBox}>
      <p>{hospitalData?.vaccines}</p>
    </div>
  </div>

  <div style={styles.iconContainer}>
    <img
      src={testingKitIcon}
      alt="testing_kits"
      style={styles.iconImage}
    />
    <p style={styles.iconLabel}>Testing Kits</p>
    <div style={styles.valueBox}>
      <p>{hospitalData?.testing_kits}</p>
    </div>
  </div>

  <div style={styles.iconContainer}>
    <img
      src={oxygenCylinderIcon}
      alt="oxygen_cylinder"
      style={styles.iconImage}
    />
    <p style={styles.iconLabel}>Oxygen Cylinder</p>
    <div style={styles.valueBox}>
      <p>{hospitalData?.oxygen_cylinder}</p>
    </div>
  </div>

  <div style={styles.iconContainer}>
    <img
      src={syrinIcon}
      alt="syringes"
      style={styles.iconImage}
    />
    <p style={styles.iconLabel}>Syringes</p>
    <div style={styles.valueBox}>
      <p>{hospitalData?.syringes}</p>
    </div>
  </div>

  <div style={styles.iconContainer}>
    <img
      src={surgicalComponentsIcon}
      alt="surgical_components"
      style={styles.iconImage}
    />
    <p style={styles.iconLabel}>Surgical Components</p>
    <div style={styles.valueBox}>
      <p>{hospitalData?.surgical_components}</p>
    </div>
  </div>
</div>


<div style={styles.supplierDetails}>
  <h2>Supplier Details</h2>
  {ownerData.map((item, index) => (
    <div key={index} style={styles.messageBox}>
      <div style={styles.profileRow}>
        <img
          src={item.profileImage || defaultProfile}
          alt="profile"
          style={styles.profileImage}
        />
        <div style={styles.messageContent}>
  <h3>{item.name}</h3>
  <div style={styles.detailsRow}>
    <div>
    <p style={styles.subtitle}>
      <span style={styles.label}>product-name : </span> {item.product_name}</p>
    </div>
    <p style={styles.subtitle}>
      <span style={styles.label}>contact : </span> {item.contacts}
    </p>
    <p style={styles.subtitle}>
      <span style={styles.label}>price : </span> {item.price_per_unit}
    </p>
    <p style={styles.subtitle}>
      <span style={styles.label}>qty : </span> {item.quantity}
    </p>
  </div>
</div>

  </div>
  </div>
  ))}
</div>
</div>
  );
};

// Define styles object
const styles = {
  container: {
    padding: 20,
    backgroundColor: "#daf0ff",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  viewDetailsButton: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  iconGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },
  iconContainerHover: {
    transform: "scale(1.05)",
  },
  iconImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    border: "2px solid #ccc",
    borderRadius: 8,
    padding: 5,
  },
  iconLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  supplierDetails: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  messageBox: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '20px',
  },
  profileImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  detailsRow: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    marginTop: '10px',
    justifyContent: 'space-between',
    width: '100%',
  },
  subtitle: {
    fontSize: '16px',
    margin: 0,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',  // Darken the text before the colon
  },

  valueBox: {
    padding: '1px',
    backgroundColor: 'rgba(108, 139, 252, 0.96)',
    color: 'white',
    borderRadius: '8px',
    width: '100%',
    textAlign: 'center',
    fontSize: '16px',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
  },
  // Hover effect
  iconContainerHover: {
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
  },
  valueBoxHover: {
    '&:hover': {
      backgroundColor: '#45a049',
      transform: 'scale(1.1)',
    },
  },
};

export default Hospital_normal;
