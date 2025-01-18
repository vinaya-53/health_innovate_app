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
        contacts: Number(formData.contacts),
        price_per_unit: Number(formData.price_per_unit),
        product_name: formData.product_name,
        quantity: Number(formData.quantity),
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
    <div
      style={{
        maxWidth: "500px",
        margin: "30px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#4a4a4a",
          marginBottom: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Owner Details Form
      </h2>
      {error && (
        <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ color: "green", textAlign: "center", fontWeight: "bold" }}>
          {success}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#4a4a4a",
              fontWeight: "bold",
            }}
          >
            Contacts:
          </label>
          <input
            type="number"
            name="contacts"
            value={formData.contacts}
            onChange={handleChange}
            placeholder="Enter contact number"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#4a4a4a",
              fontWeight: "bold",
            }}
          >
            Price per Unit:
          </label>
          <input
            type="number"
            name="price_per_unit"
            value={formData.price_per_unit}
            onChange={handleChange}
            placeholder="Enter price per unit"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#4a4a4a",
              fontWeight: "bold",
            }}
          >
            Product Name:
          </label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#4a4a4a",
              fontWeight: "bold",
            }}
          >
            Quantity:
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#5c67f2",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Owner;
