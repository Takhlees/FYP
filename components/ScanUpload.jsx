"use client";

import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam"; // Use the webcam library
import Tesseract from 'tesseract.js';

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
  const [isScanning, setIsScanning] = useState(false); // State for handling scanning
  const [capturedImage, setCapturedImage] = useState(null); // State for storing the captured image
  const [isLoading, setIsLoading] = useState(false); 
  const webcamRef = useRef(null); // Create a reference for the webcam component
  const [isProcessing, setIsProcessing] = useState(false)



  useEffect(() => {
    // Fetch departments and categories
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

    // Find categories for the selected department
    const department = departments.find((dept) => dept._id === departmentId);
    setCategories(department?.categories || []);
    setSelectedCategory(""); // Reset category selection
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(imageSrc); // Log to see the captured image string
      setCapturedImage(imageSrc);
      setIsScanning(false);
    } else {
      console.error("Webcam reference is null");
    }
  };
  
  const handleScanStart = () => {
    setIsScanning(true); // Start scanning
  };

  const handleScanStop = () => {
    setIsScanning(false); // Stop scanning
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setIsProcessing(true);
      try {
        // const result = await Tesseract.recognize(selectedFile, "eng", {
        //   logger: (m) => console.log(m),
        // });
        // const extractedText = result.data.text;
        const extractedText = await extractTextFromPdf(fileBuffer);
        // Search for a subject heading in the text
        const subjectMatch = extractedText.match(/(?:subject|subj)[:\-]?\s*(.+)/i);
        if (subjectMatch && subjectMatch[1]) {
          setSubject(subjectMatch[1].trim()); // Automatically fill subject
        } else {
          setSubject(""); // Clear subject if not found
          alert("No subject found in the uploaded file.");
        }
      } catch (error) {
        console.error("Error during OCR:", error);
        alert("Failed to extract text from the file.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    if (!file  || !selectedDepartment || !selectedCategory || !subject || !diaryNo || !from || !disposal || !status) {
      alert("Please fill out all fields.");
      setIsLoading(false); 
      return;
    }

    const formData = new FormData();
     // Use the scanned image or file selected
    //  if (file) {
    //   formData.append("file", file); // Append file directly if uploaded
    // } else if (capturedImage) {
    //   // Convert Base64 to Blob
    //   const base64Response = await fetch(capturedImage);
    //   const blob = await base64Response.blob();
    //   formData.append("file", blob, "capturedImage.jpeg");
      
    // }
    formData.append("file", file)
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert(`An error occurred during upload: ${error.message}`);
    } finally {
      setIsLoading(false); // Set loading state to false after submission (success or failure)
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

        {/* Conditionally show scanning or file input */}
        {action === "Scan" && !isScanning ? (
          <div>
            <button type="button" onClick={handleScanStart}>Start Scanning</button>
          </div>
        ) : isScanning ? (
          <div>
            <Webcam
              audio={false}
              screenshotFormat="image/jpeg"
              width="100%"
              ref={webcamRef} // Attach the reference to the webcam component
            />
            {capturedImage && (
              <div>
                <img src={capturedImage} alt="Captured" />
              </div>
            )}
            <button type="button" onClick={handleCapture}>Capture</button>
            <button type="button" onClick={handleScanStop}>Stop Scanning</button>
          </div>
        ) : (
          <div>
            <label>File:</label>
            <input type="file" onChange={handleFileChange} accept="application/pdf" required />
            {isProcessing && <p>Extracting text from file... Please wait.</p>} 
          </div>
        )}
        
         <button type="submit" disabled={isLoading}> {/* Updated submit button */}
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
