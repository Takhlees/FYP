
"use client"

import "@styles/globals.css"
import { useState, useEffect, useRef, useCallback } from "react"
import Webcam from "react-webcam"
import { jsPDF } from "jspdf"
import { useDropzone } from "react-dropzone"
import { UploadCloud, ZoomIn, ZoomOut, RefreshCw, Camera, Focus } from "lucide-react"
import Tesseract from "tesseract.js"
import * as pdfjsLib from "pdfjs-dist/webpack" // Use this import for proper webpack handling

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

// Simplified image processing without complex OpenCV operations
const preprocessImage = async (imageData) => {
  return new Promise((resolve, reject) => {
    try {
      // Check if imageData is a string (data URL)
      if (typeof imageData === "string") {
        const img = new Image()
        img.crossOrigin = "anonymous" // Add this to avoid CORS issues

        img.onload = () => {
          try {
            // Create canvas for image processing
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")

            if (!ctx) {
              reject(new Error("Failed to get canvas context"))
              return
            }

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, img.width, img.height)

            // Apply basic image processing using canvas operations
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const processedData = simpleImageProcessing(imgData)

            // Put processed image data back on canvas
            ctx.putImageData(processedData, 0, 0)

            // Return processed image as data URL
            resolve(canvas.toDataURL("image/jpeg", 0.95))
          } catch (error) {
            console.error("Error processing image in canvas:", error)
            resolve(imageData) // Return original if processing fails
          }
        }

        img.onerror = (error) => {
          console.error("Error loading image:", error)
          resolve(imageData) // Return original if loading fails
        }

        img.src = imageData
      } else {
        // If imageData is already an ImageData object
        try {
          // Apply image processing directly
          const processedData = simpleImageProcessing(imageData)

          // Create a canvas to convert back to data URL
          const canvas = document.createElement("canvas")
          canvas.width = imageData.width
          canvas.height = imageData.height
          const ctx = canvas.getContext("2d")

          if (!ctx) {
            reject(new Error("Failed to get canvas context"))
            return
          }

          // Put processed image data on canvas
          ctx.putImageData(processedData, 0, 0)

          // Return as data URL
          resolve(canvas.toDataURL("image/jpeg", 0.95))
        } catch (error) {
          console.error("Error processing ImageData:", error)
          resolve(imageData) // Return original if processing fails
        }
      }
    } catch (error) {
      console.error("Unexpected error in preprocessImage:", error)
      resolve(imageData) // Return original if any error occurs
    }
  })
}

// Simple image processing function that doesn't rely on OpenCV
const simpleImageProcessing = (imageData) => {
  // Create a copy of the image data to avoid modifying the original
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  // Apply contrast enhancement
  const factor = 1.5 // Contrast factor (1.0 means no change)
  const intercept = 128 * (1 - factor)

  for (let i = 0; i < data.length; i += 4) {
    // Apply to RGB channels
    for (let j = 0; j < 3; j++) {
      data[i + j] = factor * data[i + j] + intercept
    }
    // Alpha channel remains unchanged
  }

  // Create a new ImageData object with the processed data
  return new ImageData(data, width, height)
}

// Document detection and cropping using canvas operations
const detectAndCropDocument = async (imageData) => {
  return new Promise((resolve) => {
    if (!window.cv) {
      console.warn("OpenCV not available, skipping document detection")
      resolve(imageData)
      return
    }

    try {
      const img = new Image()
      img.onload = () => {
        try {
          // Create canvas for image processing
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, img.width, img.height)

          // Get image data for processing
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

          // Try to detect and crop document using OpenCV
          try {
            const croppedImageData = findAndCropDocumentSimple(imgData)

            if (croppedImageData) {
              // Put cropped image data back on canvas
              canvas.width = croppedImageData.width
              canvas.height = croppedImageData.height
              ctx.putImageData(croppedImageData, 0, 0)

              // Return cropped image as data URL
              resolve(canvas.toDataURL("image/jpeg", 0.95))
            } else {
              // If document detection failed, return original image
              resolve(img.src)
            }
          } catch (error) {
            console.error("Error in document detection:", error)
            resolve(img.src) // Return original on error
          }
        } catch (error) {
          console.error("Error processing image:", error)
          resolve(img.src) // Return original on error
        }
      }
      img.src = imageData
    } catch (error) {
      console.error("Error in detectAndCropDocument:", error)
      resolve(imageData) // Return original on error
    }
  })
}

