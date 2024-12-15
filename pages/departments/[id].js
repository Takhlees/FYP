"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function DepartmentPage() {
  const router = useRouter();
  const { id, name } = router.query;

  const [categories, setCategories] = useState(["All"]);
  const [newCategory, setNewCategory] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");  // Default to "all"
  const [files, setFiles] = useState([]);

  // Fetch categories from the backend
  useEffect(() => {
    if (!id) return; // Wait for department id from query

    const fetchCategories = async () => {
      const response = await fetch(`/api/department/${id}`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(["All", ...data.categories]); // Add "all" as default option
      } else {
        console.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, [id]);

  // Fetch files based on selected category
  useEffect(() => {
    if (!selectedCategory || !id) return;
    fetchFiles(id, selectedCategory);
  }, [selectedCategory, id]);

  const addCategory = async () => {
    if (newCategory.trim()) {
      const response = await fetch(`/api/department/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: newCategory }),
      });

      if (response.ok) {
        const updatedCategories = await response.json();
        setCategories(["All", ...updatedCategories]); // Add "all" to the list
        setNewCategory("");
        setShowInput(false);
      } else {
        console.error("Failed to add category");
      }
    }
  };

  const fetchFiles = async (department, category) => {
    try {
      let url = `/api/scanupload?department=${department}`;
      if (category && category !== "All") {
        url += `&category=${category}`; // Add category filter if it's not "all"
      }

      const response = await fetch(url);
        if (response.ok) {
        const data = await response.json();
        setFiles(data); // Store in state
      } else {
        alert("Failed to fetch files");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  return (
    <div>
      <h1>Department : {name}</h1>
      <div>
        <button onClick={() => setShowInput(!showInput)}>
          Add Category
        </button>
        {showInput && (
          <div>
            <input
              type="text"
              placeholder="Enter Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={addCategory}>Add</button>
          </div>
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>Categories:</h3>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))
          ) : (
            <option>No categories available</option>
          )}
        </select>
      </div>

      <div>
        <h3>Files:</h3>
        <div>
          {files.length > 0 ? (
            files.map((doc) => (
              <div key={doc._id}>
                <h3>{doc.subject}</h3>
                <p>From: {doc.from}</p>
                <p>Status: {doc.status}</p>
                <a href={`/api/scanupload/${doc._id}`} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
                <a href={`/api/scanupload/${doc._id}`} target="_blank" rel="noopener noreferrer" download>
                  Download File
                </a>
              </div>
            ))
          ) : (
            <p>No files available for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}
