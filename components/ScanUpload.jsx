"use client";

import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { jsPDF } from "jspdf";

const ScanUpload = ({ action, onClose }) => {
  const [file, setFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [diaryNo, setDiaryNo] = useState("");
  const [from, setFrom] = useState("");
  const [disposal, setDisposal] = useState("");
  const [status, setStatus] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/department");
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    const department = departments.find((dept) => dept._id === departmentId);
    setCategories(department?.categories || []);
    setSelectedCategory("");
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsScanning(false);
    } else {
      console.error("Webcam reference is null");
    }
  };

  const handleScanStart = () => {
    setIsScanning(true);
    setCapturedImage(null);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || selectedFile.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setFile(selectedFile);
    setIsProcessing(true);
  };

  const convertImageToPdf = async (imageData) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? "l" : "p",
          unit: "px",
          format: [img.width, img.height]
        });
        pdf.addImage(imageData, "JPEG", 0, 0, img.width, img.height);
        resolve(pdf.output('blob'));
      };
      img.src = imageData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if ((!file && !capturedImage) || !selectedDepartment || !selectedCategory || !subject || !diaryNo || !from || !disposal || !status) {
      alert("Please fill out all fields and either upload a file or capture an image.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    } else if (capturedImage) {
      const pdfBlob = await convertImageToPdf(capturedImage);
      formData.append("file", pdfBlob, "captured_image.pdf");
    }

    formData.append("department", selectedDepartment);
    formData.append("category", selectedCategory);
    formData.append("subject", subject);
    formData.append("date", date);
    formData.append("diaryNo", diaryNo);
    formData.append("from", from);
    formData.append("disposal", disposal);
    formData.append("status", status);

    try {
      const response = await fetch("/api/scanupload", {
        method: "POST",
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
    <div>
      <h2>{action} Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Department:</label>
          <select value={selectedDepartment} onChange={handleDepartmentChange} required>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            disabled={!categories.length}
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Subject:</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Diary No:</label>
          <input type="text" value={diaryNo} onChange={(e) => setDiaryNo(e.target.value)} required />
        </div>
        <div>
          <label>From:</label>
          <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} required />
        </div>
        <div>
          <label>Disposal:</label>
          <input type="text" value={disposal} onChange={(e) => setDisposal(e.target.value)} required />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="">Select Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {action === "Scan" ? (
          <div>
            {!isScanning && !capturedImage && (
              <button type="button" onClick={handleScanStart}>Start Scanning</button>
            )}
            {isScanning && (
              <div>
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  ref={webcamRef}
                />
                <button type="button" onClick={handleCapture}>Capture</button>
              </div>
            )}
            {capturedImage && (
              <div>
                <img src={capturedImage} alt="Captured" style={{ maxWidth: '100%', marginTop: '10px' }} />
                <button type="button" onClick={handleScanStart}>Scan Again</button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label>File:</label>
            <input type="file" onChange={handleFileChange} accept="application/pdf" required />
            {isProcessing && <p>Extracting text from file... Please wait.</p>}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isLoading || (!file && !capturedImage)}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ScanUpload;

