"use client";

import '@styles/globals.css';
import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { jsPDF } from "jspdf";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/webpack"; // Use this import for proper webpack handling
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ScanUpload = ({ action, onClose }) => {
  const [type, setType] = useState("");
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


  // asking for camera acces
  const requestCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Camera access granted");
    } catch (error) {
      console.error("Camera access denied", error);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`/api/department?type=${type}`, {
          method: "GET",
        });
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
      requestCameraAccess();
    };

    fetchDepartments();
  }, [type]);

  

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    const department = departments.find((dept) => dept._id === departmentId);
    setCategories(department?.categories || []);
    setSelectedCategory("");
  };

  const handleCapture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsScanning(false);
      await performOCR(imageSrc);
    } else {
      console.error("Webcam reference is null");
    }
  };

  const handleScanStart = () => {
    setIsScanning(true);
    setCapturedImage(null);
  };

  const handleFileChange = async (file) => {
    setIsProcessing(true);

    
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      setSubject("");
      setIsProcessing(false);
      return;
    }
    setFile(file);
    

    try {
      // Read the PDF as a file buffer
      const fileBuffer = await file.arrayBuffer();

      // Step 1: Attempt text extraction using pdfjs-dist
      const text = await extractTextFromPdf(fileBuffer);

      // Step 2: Try to find the subject in the extracted text
      let subject = findSubjectInText(text);
    

      // Step 3: Set the extracted subject
      if (subject) {
        setSubject(subject);
      } else {
        alert("No subject found in the uploaded file.");
        setSubject(""); // Clear subject if not found
      }
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to extract text or subject from the file.");
    } finally {
      setIsProcessing(false); // End processing
    }
  };
  const onDrop = useCallback((acceptedFiles) => {
    console.log('Files dropped:', acceptedFiles);
     const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      handleFileChange(file)
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] }, // Accept only PDFs
    onDragEnter: () => console.log("Drag entered"),
    onDragLeave: () => console.log("Drag left"), // Accept only PDFs
  });
  console.log('isDragActive:', isDragActive);
  async function extractTextFromPdf(fileBuffer) {
    const loadingTask = pdfjsLib.getDocument(fileBuffer);
    const pdf = await loadingTask.promise;

    let textContent = "";

    // Iterate through each page to extract text
    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
      const page = await pdf.getPage(pageIndex);

      // Extract text content from the page using pdfjs-dist
      const text = await page.getTextContent();

      // Combine the text items into a single string
      textContent += text.items.map((item) => item.str).join(" ");
    }

    return textContent;
  }

  // Utility: Perform OCR using Tesseract.js
  const performOCR = async (imageData) => {
    // Convert PDF pages to PNG images
    setIsProcessing(true);

    try {
      // Perform OCR on the scanned image
      const result = await Tesseract.recognize(imageData, "eng", {
        logger: (m) => console.log(m), // Log OCR progress
      });

      const extractedText = result.data.text;

      // Try to find the subject in the extracted text
      const subject = findSubjectInText(extractedText);
      if (subject) {
        setSubject(subject);
      } else {
        alert("No subject found in the scanned image.");
        setSubject("");
      }
    } catch (error) {
      console.error("Error performing OCR on scanned image:", error);
      alert("Failed to extract text from the scanned image.");
    } finally {
      setIsProcessing(false);
    }
  };
  // };

  // Utility: Search for a "subject" in the extracted text
  const findSubjectInText = (text) => {
    // Refined regex to look for 'Subject' or 'Subj' at the beginning of a line and capture the following text
    const subjectMatch = text.match(
      /(?:subject|subj)\s*[:\-]?\s*(.*?)(?:\s{2,}|$|\n|\r|\!|\?|\.|\:)/i
    );
    return subjectMatch ? subjectMatch[1].trim() : null;
  };

  const convertImageToPdf = async (imageData) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? "l" : "p",
          unit: "px",
          format: [img.width, img.height],
        });
        pdf.addImage(imageData, "JPEG", 0, 0, img.width, img.height);
        resolve(pdf.output("blob"));
      };
      img.src = imageData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      (!file && !capturedImage) ||
      !selectedDepartment ||
      !subject ||
      !diaryNo ||
      !from ||
      !disposal ||
      !status
    ) {
      alert(
        "Please fill out all fields and either upload a file or capture an image."
      );
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
      const response = await fetch("/api/scanupload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
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
    <div className = "bg-zinc-800 p-10">
    <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto overflow-y-auto xl:max-h-[710px] max-h-[860px]">
      <h2 className="text-3xl text-center font-semibold mb-6">{action} Form</h2>
      <form onSubmit={handleSubmit} className="suform">
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select Type</option>
            <option value="uni">University</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className='flex flex-col sm:flex-row sm:gap-4'>
        <div className="form-groupf">
          <label>Department</label>
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-groupf">
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
        </div>
        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className='flex flex-col sm:flex-row sm:gap-4'>
        <div className="form-groupf">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-groupf">
          <label>Diary No</label>
          <input
            type="text"
            value={diaryNo}
            onChange={(e) => setDiaryNo(e.target.value)}
            required
          />
        </div>
        </div>
        <div className="form-group">
          <label>From</label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Disposal</label>
          <input
            type="text"
            value={disposal}
            onChange={(e) => setDisposal(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>

          {/* Edit Button */}
          {/* <button
            type="button"
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
             // Define this function to handle edit action
          >
            Edit
          </button> */}
        </div>

        {action === "Scan" ? (
          <div className='form-group'>
            {!isScanning && !capturedImage && (
              <button type="button" onClick={handleScanStart}>
                Start Scanning
              </button>
            )}
            {isScanning && (
              <div>
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  ref={webcamRef}
                  playsInline
                  videoConstraints={{
                    facingMode: "environment", // This ensures the back camera is used
                  }}
                />
                <button type="button" onClick={handleCapture}>
                  Capture
                </button>
              </div>
            )}
            {capturedImage && (
              <div>
                <img
                  src={capturedImage}
                  alt="Captured"
                  style={{ maxWidth: "100%", marginTop: "10px" }}
                />
                <button type="button" onClick={handleScanStart}>
                  Scan Again
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="form-group">
            <label>File</label>
            <div
        {...getRootProps()}
        
        className={`flex flex-col items-center justify-center w-full h-40 p-6 border-2 border-dashed bg-gray-100 rounded-lg cursor-pointer transition-all ${
          isDragActive ? 'border-blue-500 bg-gray-200' : 'border-gray-400'
        }`}  >
        <input {...getInputProps()} />
        <UploadCloud size={40} className="text-gray-500 mb-3" />
        {isDragActive ? (
          <p className="text-lg font-semibold text-blue-600">Drop your file here...</p>
        ) : (
          <p className="text-lg text-gray-700">Drag & Drop your PDF here or <span className="text-blue-500 font-medium">click to browse</span></p>
        )}
      </div>
      {file && (
        <p className="mt-2 text-gray-700">Uploaded File: <strong>{file.name}</strong></p>
      )}

            {isProcessing && <p>Extracting text from file... Please wait.</p>}
          </div>
        )}
        <div className="flex gap-10 justify-center">
          <button
            type="submit"
            disabled={isLoading || (!file && !capturedImage)}
          >
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