// Simplified document detection and cropping
const findAndCropDocumentSimple = (imageData) => {
  if (!window.cv) {
    console.error("OpenCV is not loaded yet")
    return null
  }

  try {
    const cv = window.cv

    // Convert ImageData to OpenCV Mat
    const src = cv.matFromImageData(imageData)

    // Create destination for grayscale image
    const gray = new cv.Mat()

    // Convert to grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)

    // Apply Gaussian blur
    const blurred = new cv.Mat()
    const ksize = new cv.Size(5, 5)
    cv.GaussianBlur(gray, blurred, ksize, 0)

    // Apply Canny edge detection
    const edges = new cv.Mat()
    cv.Canny(blurred, edges, 75, 200)

    // Find contours
    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

    // Find the largest contour (assuming it's the document)
    let maxArea = 0
    let maxContourIndex = -1

    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i)
      const area = cv.contourArea(contour)

      if (area > maxArea) {
        maxArea = area
        maxContourIndex = i
      }
    }

    // If no significant contour found, return null
    if (maxContourIndex === -1 || maxArea < src.rows * src.cols * 0.1) {
      // Clean up OpenCV objects
      src.delete()
      gray.delete()
      blurred.delete()
      edges.delete()
      contours.delete()
      hierarchy.delete()
      return null
    }

    // Approximate the contour to get a polygon
    const maxContour = contours.get(maxContourIndex)
    const epsilon = 0.02 * cv.arcLength(maxContour, true)
    const approx = new cv.Mat()
    cv.approxPolyDP(maxContour, approx, epsilon, true)

    // If the polygon has 4 points, we assume it's a document
    if (approx.rows === 4) {
      // Extract points
      const points = []
      for (let i = 0; i < 4; i++) {
        points.push({
          x: approx.data32S[i * 2],
          y: approx.data32S[i * 2 + 1],
        })
      }

      // Sort points (top-left, top-right, bottom-right, bottom-left)
      points.sort((a, b) => a.y - b.y)
      const topPoints = points.slice(0, 2).sort((a, b) => a.x - b.x)
      const bottomPoints = points.slice(2, 4).sort((a, b) => a.x - b.x)
      points[0] = topPoints[0]
      points[1] = topPoints[1]
      points[2] = bottomPoints[1]
      points[3] = bottomPoints[0]

      // Create destination points for perspective transform
      const width = Math.max(
        Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y),
        Math.hypot(points[3].x - points[2].x, points[3].y - points[2].y),
      )
      const height = Math.max(
        Math.hypot(points[3].x - points[0].x, points[3].y - points[0].y),
        Math.hypot(points[2].x - points[1].x, points[2].y - points[1].y),
      )

      // Create source and destination points for perspective transform
      const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        points[0].x,
        points[0].y,
        points[1].x,
        points[1].y,
        points[2].x,
        points[2].y,
        points[3].x,
        points[3].y,
      ])
      const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width - 1, 0, width - 1, height - 1, 0, height - 1])

      // Apply perspective transform
      const M = cv.getPerspectiveTransform(srcTri, dstTri)
      const warpedImage = new cv.Mat()
      cv.warpPerspective(src, warpedImage, M, new cv.Size(width, height))

      // Convert back to RGBA for display
      const result = new cv.Mat()
      cv.cvtColor(warpedImage, result, cv.COLOR_BGR2RGBA)

      // Convert OpenCV Mat back to ImageData
      const croppedImageData = new ImageData(new Uint8ClampedArray(result.data), result.cols, result.rows)

      // Clean up OpenCV objects
      src.delete()
      gray.delete()
      blurred.delete()
      edges.delete()
      contours.delete()
      hierarchy.delete()
      approx.delete()
      srcTri.delete()
      dstTri.delete()
      M.delete()
      warpedImage.delete()
      result.delete()

      return croppedImageData
    }

    // Clean up OpenCV objects
    src.delete()
    gray.delete()
    blurred.delete()
    edges.delete()
    contours.delete()
    hierarchy.delete()
    approx.delete()

    return null
  } catch (error) {
    console.error("Error in findAndCropDocumentSimple:", error)
    return null
  }
}

