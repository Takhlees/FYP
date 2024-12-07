"use client"

import { useState } from "react"
import Tesseract from "tesseract.js"

const ScanUpload = ({ action, onClose }) => {
  // const [file, setFile] = useState(null)
  const [department, setDepartment] = useState("")
  const [category, setCategory] = useState("")
  const [subject, setSubject] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [diaryNo, setDiaryNo] = useState("")
  const [from, setFrom] = useState("")
  const [disposal, setDisposal] = useState("")
  const [status, setStatus] = useState("")
  //const [isProcessing, setIsProcessing] = useState(false)

  // const handleFileChange = async (e) => {
  //   const selectedFile = e.target.files?.[0]
  //   if (selectedFile) {
  //     setFile(selectedFile)

  //     // Validate file type
  //     const validTypes = ["application/pdf", "image/png", "image/jpeg"]
  //     if (!validTypes.includes(selectedFile.type)) {
  //       alert("Invalid file type. Please upload a PDF or an image.")
  //       setFile(null)
  //       return
  //     }

  //     // Perform OCR to extract subject if file is an image
  //     if (selectedFile.type !== "application/pdf") {
  //       setIsProcessing(true)
  //       try {
  //         const result = await Tesseract.recognize(selectedFile, "eng")
  //         const extractedText = result.data.text

  //         // Search for a subject heading in the text
  //         const subjectMatch = extractedText.match(/(?:subject|subj)[:\-]?\s*(.+)/i)
  //         if (subjectMatch && subjectMatch[1]) {
  //           setSubject(subjectMatch[1].trim()) // Automatically fill subject
  //         } else {
  //           setSubject("") // Clear subject if not found
  //           alert("No subject found in the uploaded file.")
  //         }
  //       } catch (error) {
  //         console.error("Error during OCR:", error)
  //         alert("Failed to extract text from the file.")
  //       } finally {
  //         setIsProcessing(false)
  //       }
  //     }
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if ( !department || !category || !subject || !diaryNo || !from || !disposal || !status) {
      alert("Please fill out all fields.")
      return
    }

    const formData = new FormData()
    //formData.append("file", file)
    formData.append("department", department)
    formData.append("category", category)
    formData.append("subject", subject)
    formData.append("date", date)
    formData.append("diaryNo", diaryNo)
    formData.append("from", from)
    formData.append("disposal", disposal)
    formData.append("status", status)

    try {
      const response = await fetch("/api/scanupload", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        alert(`HTTP error! status: ${response.status}`);
      }
      let data
      try {
        data = await response.json()
      } catch (error) {
        console.error("Failed to parse JSON response:", error)
        alert("Server returned an invalid response. Please try again.")
        return
      }
      
      
      if (response.ok) {
        alert(data.message)
        onClose()
      } else {
        console.error("Error response from server:", data)
        alert(`Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert(`An error occurred during upload: ${error.message}`)
    }
  }

  return (
    <div>
      <h2>{action} Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Department:</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Diary No:</label>
          <input
            type="text"
            value={diaryNo}
            onChange={(e) => setDiaryNo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>From:</label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Disposal:</label>
          <input
            type="text"
            value={disposal}
            onChange={(e) => setDisposal(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        {/* <div>
          <label>File:</label>
          <input type="file" onChange={handleFileChange} required />
          {isProcessing && <p>Extracting text from file... Please wait.</p>}
        </div> */}
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ScanUpload;
