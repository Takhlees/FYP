"use client"

import '@styles/globals.css';
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: newCategory }),
      });

      if (response.ok) {
        const updatedCategories = await response.json();
        if (Array.isArray(updatedCategories)) {
          setCategories(["All", ...updatedCategories]); 
        }
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
  const handleDownload = async (doc) => {
    const response = await fetch(`/api/scanupload/${doc._id}`, {
      method: 'GET',
      headers: {
        'Content-Disposition': 'attachment', // Trigger the download in the backend
      },
    });
  
    if (!response.ok) {
      console.error('Failed to download file');
      return;
    }
  
    // Create a Blob from the response and trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.subject}.pdf`;  // You can set this dynamically if needed
    link.click();
    window.URL.revokeObjectURL(url);
  };
  

  return (
    <div className="p-6">
  <h1 className="text-2xl font-semibold mb-4">Department: {name}</h1>
  <div>
    <button
      onClick={() => setShowInput(!showInput)}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    >
      Add Category
    </button>
    {showInput && (
      <div className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Enter Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addCategory}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Add
        </button>
      </div>
    )}
  </div>
  
  <div className="mt-6">
    <h3 className="text-lg font-medium mb-2">Categories:</h3>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
    >
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
  
  <div className="mt-8">
    <h3 className="text-lg font-medium mb-2">Files:</h3>
    <div className="space-y-4">
      {files.length > 0 ? (
        files.map((doc) => (
          <div
            key={doc._id}
            className="flex flex-row items-center justify-between p-4 border border-gray-300 rounded-md bg-gray-50 shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{doc.subject}</h3>
            <p className="text-sm text-gray-500">
              {new Date(doc.date).toLocaleDateString("en-GB")}
            </p>
            <p className="text-sm text-gray-700">Diary No: {doc.diaryNo}</p>
            <p className="text-sm text-gray-700">Status: {doc.status}</p>
            <div className="mt-2 flex gap-4">
              <a
                href={`/api/scanupload/${doc._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View File
              </a>
              <a
                onClick={() => handleDownload(doc)}
                download
                className="text-green-500 hover:underline cursor-pointer"
              >
                Download File
              </a>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No files available for this category.</p>
      )}
    </div>
  </div>
</div>

  );
}
