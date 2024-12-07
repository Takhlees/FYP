"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [editedDepartmentName, setEditedDepartmentName] = useState("");

  const router = useRouter();

  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch("/api/department", {
        method: "GET",
      });
      const data = await response.json();
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  const addDepartment = async () => {
    if (newDepartment.trim()) {
      const response = await fetch("/api/department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newDepartment }),
      });

      if (response.ok) {
        const newDept = await response.json();
        setDepartments([...departments, newDept]);
        setNewDepartment("");
        setShowInput(false); // Hide the input field after adding
      } else {
        alert("Failed to add department");
      }
    }
  };

  const goToDepartment = (department) => {
    router.push({
      pathname: `/departments/${department._id}`,
      query: { name: department.name },
    });
  };

  const startEditing = (department, e) => {
    e.stopPropagation();
    setEditingDepartmentId(department._id);
    setEditedDepartmentName(department.name);
  };

  const saveEdit = async () => {
    console.log("done")
    if (editedDepartmentName.trim()) {
      const response = await fetch(`/api/department/${editingDepartmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editedDepartmentName }),
      });
      console.log("done")
      if (response.ok) {
        const updatedDept = await response.json();
        setDepartments(
          departments.map((dept) =>
            dept._id === updatedDept._id ? updatedDept : dept
          )
        );
        setEditingDepartmentId(null);
        setEditedDepartmentName("");
      } else {
        alert("Failed to update department");
      }
    }
  };

  const deleteDepartment = async (id) => {
    const response = await fetch(`/api/department/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setDepartments(departments.filter((dept) => dept._id !== id));
    } else {
      alert("Failed to delete department");
    }
  };

  return (
    <div>
      <h1>Departments</h1>
      <button onClick={() => setShowInput(!showInput)}>
        Add Department
      </button>
      {showInput && (
        <div>
          <input
            type="text"
            placeholder="Enter Department Name"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
          />
          <button onClick={addDepartment}>Add</button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {departments.map((dept) => (
          <div
            key={dept._id}
            style={{
               position: "relative",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
              background: "#f5f5f5",
            }}
            onClick={() => goToDepartment(dept)}
          >
            {dept.name}
            
            <div
              style={{
                margin: "5px",
                top: "5px",
                right: "5px",
                cursor: "pointer",
               
              }}
              className="menu-container"
              
            >
              <button onClick={(e) => startEditing(dept, e)}>Edit</button>
              <button onClick={(e) => {e.stopPropagation(); deleteDepartment(dept._id)}}>Delete</button>
                
            </div>
          </div>
        ))}
      </div>

      {editingDepartmentId && (
        <div>
          <input
            type="text"
            value={editedDepartmentName}
            onChange={(e) => setEditedDepartmentName(e.target.value)}
          />
          <button onClick={saveEdit}>Save</button>
        </div>
      )}
    </div>
  );
}
