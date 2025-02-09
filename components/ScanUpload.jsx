"use client";

import "@styles/globals.css";
import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { jsPDF } from "jspdf";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/webpack"; // Use this import for proper webpack handling

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ScanUpload = ({ fileData, action, onClose }) => {
  const [type, setType] = useState(fileData?.type || "");
  const [file, setFile] = useState(fileData?.file || null);
  const [fileName, setFileName] = useState(fileData?.file?.name || "");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    fileData?.department || ""
  );
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    fileData?.category || ""
  );
  const [subject, setSubject] = useState(fileData?.subject || "");
  const [date, setDate] = useState(
    fileData?.date || new Date().toISOString().split("T")[0]
  );
  const [diaryNo, setDiaryNo] = useState(fileData?.diaryNo || "");
  const [from, setFrom] = useState(fileData?.from || "");
  const [disposal, setDisposal] = useState(fileData?.disposal || "");
  const [status, setStatus] = useState(fileData?.status || "");
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(
    fileData?.capturedImage || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);
  const [isFullScreenScanning, setIsFullScreenScanning] = useState(false);
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
    if (fileData) {
      setType(fileData.type || "");
      setFile(fileData.file || null);
      setFileName(fileData.file.name || "");
      setSelectedDepartment(fileData.department || "");
      setSelectedCategory(fileData.category || "");
      setSubject(fileData.subject || "");
      setDate(
        fileData.date
          ? fileData.date.split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setDiaryNo(fileData.diaryNo || "");
      setFrom(fileData.from || "");
      setDisposal(fileData.disposal || "");
      setStatus(fileData.status || "");
      setCapturedImage(fileData.capturedImage || null);
    }
  }, [fileData]); // Re-run only when fileData changes

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

  useEffect(() => {
    if (selectedDepartment) {
      const department = departments.find((dept) => dept._id === selectedDepartment)
      setCategories(department?.categories || [])
    }
  }, [selectedDepartment, departments])

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value
    setSelectedDepartment(departmentId)
    setSelectedCategory("") // Reset category when department changes
  }
  
  const handleCapture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsScanning(false);
      setIsFullScreenScanning(false);
      await performOCR(imageSrc);
    } else {
      console.error("Webcam reference is null");
    }
  };

  const handleScanStart = () => {
    setIsScanning(true);
    setIsFullScreenScanning(true);
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
    setFileName(file.name);

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
    console.log("Files dropped:", acceptedFiles);
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      handleFileChange(file);
      setFileName(file.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] }, // Accept only PDFs
    onDragEnter: () => console.log("Drag entered"),
    onDragLeave: () => console.log("Drag left"), // Accept only PDFs
  });
  console.log("isDragActive:", isDragActive);
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
      formData.append("fileName", file.name);
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

    const method = fileData ? "PUT" : "POST"; // Update if editing, create if new
    const url = fileData
      ? `/api/scanupload/${fileData._id}`
      : "/api/scanupload";

    try {
      const response = await fetch(url, {
        method,
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
  
  console.log("setType in ScanUploadPage:", setType);


  
  return (
    <div
      className={`${
        isFullScreenScanning ? "fixed inset-0 z-50" : "bg-zinc-800 p-10 "
      }`}>
      <div
        className={`${
          isFullScreenScanning
            ? "h-full max-h-full"
            : "bg-white p-6 rounded-lg max-w-4xl mx-auto overflow-y-auto xl:max-h-[710px] max-h-[860px]"
        }`}>
        {!isFullScreenScanning ? (
          <h2 className="text-3xl text-center font-semibold mb-6">
            {action} Form
          </h2>
        ) : null}
        <form onSubmit={handleSubmit} className="suform">
          {!isFullScreenScanning ? (
            <>
              <div className="form-group">
                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="uni">University</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <div className="form-groupf">
                  <label>Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    required>
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
                    onChange={(e) => setSelectedCategory(e.target.value)}>
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
              <div className="flex flex-col sm:flex-row sm:gap-4">
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
                  required>
                  <option value="">Select Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </>
          ) : null}

          {action === "Scan" ? (
            <div>
              {!isScanning && !capturedImage && (
                <button
                  className="subutton"
                  type="button"
                  onClick={handleScanStart}>
                  Start Scanning
                </button>
              )}
              {isScanning && (
                <div className='bg-zinc-800 absolute inset-0 flex flex-col items-center justify-center bg-black"'>
                  <Webcam
                    className="w-full h-full object-cover"
                    audio={false}
                    screenshotFormat="image/jpeg"
                    ref={webcamRef}
                    width="100%"
                    playsInline
                    videoConstraints={{
                      facingMode: "environment", // This ensures the back camera is used
                    }}
                  />
                  <div className="relative mb-2 mt-4 flex justify-center items-center rounded-full w-20 h-20">
                    <button
                      className="w-16 h-16 bg-white border-4 border-green-500 rounded-full shadow-lg hover:bg-gray-300 transition duration-200"
                      onClick={handleCapture}></button>
                  </div>
                </div>
              )}
              {capturedImage && (
                <div className="space-y-4">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <button
                    className="subutton"
                    type="button"
                    onClick={handleScanStart}>
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
                  isDragActive
                    ? "border-blue-500 bg-gray-200"
                    : "border-gray-400"
                }`}>
                <input {...getInputProps()} />
                <UploadCloud size={40} className="text-gray-500 mb-3" />
                {isDragActive ? (
                  <p className="text-lg font-semibold text-blue-600">
                    Drop your file here...
                  </p>
                ) : (
                  <p className="text-lg text-gray-700">
                    Drag & Drop your PDF here or{" "}
                    <span className="text-blue-500 font-medium">
                      click to browse
                    </span>
                  </p>
                )}
              </div>
              {file && (
                <p className="mt-2 text-gray-700">
                  Uploaded File: <strong >{fileName}</strong>
                </p>
              )}

              {isProcessing && <p>Extracting text from file... Please wait.</p>}
            </div>
          )}
          {!isFullScreenScanning ? (
            <div className="flex gap-10 justify-center">
              <button
                className="subutton"
                type="submit"
                disabled={isLoading || (!file && !capturedImage)}>
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button className="subutton" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default ScanUpload;