const ScanUpload = ({ fileData, action, onClose }) => {
  const [type, setType] = useState(fileData?.type || "")
  const [file, setFile] = useState(fileData?.file || null)
  const [fileName, setFileName] = useState(fileData?.file?.name || "")
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState(fileData?.department || "")
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(fileData?.category || "")
  const [subject, setSubject] = useState(fileData?.subject || "")
  const [date, setDate] = useState(fileData?.date || new Date().toISOString().split("T")[0])
  const [diaryNo, setDiaryNo] = useState(fileData?.diaryNo || "")
  const [from, setFrom] = useState(fileData?.from || "")
  const [disposal, setDisposal] = useState(fileData?.disposal || "")
  const [status, setStatus] = useState(fileData?.status || "")
  const [isScanning, setIsScanning] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const webcamRef = useRef(null)
  const [isFullScreenScanning, setIsFullScreenScanning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isOpenCVLoaded, setIsOpenCVLoaded] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [cameraFacingMode, setCameraFacingMode] = useState("environment")
  const [isFocusing, setIsFocusing] = useState(false)
  const videoRef = useRef(null)

  // asking for camera acces
  const requestCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      console.log("Camera access granted")
    } catch (error) {
      console.error("Camera access denied", error)
    }
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`/api/department?type=${type}`, {
          method: "GET",
        })
        const data = await response.json()
        setDepartments(data)
      } catch (error) {
        console.error("Failed to fetch departments", error)
      }
      requestCameraAccess()
    }

    fetchDepartments()
  }, [type])

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
    console.log("handleCapture function called")
    if (webcamRef.current) {
      setIsProcessing(true)
      try {
        console.log("Attempting to capture image")
        // Capture image from webcam
        const imageSrc = webcamRef.current.getScreenshot()
        console.log("Image captured:", imageSrc ? "Success" : "Failed")

        if (!imageSrc) {
          throw new Error("Failed to capture image from camera")
        }

        // Step 1: Detect and crop document
        console.log("Starting document detection")
        let processedImage = imageSrc

        // Try to detect and crop document
        try {
          const croppedImage = await detectAndCropDocument(imageSrc)
          if (croppedImage) {
            processedImage = croppedImage
            console.log("Document detection and cropping successful")
          } else {
            console.log("Document detection failed, using original image")
          }
        } catch (cropError) {
          console.error("Error in document detection:", cropError)
        }

        // Step 2: Preprocess image to improve quality
        console.log("Starting image preprocessing")
        try {
          const enhancedImage = await preprocessImage(processedImage)
          if (enhancedImage) {
            processedImage = enhancedImage
            console.log("Image preprocessing successful")
          } else {
            console.log("Image preprocessing failed, using previous image")
          }
        } catch (preprocessError) {
          console.error("Error in image preprocessing:", preprocessError)
        }

        // Set the processed image
        console.log("Setting captured image")
        setCapturedImage(processedImage)
        setIsScanning(false)
        setIsFullScreenScanning(false)
        console.log("Camera view closed")

        // Step 3: Perform enhanced OCR on the processed image
        console.log("Starting OCR")
        try {
          await performOCR(processedImage)
          console.log("OCR completed")
        } catch (ocrError) {
          console.error("Error in OCR:", ocrError)
        }
      } catch (error) {
        console.error("Error processing captured image:", error)
        alert(error.message || "Failed to process the captured image.")
      } finally {
        setIsProcessing(false)
        console.log("Processing completed")
      }
    } else {
      console.error("Webcam reference is null")
    }
  }

  const handleScanStart = () => {
    setIsScanning(true)
    setIsFullScreenScanning(true)
    setCapturedImage(null)
  }

  const handleFocus = useCallback(
    async (event) => {
      if (videoRef.current && "mediaDevices" in navigator) {
        setIsFocusing(true)
        const { offsetX, offsetY } = event.nativeEvent
        const { videoWidth, videoHeight } = videoRef.current

        const focusX = offsetX / videoRef.current.offsetWidth
        const focusY = offsetY / videoRef.current.offsetHeight

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacingMode } })
          const track = stream.getVideoTracks()[0]

          if ("focusMode" in track.getCapabilities()) {
            await track.applyConstraints({
              advanced: [{ focusMode: "manual" }],
            })

            if ("focusDistance" in track.getCapabilities()) {
              await track.applyConstraints({
                advanced: [
                  {
                    focusMode: "manual",
                    focusDistance: Math.sqrt(Math.pow(focusX - 0.5, 2) + Math.pow(focusY - 0.5, 2)),
                  },
                ],
              })
            }
          }
        } catch (error) {
          console.error("Error setting focus:", error)
        } finally {
          setIsFocusing(false)
        }
      }
    },
    [cameraFacingMode],
  )

  const handleFileChange = useCallback(async (file) => {
    setIsProcessing(true)

    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.")
      setSubject("")
      setIsProcessing(false)
      return
    }
    setFile(file)
    setFileName(file.name)

    try {
      // Read the PDF as a file buffer
      const fileBuffer = await file.arrayBuffer()

      // Step 1: Attempt text extraction using pdfjs-dist
      const text = await extractTextFromPdf(fileBuffer)

      // Step 2: Try to find the subject in the extracted text
      const subject = findSubjectInText(text)

      // Step 3: Set the extracted subject
      if (subject) {
        setSubject(subject)
      } else {
        alert("No subject found in the uploaded file.")
        setSubject("") // Clear subject if not found
      }
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Failed to extract text or subject from the file.")
    } finally {
      setIsProcessing(false) // End processing
    }
  }, [])
  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log("Files dropped:", acceptedFiles)
      const file = acceptedFiles[0]
      if (file) {
        setFile(file)
        handleFileChange(file)
        setFileName(file.name)
      }
    },
    [handleFileChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] }, // Accept only PDFs
    onDragEnter: () => console.log("Drag entered"),
    onDragLeave: () => console.log("Drag left"), // Accept only PDFs
  })
  console.log("isDragActive:", isDragActive)
  async function extractTextFromPdf(fileBuffer) {
    const loadingTask = pdfjsLib.getDocument(fileBuffer)
    const pdf = await loadingTask.promise

    let textContent = ""

    // Iterate through each page to extract text
    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
      const page = await pdf.getPage(pageIndex)

      // Extract text content from the page using pdfjs-dist
      const text = await page.getTextContent()

      // Combine the text items into a single string
      textContent += text.items.map((item) => item.str).join(" ")
    }

    return textContent
  }

  const performOCR = async (imageData) => {
    // Convert PDF pages to PNG images
    setIsProcessing(true)

    try {
      // Perform OCR on the scanned image
      const result = await Tesseract.recognize(imageData, "eng", {
        tessedit_char_whitelist:
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:!?()[]{}+-*/=<>@#$%^&|~`\"' ",
        tessedit_ocr_engine_mode: "2", // LSTM_ONLY mode for better text recognition
        tessedit_pageseg_mode: "6", // Automatic page segmentation with OSD
        preserve_interword_spaces: "1", // Preserve spaces between words
        textord_heavy_nr: "1", // More aggressive noise removal
        textord_min_linesize: "2.5",
      })

      const extractedText = result.data.text

      // Try to find the subject in the extracted text
      const subject = findSubjectInText(extractedText)
      if (subject) {
        setSubject(subject)
      } else {
        alert("No subject found in the scanned image.")
        setSubject("")
      }
    } catch (error) {
      console.error("Error performing OCR on scanned image:", error)
      alert("Failed to extract text from the scanned image.")
    } finally {
      setIsProcessing(false)
    }
  }
  // };

  // Utility: Search for a "subject" in the extracted text
  const findSubjectInText = (text) => {
    // Refined regex to look for 'Subject' or 'Subj' at the beginning of a line and capture the following text
    const subjectMatch = text.match(/(?:subject|subj)\s*[:-]?\s*(.*?)(?:\s{2,}|$|\n|\r|!|\?|\.|:)/i)
    return subjectMatch ? subjectMatch[1].trim() : null
  }

  const convertImageToPdf = async (imageData) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? "l" : "p",
          unit: "px",
          format: [img.width, img.height],
        })
        pdf.addImage(imageData, "JPEG", 0, 0, img.width, img.height)
        resolve(pdf.output("blob"))
      }
      img.src = imageData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if ((!file && !capturedImage) || !selectedDepartment || !subject || !diaryNo || !from || !disposal || !status) {
      alert("Please fill out all fields and either upload a file or capture an image.")
      setIsLoading(false)
      return
    }

    const formData = new FormData()

    if (file) {
      formData.append("file", file)
      formData.append("fileName", file.name)
    } else if (capturedImage) {
      const pdfBlob = await convertImageToPdf(capturedImage)
      formData.append("file", pdfBlob, "captured_image.pdf")
    }
    formData.append("type", type)
    formData.append("department", selectedDepartment)
    formData.append("category", selectedCategory)
    formData.append("subject", subject)
    formData.append("date", date)
    formData.append("diaryNo", diaryNo)
    formData.append("from", from)
    formData.append("disposal", disposal)
    formData.append("status", status)

    const method = fileData ? "PUT" : "POST" // Update if editing, create if new
    const url = fileData ? `/api/scanupload/${fileData._id}` : "/api/scanupload"

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      alert(data.message)
      onClose()
    } catch (error) {
      console.error("Upload error:", error)
      alert(`An error occurred during upload: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  console.log("setType in ScanUploadPage:", setType)

  useEffect(() => {
    // Track if OpenCV is loaded

    // Function to initialize OpenCV
    const loadOpenCV = () => {
      // Check if OpenCV is already loaded
      if (window.cv) {
        console.log("OpenCV.js already loaded")
        setIsOpenCVLoaded(true)
        return
      }

      // Create a global callback for when OpenCV is ready
      window.onOpenCVReady = () => {
        console.log("OpenCV.js initialized")
        setIsOpenCVLoaded(true)
      }

      // Load OpenCV.js from CDN
      const script = document.createElement("script")
      script.src = "https://docs.opencv.org/4.5.5/opencv.js"
      script.async = true
      script.onload = () => console.log("OpenCV.js script loaded")
      script.onerror = (err) => console.error("Error loading OpenCV.js", err)
      document.body.appendChild(script)

      return () => {
        // Clean up
        if (script && script.parentNode) {
          document.body.removeChild(script)
        }
        delete window.onOpenCVReady
      }
    }

    loadOpenCV()
  }, [])

  const increaseZoom = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const decreaseZoom = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1))
  }

  const handleCloseCamera = () => {
    setIsScanning(false)
    setIsFullScreenScanning(false)
    setCapturedImage(null)
  }

  return (
    <div className={`${isFullScreenScanning ? "fixed inset-0 z-50" : "bg-zinc-800 p-10 "}`}>
      <div
        className={`${
          isFullScreenScanning
            ? "h-full max-h-full"
            : "bg-white p-6 rounded-lg max-w-4xl mx-auto overflow-y-auto xl:max-h-[710px] max-h-[860px]"
        }`}
      >
        {!isFullScreenScanning ? <h2 className="text-3xl text-center font-semibold mb-6">{action} Form</h2> : null}
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
                  <select value={selectedDepartment} onChange={handleDepartmentChange} required>
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
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
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
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <div className="form-groupf">
                  <label>Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-groupf">
                  <label>Diary No</label>
                  <input type="text" value={diaryNo} onChange={(e) => setDiaryNo(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>From</label>
                <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Disposal</label>
                <input type="text" value={disposal} onChange={(e) => setDisposal(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                  <option value="">Select Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </>
          ) : null}

          {action === "Scan" ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Document Scanning</h3>
              {!isScanning && !capturedImage && (
                <button className="subutton" type="button" onClick={handleScanStart}>
                  Start Scanning
                </button>
              )}
              {isScanning && (
                <div className="bg-zinc-800 absolute inset-0 flex flex-col items-center justify-center bg-black">
                  <div className="relative w-full h-full" onClick={handleFocus}>
                    <Webcam
                      className="w-full h-full object-cover"
                      audio={false}
                      screenshotFormat="image/jpeg"
                      ref={(ref) => {
                        webcamRef.current = ref
                        videoRef.current = ref && ref.video
                      }}
                      width="100%"
                      playsInline
                      videoConstraints={{
                        facingMode: cameraFacingMode,
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        advanced: [{ zoom: zoomLevel }],
                      }}
                    />
                    {isFocusing && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Focus className="w-12 h-12 text-white animate-pulse" />
                      </div>
                    )}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white flex flex-col items-center">
                          <RefreshCw className="w-12 h-12 animate-spin mb-2" />
                          <p>Processing image...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
                    <button className="p-2 bg-white rounded-full" onClick={decreaseZoom} type="button">
                      <ZoomOut className="w-6 h-6" />
                    </button>
                    <button
                      className="w-16 h-16 bg-white border-4 border-green-500 rounded-full shadow-lg hover:bg-gray-300 transition duration-200"
                      onClick={handleCapture}
                      type="button"
                    >
                      <Camera className="w-8 h-8 mx-auto" />
                    </button>
                    <button className="p-2 bg-white rounded-full" onClick={increaseZoom} type="button">
                      <ZoomIn className="w-6 h-6" />
                    </button>
                  </div>

                  <button
                    className="absolute top-4 left-4 p-2 bg-white rounded-full"
                    onClick={handleCloseCamera}
                    type="button"
                  >
                    <p className="w-6 h-6">X</p>
                  </button>
                </div>
              )}
              {capturedImage && (
                <div className="space-y-4">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Captured"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <button className="subutton" type="button" onClick={handleScanStart}>
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
                  isDragActive ? "border-blue-500 bg-gray-200" : "border-gray-400"
                }`}
              >
                <input {...getInputProps({ accept: ".pdf,image/*" })} />
                <UploadCloud size={40} className="text-gray-500 mb-3" />
                {isDragActive ? (
                  <p className="text-lg font-semibold text-blue-600">Drop your file here...</p>
                ) : (
                  <p className="text-lg text-gray-700">
                    Drag & Drop your PDF or Image here or{" "}
                    <span className="text-blue-500 font-medium">click to browse</span>
                  </p>
                )}
              </div>
              {file && (
                <p className="mt-2 text-gray-700">
                  Uploaded File: <strong>{fileName}</strong>
                </p>
              )}
              {isProcessing && <p>Extracting text from file... Please wait.</p>}
            </div>
          )}
          {!isFullScreenScanning ? (
            <div className="flex gap-10 justify-center">
              <button className="subutton" type="submit" disabled={isLoading || (!file && !capturedImage)}>
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
  )
}

export default ScanUpload

