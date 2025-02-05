"use client"

import '@styles/globals.css';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import {Edit, Trash } from "lucide-react";

 const Departments = () =>{
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [departmentType, setDepartmentType] = useState("uni"); 
  const [showInput, setShowInput] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [editedDepartmentName, setEditedDepartmentName] = useState("");
  const [editedType, setEditedType] = useState(type);
  
  
  const router = useRouter();

  // Fetch departments from the backend

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch(`/api/department?type=${type}`, {
        method: "GET",
      });
      const data = await response.json();
      setDepartments(data);
    };
    fetchDepartments();
  }, [type]);
  
  const addDepartment = async () => {
    if (newDepartment.trim()) {
      const response = await fetch("/api/department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newDepartment, type: departmentType }),
      });

      if (response.ok) {
        const newDept = await response.json();
        setDepartments([...departments, newDept]);
        setNewDepartment("");
        setDepartmentType("uni");
        setShowInput(false); 
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
    setEditedType(department.type);
  };

  const saveEdit = async () => {
    if (editedDepartmentName.trim() && editedType.trim()) {
      const response = await fetch(`/api/department/${editingDepartmentId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editedDepartmentName, type:editedType}),
      });
      
      if (response.ok) {
        const updatedDept = await response.json();
        setDepartments(
          departments.map((dept) =>
            dept._id === updatedDept._id ? updatedDept : dept
          )
        );
        setEditingDepartmentId(null);
        setEditedDepartmentName("");
        setEditedType("");
      } else {
        alert("Failed to update department");
      }
    }
  };

  const deleteDepartment = async (id) => {
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    if (isConfirmed) {
    const response = await fetch(`/api/department/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setDepartments(departments.filter((dept) => dept._id !== id));
      alert("Item deleted successfully!")
    } else {
      alert("Failed to delete department");
    }
  }
  };


  
  return (
    <div className="p-6">
     <h1 className="text-3xl font-semibold mb-4">{type === "uni" ? "University Departments" : "Admin Departments"}</h1>
      <button onClick={() => setShowInput(!showInput)} className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Add Department
      </button>
      {showInput && (
        <div className="mt-1 space-y-1">
          <input
            type="text"
            placeholder="Enter Department Name"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-md "
          />
         
          <button onClick={addDepartment} className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md">Add</button>
        </div>
      )}
     {departments.length === 0 ? (
        <p className="mt-4 text-gray-500">No departments available</p>
      ) : (
        <div
         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10"
        >
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="relative p-4 h-32 border border-gray-300 rounded-md bg-gray-100 shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
              onClick={() => goToDepartment(dept)}
            >
               <h2 className="text-lg font-medium">{dept.name}</h2>
              <div
                className="flex justify-end gap-2"
              >
                <button onClick={(e) => startEditing(dept, e)} className="px-2 py-1 bg-yellow-400 text-white rounded-md"><Edit size={20} /></button>
                <button onClick={(e) => { e.stopPropagation(); deleteDepartment(dept._id); }} className="px-2 py-1 bg-red-500 text-white rounded-md">
                <Trash size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editingDepartmentId && (
        <div className="mt-6 space-y-4">
          <input
          className="px-3 py-2 border border-gray-300 rounded-md w-full"
            type="text"
            value={editedDepartmentName}
            onChange={(e) => setEditedDepartmentName(e.target.value)}
          />
           <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Department Type:</label>
        <select
        className="px-3 py-2 border border-gray-300 rounded-md w-full"
          value={editedType}
          onChange={(e) => setEditedType(e.target.value)}
        >
          <option value="uni">University</option>
          <option value="admin">Admin</option>
        </select>
      </div>
          <button onClick={saveEdit} className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Save</button>
        </div>
       
      )}
    </div>
  );
}

export default Departments;
