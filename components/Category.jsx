"use client"
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const DepartmentPage = () => {
  const { state } = useLocation();
  const { department } = state;
  const [categories, setCategories] = useState(department.categories || []);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  return (
    <div>
      <h2>Department: {department.name}</h2>
      <div>
        <input
          type="text"
          placeholder="Add Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={addCategory}>Add</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>Categories:</h3>
        <select>
          <option value="" disabled selected>
            Select a Category
          </option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DepartmentPage;
