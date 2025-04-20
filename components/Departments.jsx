"use client";

import "@styles/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

import {
  Edit,
  Trash,
  Folder,
  ChevronRight,
  Building,
  BookOpen,
  FileText,
  Users,
} from "lucide-react";

const Departments = () => {
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
      try {
       
        const response = await fetch(`/api/department?type=${type}`, {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok ) {
          setDepartments(data);
        } else {
          setDepartments([]);
        }
      } catch (err) {
        console.error("Failed to fetch departments", err);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [type]);


  useEffect(() => {
    setDepartmentType(type === "uni" ? "uni" : "admin");
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
        body: JSON.stringify({ name: editedDepartmentName, type: editedType }),
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
        alert("Item deleted successfully!");
      } else {
        alert("Failed to delete department");
      }
    }
  };

  // Function to get a random background pattern class
  const getPatternClass = (index) => {
    const patterns = [
      "bg-gradient-to-br from-[#3B5FE3]/5 to-[#1E213A]/5",
      "bg-gradient-to-tr from-[#3B5FE3]/5 to-[#1E213A]/5",
      "bg-gradient-to-r from-[#3B5FE3]/5 to-[#1E213A]/5",
    ];
    return patterns[index % patterns.length];
  };

  // Function to get a random icon
  const getDepartmentIcon = (type, index) => {
    if (type === "uni") {
      const icons = [<BookOpen key={1} />, <FileText key={2} />];
      return icons[index % icons.length];
    } else {
      const icons = [<Building key={1} />, <Users key={2} />];
      return icons[index % icons.length];
    }
  };

  return (
    
    <div className="p-5 bg-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#111827]">
            {type === "uni" ? "University Departments" : "Admin Departments"}
          </h1>
          <p className="text-[#6B7280] mt-1">
            Manage and access your departments
          </p>
        </div>
        <button
          onClick={() => setShowInput(!showInput)}
          className="px-5 py-2.5 bg-black text-white rounded-md relative group text-center transition-transform transform hover:scale-110 duration-300 flex items-center gap-2 shadow-sm">
          <Folder size={18} />
          Add Department
        </button>
      </div>

      {showInput && (
        <div className="mt-1 mb-8 p-6 rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-medium text-[#111827] mb-4">
            Add New Department
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Department Name"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              className="px-3 py-2.5 flex-1 border border-[#F3F4F6] rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none"
            />
            <select
              value={departmentType}
              onChange={(e) => setDepartmentType(e.target.value)}
              className="px-3 py-2.5 border border-[#F3F4F6] rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none sm:w-40">
              <option value="uni">University</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={addDepartment}
              className="px-5 py-2.5 bg-[#3B5FE3] text-white rounded-md hover:bg-[#3051C6] transition-colors shadow-sm">
              Add Department
            </button>
          </div>
        </div>
      )}
      {departments.length === 0 ? (
        <div className="mt-8 p-8 text-center border-dashed border-[#F3F4F6] rounded-lg">
          <div className="inline-flex p-4 rounded-full bg-[#F3F4F6] mb-4">
            <Folder size={32} className="text-[#6B7280]" />
          </div>
          <p className="text-[#6B7280] text-lg">No departments available</p>
          <p className="text-[#6B7280] text-sm mt-2">
            Click "Add Department" to create your first department
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {departments.map((dept, index) => (
            <div
              key={dept._id}
              onClick={() => goToDepartment(dept)}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white">
              {/* Card background with pattern */}
              <div
                className={`absolute inset-0 ${getPatternClass(index)}`}></div>

              {/* Decorative circles */}
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#3B5FE3]/10 group-hover:bg-[#3B5FE3]/20 transition-colors"></div>
              <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-[#1E213A]/5 group-hover:bg-[#1E213A]/10 transition-colors"></div>

              {/* Card content */}
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-white shadow-md text-[#3B5FE3] group-hover:text-white group-hover:bg-[#3B5FE3] transition-colors">
                    {getDepartmentIcon(dept.type, index)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[#111827] group-hover:text-[#3B5FE3] transition-colors">
                      {dept.name}
                    </h2>
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-center">
                  <div className="flex items-center gap-1 text-[#3B5FE3] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View Department <ChevronRight size={16} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => startEditing(dept, e)}
                      className="p-2 rounded-md bg-white shadow-sm text-[#6B7280] hover:text-[#3B5FE3] transition-colors">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDepartment(dept._id);
                      }}
                      className="p-2 rounded-md bg-white shadow-sm text-[#6B7280] hover:text-red-600 transition-colors">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingDepartmentId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-semibold text-[#111827] mb-6">
              Edit Department
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-[#6B7280]">
                Department Name
              </label>
              <input
                className="px-3 py-2.5 border border-[#F3F4F6] rounded-md w-full focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none"
                type="text"
                value={editedDepartmentName}
                onChange={(e) => setEditedDepartmentName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-[#6B7280]">
                Department Type
              </label>
              <select
                className="px-3 py-2.5 border border-[#F3F4F6] rounded-md w-full focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none"
                value={editedType}
                onChange={(e) => setEditedType(e.target.value)}>
                <option value="uni">University</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingDepartmentId(null)}
                className="flex-1 px-4 py-2.5 text-[#6B7280] rounded-md hover:bg-[#F3F4F6] transition-colors">
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 px-4 py-2.5 bg-[#3B5FE3] text-white rounded-md hover:bg-[#3051C6] transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
