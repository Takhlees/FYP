"use client";

import '@styles/globals.css';
import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { jsPDF } from "jspdf";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/webpack";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ScanUpload = ({ action, onClose, initialData = null }) => {
  const [type, setType] = useState(initialData?.type || "");
  const [file, setFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(initialData?.department || "");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);
  const [diaryNo, setDiaryNo] = useState(initialData?.diaryNo || "");
  const [from, setFrom] = useState(initialData?.from || "");
  const [disposal, setDisposal] = useState(initialData?.disposal || "");
  const [status, setStatus] = useState(initialData?.status || "");
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);
  
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`/api/department?type=${type}`);
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };
    fetchDepartments();
  }, [type]);

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    const department = departments.find((dept) => dept._id === departmentId);
    setCategories(department?.categories || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("type", type);
    formData.append("department", selectedDepartment);
    formData.append("category", selectedCategory);
    formData.append("subject", subject);
    formData.append("date", date);
    formData.append("diaryNo", diaryNo);
    formData.append("from", from);
    formData.append("disposal", disposal);
    formData.append("status", status);

    try {
      const endpoint = initialData ? `/api/scanupload/${initialData._id}` : "/api/scanupload";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert(`An error occurred during upload: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-800 p-10">
      <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto overflow-y-auto">
        <h2 className="text-3xl text-center font-semibold mb-6">
          {initialData ? "Edit Record" : `${action} Form`}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select Type</option>
              <option value="uni">University</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Department</label>
            <select value={selectedDepartment} onChange={handleDepartmentChange}>
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Diary No</label>
            <input type="text" value={diaryNo} onChange={(e) => setDiaryNo(e.target.value)} />
          </div>
          <div className="form-group">
            <label>From</label>
            <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Disposal</label>
            <input type="text" value={disposal} onChange={(e) => setDisposal(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="flex gap-10 justify-center">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScanUpload;
