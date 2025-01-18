import React, { useState } from "react";
import { db } from "../firebaseConfig"; // Import Firebase configuration
import { collection, addDoc } from "firebase/firestore";

const Owner = () => {
  const [formData, setFormData] = useState({
    contacts: "",
    price_per_unit: "",
    product_name: "",
    quantity: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Input validation (optional)
    if (
      !formData.contacts ||
      !formData.price_per_unit ||
      !formData.product_name ||
      !formData.quantity
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "owner"), {
        contacts: Number(formData.contacts), // Convert to number
        price_per_unit: Number(formData.price_per_unit), // Convert to number
        product_name: formData.product_name,
        quantity: Number(formData.quantity), // Convert to number
      });
      setSuccess(`Document successfully written with ID: ${docRef.id}`);
      setFormData({
        contacts: "",
        price_per_unit: "",
        product_name: "",
        quantity: "",
      });
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Error adding document: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Owner Details Form</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Contacts:</label>
          <input
            type="number"
            name="contacts"
            value={formData.contacts}
            onChange={handleChange}
            placeholder="Enter contact number"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Price per Unit:</label>
          <input
            type="number"
            name="price_per_unit"
            value={formData.price_per_unit}
            onChange={handleChange}
            placeholder="Enter price per unit"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Product Name:</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Owner;
