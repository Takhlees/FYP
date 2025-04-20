// "use client"

// import "@styles/globals.css"
// import { useState, useEffect, useRef, useCallback } from "react"
// import Webcam from "react-webcam"
// import { jsPDF } from "jspdf"
// import { useDropzone } from "react-dropzone"
// import { UploadCloud, ZoomIn, ZoomOut, RefreshCw, Camera, Focus } from "lucide-react"
// import Tesseract from "tesseract.js"
// import * as pdfjsLib from "pdfjs-dist/webpack" // Use this import for proper webpack handling

// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

// // Simplified image processing without complex OpenCV operations
// const preprocessImage = async (imageData) => {
//   return new Promise((resolve, reject) => {
//     try {
//       // Check if imageData is a string (data URL)
//       if (typeof imageData === "string") {
//         const img = new Image()
//         img.crossOrigin = "anonymous" // Add this to avoid CORS issues

//         img.onload = () => {
//           try {
//             // Create canvas for image processing
//             const canvas = document.createElement("canvas")
//             canvas.width = img.width
//             canvas.height = img.height
//             const ctx = canvas.getContext("2d")

//             if (!ctx) {
//               reject(new Error("Failed to get canvas context"))
//               return
//             }

//             // Draw image on canvas
//             ctx.drawImage(img, 0, 0, img.width, img.height)

//             // Apply basic image processing using canvas operations
//             const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
//             const processedData = simpleImageProcessing(imgData)

//             // Put processed image data back on canvas
//             ctx.putImageData(processedData, 0, 0)

//             // Return processed image as data URL
//             resolve(canvas.toDataURL("image/jpeg", 0.95))
//           } catch (error) {
//             console.error("Error processing image in canvas:", error)
//             resolve(imageData) // Return original if processing fails
//           }
//         }

//         img.onerror = (error) => {
//           console.error("Error loading image:", error)
//           resolve(imageData) // Return original if loading fails
//         }

//         img.src = imageData
//       } else {
//         // If imageData is already an ImageData object
//         try {
//           // Apply image processing directly
//           const processedData = simpleImageProcessing(imageData)

//           // Create a canvas to convert back to data URL
//           const canvas = document.createElement("canvas")
//           canvas.width = imageData.width
//           canvas.height = imageData.height
//           const ctx = canvas.getContext("2d")

//           if (!ctx) {
//             reject(new Error("Failed to get canvas context"))
//             return
//           }

//           // Put processed image data on canvas
//           ctx.putImageData(processedData, 0, 0)

//           // Return as data URL
//           resolve(canvas.toDataURL("image/jpeg", 0.95))
//         } catch (error) {
//           console.error("Error processing ImageData:", error)
//           resolve(imageData) // Return original if processing fails
//         }
//       }
//     } catch (error) {
//       console.error("Unexpected error in preprocessImage:", error)
//       resolve(imageData) // Return original if any error occurs
//     }
//   })
// }

// // Simple image processing function that doesn't rely on OpenCV
// const simpleImageProcessing = (imageData) => {
//   // Create a copy of the image data to avoid modifying the original
//   const data = new Uint8ClampedArray(imageData.data)
//   const width = imageData.width
//   const height = imageData.height

//   // Apply contrast enhancement
//   const factor = 1.5 // Contrast factor (1.0 means no change)
//   const intercept = 128 * (1 - factor)

//   for (let i = 0; i < data.length; i += 4) {
//     // Apply to RGB channels
//     for (let j = 0; j < 3; j++) {
//       data[i + j] = factor * data[i + j] + intercept
//     }
//     // Alpha channel remains unchanged
//   }

//   // Create a new ImageData object with the processed data
//   return new ImageData(data, width, height)
// }

// // Document detection and cropping using canvas operations
// const detectAndCropDocument = async (imageData) => {
//   return new Promise((resolve) => {
//     if (!window.cv) {
//       console.warn("OpenCV not available, skipping document detection")
//       resolve(imageData)
//       return
//     }

//     try {
//       const img = new Image()
//       img.onload = () => {
//         try {
//           // Create canvas for image processing
//           const canvas = document.createElement("canvas")
//           canvas.width = img.width
//           canvas.height = img.height
//           const ctx = canvas.getContext("2d")

//           // Draw image on canvas
//           ctx.drawImage(img, 0, 0, img.width, img.height)

//           // Get image data for processing
//           const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

//           // Try to detect and crop document using OpenCV
//           try {
//             const croppedImageData = findAndCropDocumentSimple(imgData)

//             if (croppedImageData) {
//               // Put cropped image data back on canvas
//               canvas.width = croppedImageData.width
//               canvas.height = croppedImageData.height
//               ctx.putImageData(croppedImageData, 0, 0)

//               // Return cropped image as data URL
//               resolve(canvas.toDataURL("image/jpeg", 0.95))
//             } else {
//               // If document detection failed, return original image
//               resolve(img.src)
//             }
//           } catch (error) {
//             console.error("Error in document detection:", error)
//             resolve(img.src) // Return original on error
//           }
//         } catch (error) {
//           console.error("Error processing image:", error)
//           resolve(img.src) // Return original on error
//         }
//       }
//       img.src = imageData
//     } catch (error) {
//       console.error("Error in detectAndCropDocument:", error)
//       resolve(imageData) // Return original on error
//     }
//   })
// }

// // Simplified document detection and cropping
// const findAndCropDocumentSimple = (imageData) => {
//   if (!window.cv) {
//     console.error("OpenCV is not loaded yet")
//     return null
//   }

//   try {
//     const cv = window.cv

//     // Convert ImageData to OpenCV Mat
//     const src = cv.matFromImageData(imageData)

//     // Create destination for grayscale image
//     const gray = new cv.Mat()

//     // Convert to grayscale
//     cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)

//     // Apply Gaussian blur
//     const blurred = new cv.Mat()
//     const ksize = new cv.Size(5, 5)
//     cv.GaussianBlur(gray, blurred, ksize, 0)

//     // Apply Canny edge detection
//     const edges = new cv.Mat()
//     cv.Canny(blurred, edges, 75, 200)

//     // Find contours
//     const contours = new cv.MatVector()
//     const hierarchy = new cv.Mat()
//     cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

//     // Find the largest contour (assuming it's the document)
//     let maxArea = 0
//     let maxContourIndex = -1

//     for (let i = 0; i < contours.size(); i++) {
//       const contour = contours.get(i)
//       const area = cv.contourArea(contour)

//       if (area > maxArea) {
//         maxArea = area
//         maxContourIndex = i
//       }
//     }

//     // If no significant contour found, return null
//     if (maxContourIndex === -1 || maxArea < src.rows * src.cols * 0.1) {
//       // Clean up OpenCV objects
//       src.delete()
//       gray.delete()
//       blurred.delete()
//       edges.delete()
//       contours.delete()
//       hierarchy.delete()
//       return null
//     }

//     // Approximate the contour to get a polygon
//     const maxContour = contours.get(maxContourIndex)
//     const epsilon = 0.02 * cv.arcLength(maxContour, true)
//     const approx = new cv.Mat()
//     cv.approxPolyDP(maxContour, approx, epsilon, true)

//     // If the polygon has 4 points, we assume it's a document
//     if (approx.rows === 4) {
//       // Extract points
//       const points = []
//       for (let i = 0; i < 4; i++) {
//         points.push({
//           x: approx.data32S[i * 2],
//           y: approx.data32S[i * 2 + 1],
//         })
//       }

//       // Sort points (top-left, top-right, bottom-right, bottom-left)
//       points.sort((a, b) => a.y - b.y)
//       const topPoints = points.slice(0, 2).sort((a, b) => a.x - b.x)
//       const bottomPoints = points.slice(2, 4).sort((a, b) => a.x - b.x)
//       points[0] = topPoints[0]
//       points[1] = topPoints[1]
//       points[2] = bottomPoints[1]
//       points[3] = bottomPoints[0]

//       // Create destination points for perspective transform
//       const width = Math.max(
//         Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y),
//         Math.hypot(points[3].x - points[2].x, points[3].y - points[2].y),
//       )
//       const height = Math.max(
//         Math.hypot(points[3].x - points[0].x, points[3].y - points[0].y),
//         Math.hypot(points[2].x - points[1].x, points[2].y - points[1].y),
//       )

//       // Create source and destination points for perspective transform
//       const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
//         points[0].x,
//         points[0].y,
//         points[1].x,
//         points[1].y,
//         points[2].x,
//         points[2].y,
//         points[3].x,
//         points[3].y,
//       ])
//       const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width - 1, 0, width - 1, height - 1, 0, height - 1])

//       // Apply perspective transform
//       const M = cv.getPerspectiveTransform(srcTri, dstTri)
//       const warpedImage = new cv.Mat()
//       cv.warpPerspective(src, warpedImage, M, new cv.Size(width, height))

//       // Convert back to RGBA for display
//       const result = new cv.Mat()
//       cv.cvtColor(warpedImage, result, cv.COLOR_BGR2RGBA)

//       // Convert OpenCV Mat back to ImageData
//       const croppedImageData = new ImageData(new Uint8ClampedArray(result.data), result.cols, result.rows)

//       // Clean up OpenCV objects
//       src.delete()
//       gray.delete()
//       blurred.delete()
//       edges.delete()
//       contours.delete()
//       hierarchy.delete()
//       approx.delete()
//       srcTri.delete()
//       dstTri.delete()
//       M.delete()
//       warpedImage.delete()
//       result.delete()

//       return croppedImageData
//     }

//     // Clean up OpenCV objects
//     src.delete()
//     gray.delete()
//     blurred.delete()
//     edges.delete()
//     contours.delete()
//     hierarchy.delete()
//     approx.delete()

//     return null
//   } catch (error) {
//     console.error("Error in findAndCropDocumentSimple:", error)
//     return null
//   }
// }

// const ScanUpload = ({ fileData, action, onClose }) => {
//   const [type, setType] = useState(fileData?.type || "")
//   const [file, setFile] = useState(fileData?.file || null)
//   const [fileName, setFileName] = useState(fileData?.file?.name || "")
//   const [departments, setDepartments] = useState([])
//   const [selectedDepartment, setSelectedDepartment] = useState(fileData?.department || "")
//   const [categories, setCategories] = useState([])
//   const [selectedCategory, setSelectedCategory] = useState(fileData?.category || "")
//   const [subject, setSubject] = useState(fileData?.subject || "")
//   const [date, setDate] = useState(fileData?.date || new Date().toISOString().split("T")[0])
//   const [diaryNo, setDiaryNo] = useState(fileData?.diaryNo || "")
//   const [from, setFrom] = useState(fileData?.from || "")
//   const [disposal, setDisposal] = useState(fileData?.disposal || "")
//   const [status, setStatus] = useState(fileData?.status || "")
//   const [isScanning, setIsScanning] = useState(false)
//   const [capturedImage, setCapturedImage] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const webcamRef = useRef(null)
//   const [isFullScreenScanning, setIsFullScreenScanning] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [isOpenCVLoaded, setIsOpenCVLoaded] = useState(false)
//   const [zoomLevel, setZoomLevel] = useState(1)
//   const [cameraFacingMode, setCameraFacingMode] = useState("environment")
//   const [isFocusing, setIsFocusing] = useState(false)
//   const videoRef = useRef(null)

//   // asking for camera acces
//   const requestCameraAccess = async () => {
//     try {
//       await navigator.mediaDevices.getUserMedia({ video: true })
//       console.log("Camera access granted")
//     } catch (error) {
//       console.error("Camera access denied", error)
//     }
//   }

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await fetch(`/api/department?type=${type}`, {
//           method: "GET",
//         })
//         const data = await response.json()
//         setDepartments(data)
//       } catch (error) {
//         console.error("Failed to fetch departments", error)
//       }
//       requestCameraAccess()
//     }

//     fetchDepartments()
//   }, [type])

//   useEffect(() => {
//     if (selectedDepartment) {
//       const department = departments.find((dept) => dept._id === selectedDepartment)
//       setCategories(department?.categories || [])
//     }
//   }, [selectedDepartment, departments])

//   const handleDepartmentChange = (e) => {
//     const departmentId = e.target.value
//     setSelectedDepartment(departmentId)
//     setSelectedCategory("") // Reset category when department changes
//   }

//   const handleCapture = async () => {
//     console.log("handleCapture function called")
//     if (webcamRef.current) {
//       setIsProcessing(true)
//       try {
//         console.log("Attempting to capture image")
//         // Capture image from webcam
//         const imageSrc = webcamRef.current.getScreenshot()
//         console.log("Image captured:", imageSrc ? "Success" : "Failed")

//         if (!imageSrc) {
//           throw new Error("Failed to capture image from camera")
//         }

//         // Step 1: Detect and crop document
//         console.log("Starting document detection")
//         let processedImage = imageSrc

//         // Try to detect and crop document
//         try {
//           const croppedImage = await detectAndCropDocument(imageSrc)
//           if (croppedImage) {
//             processedImage = croppedImage
//             console.log("Document detection and cropping successful")
//           } else {
//             console.log("Document detection failed, using original image")
//           }
//         } catch (cropError) {
//           console.error("Error in document detection:", cropError)
//         }

//         // Step 2: Preprocess image to improve quality
//         console.log("Starting image preprocessing")
//         try {
//           const enhancedImage = await preprocessImage(processedImage)
//           if (enhancedImage) {
//             processedImage = enhancedImage
//             console.log("Image preprocessing successful")
//           } else {
//             console.log("Image preprocessing failed, using previous image")
//           }
//         } catch (preprocessError) {
//           console.error("Error in image preprocessing:", preprocessError)
//         }

//         // Set the processed image
//         console.log("Setting captured image")
//         setCapturedImage(processedImage)
//         setIsScanning(false)
//         setIsFullScreenScanning(false)
//         console.log("Camera view closed")

//         // Step 3: Perform enhanced OCR on the processed image
//         console.log("Starting OCR")
//         try {
//           await performOCR(processedImage)
//           console.log("OCR completed")
//         } catch (ocrError) {
//           console.error("Error in OCR:", ocrError)
//         }
//       } catch (error) {
//         console.error("Error processing captured image:", error)
//         alert(error.message || "Failed to process the captured image.")
//       } finally {
//         setIsProcessing(false)
//         console.log("Processing completed")
//       }
//     } else {
//       console.error("Webcam reference is null")
//     }
//   }

//   const handleScanStart = () => {
//     setIsScanning(true)
//     setIsFullScreenScanning(true)
//     setCapturedImage(null)
//   }

//   const handleFocus = useCallback(
//     async (event) => {
//       if (videoRef.current && "mediaDevices" in navigator) {
//         setIsFocusing(true)
//         const { offsetX, offsetY } = event.nativeEvent
//         const { videoWidth, videoHeight } = videoRef.current

//         const focusX = offsetX / videoRef.current.offsetWidth
//         const focusY = offsetY / videoRef.current.offsetHeight

//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacingMode } })
//           const track = stream.getVideoTracks()[0]

//           if ("focusMode" in track.getCapabilities()) {
//             await track.applyConstraints({
//               advanced: [{ focusMode: "manual" }],
//             })

//             if ("focusDistance" in track.getCapabilities()) {
//               await track.applyConstraints({
//                 advanced: [
//                   {
//                     focusMode: "manual",
//                     focusDistance: Math.sqrt(Math.pow(focusX - 0.5, 2) + Math.pow(focusY - 0.5, 2)),
//                   },
//                 ],
//               })
//             }
//           }
//         } catch (error) {
//           console.error("Error setting focus:", error)
//         } finally {
//           setIsFocusing(false)
//         }
//       }
//     },
//     [cameraFacingMode],
//   )

//   const handleFileChange = useCallback(async (file) => {
//     setIsProcessing(true)

//     if (!file || file.type !== "application/pdf") {
//       alert("Please upload a valid PDF file.")
//       setSubject("")
//       setIsProcessing(false)
//       return
//     }
//     setFile(file)
//     setFileName(file.name)

//     try {
//       // Read the PDF as a file buffer
//       const fileBuffer = await file.arrayBuffer()

//       // Step 1: Attempt text extraction using pdfjs-dist
//       const text = await extractTextFromPdf(fileBuffer)

//       // Step 2: Try to find the subject in the extracted text
//       const subject = findSubjectInText(text)

//       // Step 3: Set the extracted subject
//       if (subject) {
//         setSubject(subject)
//       } else {
//         alert("No subject found in the uploaded file.")
//         setSubject("") // Clear subject if not found
//       }
//     } catch (error) {
//       console.error("Error processing file:", error)
//       alert("Failed to extract text or subject from the file.")
//     } finally {
//       setIsProcessing(false) // End processing
//     }
//   }, [])
//   const onDrop = useCallback(
//     (acceptedFiles) => {
//       console.log("Files dropped:", acceptedFiles)
//       const file = acceptedFiles[0]
//       if (file) {
//         setFile(file)
//         handleFileChange(file)
//         setFileName(file.name)
//       }
//     },
//     [handleFileChange],
//   )

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { "application/pdf": [".pdf"] }, // Accept only PDFs
//     onDragEnter: () => console.log("Drag entered"),
//     onDragLeave: () => console.log("Drag left"), // Accept only PDFs
//   })
//   console.log("isDragActive:", isDragActive)
//   async function extractTextFromPdf(fileBuffer) {
//     const loadingTask = pdfjsLib.getDocument(fileBuffer)
//     const pdf = await loadingTask.promise

//     let textContent = ""

//     // Iterate through each page to extract text
//     for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
//       const page = await pdf.getPage(pageIndex)

//       // Extract text content from the page using pdfjs-dist
//       const text = await page.getTextContent()

//       // Combine the text items into a single string
//       textContent += text.items.map((item) => item.str).join(" ")
//     }

//     return textContent
//   }

//   const performOCR = async (imageData) => {
//     // Convert PDF pages to PNG images
//     setIsProcessing(true)

//     try {
//       // Perform OCR on the scanned image
//       const result = await Tesseract.recognize(imageData, "eng", {
//         tessedit_char_whitelist:
//           "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:!?()[]{}+-*/=<>@#$%^&|~`\"' ",
//         tessedit_ocr_engine_mode: "2", // LSTM_ONLY mode for better text recognition
//         tessedit_pageseg_mode: "6", // Automatic page segmentation with OSD
//         preserve_interword_spaces: "1", // Preserve spaces between words
//         textord_heavy_nr: "1", // More aggressive noise removal
//         textord_min_linesize: "2.5",
//       })

//       const extractedText = result.data.text

//       // Try to find the subject in the extracted text
//       const subject = findSubjectInText(extractedText)
//       if (subject) {
//         setSubject(subject)
//       } else {
//         alert("No subject found in the scanned image.")
//         setSubject("")
//       }
//     } catch (error) {
//       console.error("Error performing OCR on scanned image:", error)
//       alert("Failed to extract text from the scanned image.")
//     } finally {
//       setIsProcessing(false)
//     }
//   }
//   // };

//   // Utility: Search for a "subject" in the extracted text
//   const findSubjectInText = (text) => {
//     // Refined regex to look for 'Subject' or 'Subj' at the beginning of a line and capture the following text
//     const subjectMatch = text.match(/(?:subject|subj)\s*[:-]?\s*(.*?)(?:\s{2,}|$|\n|\r|!|\?|\.|:)/i)
//     return subjectMatch ? subjectMatch[1].trim() : null
//   }

//   const convertImageToPdf = async (imageData) => {
//     return new Promise((resolve) => {
//       const img = new Image()
//       img.onload = () => {
//         const pdf = new jsPDF({
//           orientation: img.width > img.height ? "l" : "p",
//           unit: "px",
//           format: [img.width, img.height],
//         })
//         pdf.addImage(imageData, "JPEG", 0, 0, img.width, img.height)
//         resolve(pdf.output("blob"))
//       }
//       img.src = imageData
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     if ((!file && !capturedImage) || !selectedDepartment || !subject || !diaryNo || !from || !disposal || !status) {
//       alert("Please fill out all fields and either upload a file or capture an image.")
//       setIsLoading(false)
//       return
//     }

//     const formData = new FormData()

//     if (file) {
//       formData.append("file", file)
//       formData.append("fileName", file.name)
//     } else if (capturedImage) {
//       const pdfBlob = await convertImageToPdf(capturedImage)
//       formData.append("file", pdfBlob, "captured_image.pdf")
//     }
//     formData.append("type", type)
//     formData.append("department", selectedDepartment)
//     formData.append("category", selectedCategory)
//     formData.append("subject", subject)
//     formData.append("date", date)
//     formData.append("diaryNo", diaryNo)
//     formData.append("from", from)
//     formData.append("disposal", disposal)
//     formData.append("status", status)

//     const method = fileData ? "PUT" : "POST" // Update if editing, create if new
//     const url = fileData ? `/api/scanupload/${fileData._id}` : "/api/scanupload"

//     try {
//       const response = await fetch(url, {
//         method,
//         body: formData,
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       alert(data.message)
//       onClose()
//     } catch (error) {
//       console.error("Upload error:", error)
//       alert(`An error occurred during upload: ${error.message}`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   console.log("setType in ScanUploadPage:", setType)

//   useEffect(() => {
//     // Track if OpenCV is loaded

//     // Function to initialize OpenCV
//     const loadOpenCV = () => {
//       // Check if OpenCV is already loaded
//       if (window.cv) {
//         console.log("OpenCV.js already loaded")
//         setIsOpenCVLoaded(true)
//         return
//       }

//       // Create a global callback for when OpenCV is ready
//       window.onOpenCVReady = () => {
//         console.log("OpenCV.js initialized")
//         setIsOpenCVLoaded(true)
//       }

//       // Load OpenCV.js from CDN
//       const script = document.createElement("script")
//       script.src = "https://docs.opencv.org/4.5.5/opencv.js"
//       script.async = true
//       script.onload = () => console.log("OpenCV.js script loaded")
//       script.onerror = (err) => console.error("Error loading OpenCV.js", err)
//       document.body.appendChild(script)

//       return () => {
//         // Clean up
//         if (script && script.parentNode) {
//           document.body.removeChild(script)
//         }
//         delete window.onOpenCVReady
//       }
//     }

//     loadOpenCV()
//   }, [])

//   const increaseZoom = () => {
//     setZoomLevel((prev) => Math.min(prev + 0.25, 3))
//   }

//   const decreaseZoom = () => {
//     setZoomLevel((prev) => Math.max(prev - 0.25, 1))
//   }

//   const handleCloseCamera = () => {
//     setIsScanning(false)
//     setIsFullScreenScanning(false)
//     setCapturedImage(null)
//   }

//   return (
//     <div className={`${isFullScreenScanning ? "fixed inset-0 z-50" : "bg-zinc-800 p-10 "}`}>
//       <div
//         className={`${
//           isFullScreenScanning
//             ? "h-full max-h-full"
//             : "bg-white p-6 rounded-lg max-w-4xl mx-auto overflow-y-auto xl:max-h-[710px] max-h-[860px]"
//         }`}
//       >
//         {!isFullScreenScanning ? <h2 className="text-3xl text-center font-semibold mb-6">{action} Form</h2> : null}
//         <form onSubmit={handleSubmit} className="suform">
//           {!isFullScreenScanning ? (
//             <>
//               <div className="form-group">
//                 <label>Type</label>
//                 <select value={type} onChange={(e) => setType(e.target.value)}>
//                   <option value="">Select Type</option>
//                   <option value="uni">University</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//               <div className="flex flex-col sm:flex-row sm:gap-4">
//                 <div className="form-groupf">
//                   <label>Department</label>
//                   <select value={selectedDepartment} onChange={handleDepartmentChange} required>
//                     <option value="">Select Department</option>
//                     {departments.map((dept) => (
//                       <option key={dept._id} value={dept._id}>
//                         {dept.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-groupf">
//                   <label>Category</label>
//                   <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
//                     <option value="">Select Category</option>
//                     {categories.map((cat, index) => (
//                       <option key={index} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Subject</label>
//                 <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
//               </div>
//               <div className="flex flex-col sm:flex-row sm:gap-4">
//                 <div className="form-groupf">
//                   <label>Date</label>
//                   <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
//                 </div>
//                 <div className="form-groupf">
//                   <label>Diary No</label>
//                   <input type="text" value={diaryNo} onChange={(e) => setDiaryNo(e.target.value)} required />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>From</label>
//                 <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} required />
//               </div>
//               <div className="form-group">
//                 <label>Disposal</label>
//                 <input type="text" value={disposal} onChange={(e) => setDisposal(e.target.value)} required />
//               </div>
//               <div className="form-group">
//                 <label>Status</label>
//                 <select value={status} onChange={(e) => setStatus(e.target.value)} required>
//                   <option value="">Select Status</option>
//                   <option value="open">Open</option>
//                   <option value="closed">Closed</option>
//                 </select>
//               </div>
//             </>
//           ) : null}

//           {action === "Scan" ? (
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">Document Scanning</h3>
//               {!isScanning && !capturedImage && (
//                 <button className="subutton" type="button" onClick={handleScanStart}>
//                   Start Scanning
//                 </button>
//               )}
//               {isScanning && (
//                 <div className="bg-zinc-800 absolute inset-0 flex flex-col items-center justify-center">
//                   <div className="relative w-full h-full" onClick={handleFocus}>
//                     <Webcam
//                       className="w-full h-full object-cover"
//                       audio={false}
//                       screenshotFormat="image/jpeg"
//                       ref={(ref) => {
//                         webcamRef.current = ref
//                         videoRef.current = ref && ref.video
//                       }}
//                       width="100%"
//                       playsInline
//                       videoConstraints={{
//                         facingMode: cameraFacingMode,
//                         width: { ideal: 1920 },
//                         height: { ideal: 1080 },
//                         advanced: [{ zoom: zoomLevel }],
//                       }}
//                     />
//                     {isFocusing && (
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <Focus className="w-12 h-12 text-white animate-pulse" />
//                       </div>
//                     )}
//                     {isProcessing && (
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                         <div className="text-white flex flex-col items-center">
//                           <RefreshCw className="w-12 h-12 animate-spin mb-2" />
//                           <p>Processing image...</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
//                     <button className="p-2 bg-white rounded-full" onClick={decreaseZoom} type="button">
//                       <ZoomOut className="w-6 h-6" />
//                     </button>
//                     <button
//                       className="w-16 h-16 bg-white border-4 border-green-500 rounded-full shadow-lg hover:bg-gray-300 transition duration-200"
//                       onClick={handleCapture}
//                       type="button"
//                     >
//                       <Camera className="w-8 h-8 mx-auto" />
//                     </button>
//                     <button className="p-2 bg-white rounded-full" onClick={increaseZoom} type="button">
//                       <ZoomIn className="w-6 h-6" />
//                     </button>
//                   </div>

//                   <button
//                     className="absolute top-4 left-4 p-2 bg-white rounded-full"
//                     onClick={handleCloseCamera}
//                     type="button"
//                   >
//                     <p className="w-6 h-6">X</p>
//                   </button>
//                 </div>
//               )}
//               {capturedImage && (
//                 <div className="space-y-4">
//                   <img
//                     src={capturedImage || "/placeholder.svg"}
//                     alt="Captured"
//                     className="w-full rounded-lg shadow-lg"
//                   />
//                   <button className="subutton" type="button" onClick={handleScanStart}>
//                     Scan Again
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="form-group">
//               <label>File</label>
//               <div
//                 {...getRootProps()}
//                 className={`flex flex-col items-center justify-center w-full h-40 p-6 border-2 border-dashed bg-gray-100 rounded-lg cursor-pointer transition-all ${
//                   isDragActive ? "border-blue-500 bg-gray-200" : "border-gray-400"
//                 }`}
//               >
//                 <input {...getInputProps({ accept: ".pdf,image/*" })} />
//                 <UploadCloud size={40} className="text-gray-500 mb-3" />
//                 {isDragActive ? (
//                   <p className="text-lg font-semibold text-blue-600">Drop your file here...</p>
//                 ) : (
//                   <p className="text-lg text-gray-700">
//                     Drag & Drop your PDF or Image here or{" "}
//                     <span className="text-blue-500 font-medium">click to browse</span>
//                   </p>
//                 )}
//               </div>
//               {file && (
//                 <p className="mt-2 text-gray-700">
//                   Uploaded File: <strong>{fileName}</strong>
//                 </p>
//               )}
//               {isProcessing && <p>Extracting text from file... Please wait.</p>}
//             </div>
//           )}
//           {!isFullScreenScanning ? (
//             <div className="flex gap-10 justify-center">
//               <button className="subutton" type="submit" disabled={isLoading || (!file && !capturedImage)}>
//                 {isLoading ? "Saving..." : "Save"}
//               </button>
//               <button className="subutton" type="button" onClick={onClose}>
//                 Cancel
//               </button>
//             </div>
//           ) : null}
//         </form>
//       </div>
//     </div>
//   )
// }

// export default ScanUpload





// test code

// "use client";

// import "@styles/globals.css";
// import { useState, useEffect, useRef, useCallback } from "react";
// import Webcam from "react-webcam";
// import { jsPDF } from "jspdf";
// import { useDropzone } from "react-dropzone";
// import { UploadCloud, ZoomIn, ZoomOut, RefreshCw, Camera, Focus } from "lucide-react";
// import Tesseract from "tesseract.js";
// import * as pdfjsLib from "pdfjs-dist/webpack";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// // Preprocess image only for OCR, preserving original
// const preprocessImageForOCR = async (imageData, isBlackAndWhite) => {
//   return new Promise((resolve) => {
//     try {
//       const img = new Image();
//       img.crossOrigin = "anonymous";

//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext("2d");

//         if (!ctx) {
//           console.error("Failed to get canvas context");
//           resolve(imageData);
//           return;
//         }

//         ctx.drawImage(img, 0, 0);
//         let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//         if (isBlackAndWhite) {
//           imgData = enhanceBlackAndWhiteImage(imgData);
//         }

//         ctx.putImageData(imgData, 0, 0);
//         resolve(canvas.toDataURL("image/jpeg", 0.95));
//       };

//       img.onerror = () => {
//         console.error("Error loading image");
//         resolve(imageData);
//       };

//       img.src = imageData;
//     } catch (error) {
//       console.error("Error in preprocessImageForOCR:", error);
//       resolve(imageData);
//     }
//   });
// };

// // Detect if image is black-and-white
// const isBlackAndWhiteImage = (imageData) => {
//   const data = imageData.data;
//   for (let i = 0; i < data.length; i += 4) {
//     const r = data[i];
//     const g = data[i + 1];
//     const b = data[i + 2];
//     if (Math.abs(r - g) > 20 || Math.abs(g - b) > 20 || Math.abs(b - r) > 20) {
//       return false;
//     }
//   }
//   return true;
// };

// // Enhance black-and-white images for OCR
// const enhanceBlackAndWhiteImage = (imageData) => {
//   const data = new Uint8ClampedArray(imageData.data);
//   const width = imageData.width;
//   const height = imageData.height;

//   for (let i = 0; i < data.length; i += 4) {
//     const r = data[i];
//     const g = data[i + 1];
//     const b = data[i + 2];
//     const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
//     data[i] = data[i + 1] = data[i + 2] = gray;
//   }

//   const contrastFactor = 1.8;
//   const mid = 128;
//   for (let i = 0; i < data.length; i += 4) {
//     for (let j = 0; j < 3; j++) {
//       data[i + j] = Math.min(255, Math.max(0, contrastFactor * (data[i + j] - mid) + mid));
//     }
//   }

//   const threshold = 128;
//   for (let i = 0; i < data.length; i += 4) {
//     const value = data[i] > threshold ? 255 : 0;
//     data[i] = data[i + 1] = data[i + 2] = value;
//   }

//   return new ImageData(data, width, height);
// };

// // Document detection and cropping (unchanged)
// const detectAndCropDocument = async (imageData) => {
//   return new Promise((resolve) => {
//     if (!window.cv) {
//       console.warn("OpenCV not available, skipping document detection");
//       resolve(imageData);
//       return;
//     }

//     try {
//       const img = new Image();
//       img.onload = () => {
//         try {
//           const canvas = document.createElement("canvas");
//           canvas.width = img.width;
//           canvas.height = img.height;
//           const ctx = canvas.getContext("2d");

//           ctx.drawImage(img, 0, 0);
//           const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//           const croppedImageData = findAndCropDocumentSimple(imgData);

//           if (croppedImageData) {
//             canvas.width = croppedImageData.width;
//             canvas.height = croppedImageData.height;
//             ctx.putImageData(croppedImageData, 0, 0);
//             resolve(canvas.toDataURL("image/jpeg", 0.95));
//           } else {
//             resolve(img.src);
//           }
//         } catch (error) {
//           console.error("Error processing image:", error);
//           resolve(img.src);
//         }
//       };
//       img.src = imageData;
//     } catch (error) {
//       console.error("Error in detectAndCropDocument:", error);
//       resolve(imageData);
//     }
//   });
// };

// // Simplified document detection (unchanged)
// const findAndCropDocumentSimple = (imageData) => {
//   if (!window.cv) {
//     console.error("OpenCV is not loaded yet");
//     return null;
//   }

//   try {
//     const cv = window.cv;
//     const src = cv.matFromImageData(imageData);
//     const gray = new cv.Mat();
//     cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//     const blurred = new cv.Mat();
//     const ksize = new cv.Size(5, 5);
//     cv.GaussianBlur(gray, blurred, ksize, 0);

//     const edges = new cv.Mat();
//     cv.Canny(blurred, edges, 75, 200);

//     const contours = new cv.MatVector();
//     const hierarchy = new cv.Mat();
//     cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

//     let maxArea = 0;
//     let maxContourIndex = -1;

//     for (let i = 0; i < contours.size(); i++) {
//       const contour = contours.get(i);
//       const area = cv.contourArea(contour);
//       if (area > maxArea) {
//         maxArea = area;
//         maxContourIndex = i;
//       }
//     }

//     if (maxContourIndex === -1 || maxArea < src.rows * src.cols * 0.1) {
//       src.delete();
//       gray.delete();
//       blurred.delete();
//       edges.delete();
//       contours.delete();
//       hierarchy.delete();
//       return null;
//     }

//     const maxContour = contours.get(maxContourIndex);
//     const epsilon = 0.02 * cv.arcLength(maxContour, true);
//     const approx = new cv.Mat();
//     cv.approxPolyDP(maxContour, approx, epsilon, true);

//     if (approx.rows === 4) {
//       const points = [];
//       for (let i = 0; i < 4; i++) {
//         points.push({ x: approx.data32S[i * 2], y: approx.data32S[i * 2 + 1] });
//       }

//       points.sort((a, b) => a.y - b.y);
//       const topPoints = points.slice(0, 2).sort((a, b) => a.x - b.x);
//       const bottomPoints = points.slice(2, 4).sort((a, b) => a.x - b.x);
//       points[0] = topPoints[0];
//       points[1] = topPoints[1];
//       points[2] = bottomPoints[1];
//       points[3] = bottomPoints[0];

//       const width = Math.max(
//         Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y),
//         Math.hypot(points[3].x - points[2].x, points[3].y - points[2].y),
//       );
//       const height = Math.max(
//         Math.hypot(points[3].x - points[0].x, points[3].y - points[0].y),
//         Math.hypot(points[2].x - points[1].x, points[2].y - points[1].y),
//       );

//       const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
//         points[0].x,
//         points[0].y,
//         points[1].x,
//         points[1].y,
//         points[2].x,
//         points[2].y,
//         points[3].x,
//         points[3].y,
//       ]);
//       const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width - 1, 0, width - 1, height - 1, 0, height - 1]);

//       const M = cv.getPerspectiveTransform(srcTri, dstTri);
//       const warpedImage = new cv.Mat();
//       cv.warpPerspective(src, warpedImage, M, new cv.Size(width, height));

//       const result = new cv.Mat();
//       cv.cvtColor(warpedImage, result, cv.COLOR_BGR2RGBA);

//       const croppedImageData = new ImageData(new Uint8ClampedArray(result.data), result.cols, result.rows);

//       src.delete();
//       gray.delete();
//       blurred.delete();
//       edges.delete();
//       contours.delete();
//       hierarchy.delete();
//       approx.delete();
//       srcTri.delete();
//       dstTri.delete();
//       M.delete();
//       warpedImage.delete();
//       result.delete();

//       return croppedImageData;
//     }

//     src.delete();
//     gray.delete();
//     blurred.delete();
//     edges.delete();
//     contours.delete();
//     hierarchy.delete();
//     approx.delete();

//     return null;
//   } catch (error) {
//     console.error("Error in findAndCropDocumentSimple:", error);
//     return null;
//   }
// };

// const ScanUpload = ({ fileData, action, onClose }) => {
//   const [type, setType] = useState(fileData?.type || "");
//   const [file, setFile] = useState(fileData?.file || null);
//   const [fileName, setFileName] = useState(fileData?.file?.name || "");
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState(fileData?.department || "");
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(fileData?.category || "");
//   const [subject, setSubject] = useState(fileData?.subject || "");
//   const [date, setDate] = useState(fileData?.date || new Date().toISOString().split("T")[0]);
//   const [diaryNo, setDiaryNo] = useState(fileData?.diaryNo || "");
//   const [from, setFrom] = useState(fileData?.from || "");
//   const [disposal, setDisposal] = useState(fileData?.disposal || "");
//   const [status, setStatus] = useState(fileData?.status || "");
//   const [isScanning, setIsScanning] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const webcamRef = useRef(null);
//   const [isFullScreenScanning, setIsFullScreenScanning] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isOpenCVLoaded, setIsOpenCVLoaded] = useState(false);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [cameraFacingMode, setCameraFacingMode] = useState("environment");
//   const [isFocusing, setIsFocusing] = useState(false);
//   const videoRef = useRef(null);

//   const requestCameraAccess = async () => {
//     try {
//       await navigator.mediaDevices.getUserMedia({ video: true });
//       console.log("Camera access granted");
//     } catch (error) {
//       console.error("Camera access denied", error);
//     }
//   };

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await fetch(`/api/department?type=${type}`, { method: "GET" });
//         const data = await response.json();
//         setDepartments(data);
//       } catch (error) {
//         console.error("Failed to fetch departments", error);
//       }
//       requestCameraAccess();
//     };

//     fetchDepartments();
//   }, [type]);

//   useEffect(() => {
//     if (selectedDepartment) {
//       const department = departments.find((dept) => dept._id === selectedDepartment);
//       setCategories(department?.categories || []);
//     }
//   }, [selectedDepartment, departments]);

//   const handleDepartmentChange = (e) => {
//     const departmentId = e.target.value;
//     setSelectedDepartment(departmentId);
//     setSelectedCategory("");
//   };

//   const handleCapture = async () => {
//     console.log("handleCapture function called");
//     if (webcamRef.current) {
//       setIsProcessing(true);
//       try {
//         console.log("Attempting to capture image");
//         const imageSrc = webcamRef.current.getScreenshot();
//         console.log("Image captured:", imageSrc ? "Success" : "Failed");

//         if (!imageSrc) {
//           throw new Error("Failed to capture image from camera");
//         }

//         console.log("Setting captured image (original)");
//         setCapturedImage(imageSrc);

//         let processedImage = imageSrc;
//         console.log("Starting document detection");
//         try {
//           const croppedImage = await detectAndCropDocument(imageSrc);
//           if (croppedImage) {
//             processedImage = croppedImage;
//             console.log("Document detection and cropping successful");
//           } else {
//             console.log("Document detection failed, using original image");
//           }
//         } catch (cropError) {
//           console.error("Error in document detection:", cropError);
//         }

//         const img = new Image();
//         img.src = processedImage;
//         await new Promise((resolve) => (img.onload = resolve));
//         const canvas = document.createElement("canvas");
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0);
//         const imgData = ctx.getImageData(0, 0, img.width, img.height);
//         const isBlackAndWhite = isBlackAndWhiteImage(imgData);

//         console.log("Starting image preprocessing for OCR");
//         try {
//           const ocrImage = await preprocessImageForOCR(processedImage, isBlackAndWhite);
//           console.log("Image preprocessing for OCR successful");
//           processedImage = ocrImage;
//         } catch (preprocessError) {
//           console.error("Error in image preprocessing:", preprocessError);
//         }

//         setIsScanning(false);
//         setIsFullScreenScanning(false);
//         console.log("Camera view closed");

//         console.log("Starting OCR");
//         try {
//           await performEnhancedOCR(processedImage);
//           console.log("OCR completed");
//         } catch (ocrError) {
//           console.error("Error in OCR:", ocrError);
//         }
//       } catch (error) {
//         console.error("Error processing captured image:", error);
//         alert(error.message || "Failed to process the captured image.");
//       } finally {
//         setIsProcessing(false);
//         console.log("Processing completed");
//       }
//     } else {
//       console.error("Webcam reference is null");
//     }
//   };

//   const performEnhancedOCR = async (imageData) => {
//     setIsProcessing(true);
//     try {
//       const { data } = await Tesseract.recognize(imageData, "eng", {
//         tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY,
//         tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
//         tessedit_char_whitelist: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:!?()[]{}+-*/=<>@#$%^&|~`' ",
//         preserve_interword_spaces: "1",
//       });

//       const extractedText = data.text;
//       console.log("OCR Extracted Text:", extractedText);

//       const subject = findSubjectInText(extractedText);
//       if (subject) {
//         setSubject(subject);
//         setFileName(subject); // Set fileName to subject for scanned images
//       } else {
//         console.warn("No subject found in OCR text");
//         setSubject("");
//         alert("Could not detect subject in the scanned document.");
//       }
//     } catch (error) {
//       console.error("OCR Error:", error);
//       alert("Failed to perform OCR: " + error.message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleScanStart = () => {
//     setIsScanning(true);
//     setIsFullScreenScanning(true);
//     setCapturedImage(null);
//   };

//   const handleFocus = useCallback(
//     async (event) => {
//       if (videoRef.current && "mediaDevices" in navigator) {
//         setIsFocusing(true);
//         const { offsetX, offsetY } = event.nativeEvent;
//         const { videoWidth, videoHeight } = videoRef.current;

//         const focusX = offsetX / videoRef.current.offsetWidth;
//         const focusY = offsetY / videoRef.current.offsetHeight;

//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacingMode } });
//           const track = stream.getVideoTracks()[0];

//           if ("focusMode" in track.getCapabilities()) {
//             await track.applyConstraints({ advanced: [{ focusMode: "manual" }] });

//             if ("focusDistance" in track.getCapabilities()) {
//               await track.applyConstraints({
//                 advanced: [
//                   {
//                     focusMode: "manual",
//                     focusDistance: Math.sqrt(Math.pow(focusX - 0.5, 2) + Math.pow(focusY - 0.5, 2)),
//                   },
//                 ],
//               });
//             }
//           }
//         } catch (error) {
//           console.error("Error setting focus:", error);
//         } finally {
//           setIsFocusing(false);
//         }
//       }
//     },
//     [cameraFacingMode],
//   );

//   const handleFileChange = useCallback(async (file) => {
//     setIsProcessing(true);

//     if (!file || file.type !== "application/pdf") {
//       alert("Please upload a valid PDF file.");
//       setSubject("");
//       setIsProcessing(false);
//       return;
//     }
//     setFile(file);
//     setFileName(file.name);

//     try {
//       const fileBuffer = await file.arrayBuffer();
//       const text = await extractTextFromPdf(fileBuffer);
//       const subject = findSubjectInText(text);

//       if (subject) {
//         setSubject(subject);
//       } else {
//         alert("No subject found in the uploaded file.");
//         setSubject("");
//       }
//     } catch (error) {
//       console.error("Error processing file:", error);
//       alert("Failed to extract text or subject from the file.");
//     } finally {
//       setIsProcessing(false);
//     }
//   }, []);

//   const onDrop = useCallback(
//     (acceptedFiles) => {
//       console.log("Files dropped:", acceptedFiles);
//       const file = acceptedFiles[0];
//       if (file) {
//         setFile(file);
//         handleFileChange(file);
//         setFileName(file.name);
//       }
//     },
//     [handleFileChange],
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { "application/pdf": [".pdf"] },
//     onDragEnter: () => console.log("Drag entered"),
//     onDragLeave: () => console.log("Drag left"),
//   });

//   async function extractTextFromPdf(fileBuffer) {
//     const loadingTask = pdfjsLib.getDocument(fileBuffer);
//     const pdf = await loadingTask.promise;

//     let textContent = "";
//     for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
//       const page = await pdf.getPage(pageIndex);
//       const text = await page.getTextContent();
//       textContent += text.items.map((item) => item.str).join(" ");
//     }

//     return textContent;
//   }

//   const findSubjectInText = (text) => {
//     const subjectMatch = text.match(/(?:subject|subj)\s*:\s*(.*?)(?:\n|\r|$|\s{2,}|\.|!|\?)/i);
//     return subjectMatch ? subjectMatch[1].trim() : null;
//   };

//   const convertImageToPdf = async (imageData) => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.onload = () => {
//         const pdf = new jsPDF({
//           orientation: img.width > img.height ? "l" : "p",
//           unit: "px",
//           format: [img.width, img.height],
//         });
//         pdf.addImage(imageData, "JPEG", 0, 0, img.width, img.height);
//         resolve(pdf.output("blob"));
//       };
//       img.src = imageData;
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     if ((!file && !capturedImage) || !selectedDepartment || !subject || !diaryNo || !from || !disposal || !status) {
//       alert("Please fill out all fields and either upload a file or capture an image.");
//       setIsLoading(false);
//       return;
//     }

//     const formData = new FormData();

//     if (file) {
//       formData.append("file", file);
//       formData.append("fileName", fileName || subject); // Use subject as fallback
//     } else if (capturedImage) {
//       const pdfBlob = await convertImageToPdf(capturedImage);
//       const finalFileName = fileName || subject || "captured_image"; // Use subject if available
//       formData.append("file", pdfBlob, `${finalFileName}.pdf`);
//       formData.append("fileName", finalFileName);
//     }

//     formData.append("type", type);
//     formData.append("department", selectedDepartment);
//     formData.append("category", selectedCategory);
//     formData.append("subject", subject);
//     formData.append("date", date);
//     formData.append("diaryNo", diaryNo);
//     formData.append("from", from);
//     formData.append("disposal", disposal);
//     formData.append("status", status);

//     const method = fileData ? "PUT" : "POST";
//     const url = fileData ? `/api/scanupload/${fileData._id}` : "/api/scanupload";

//     try {
//       const response = await fetch(url, { method, body: formData });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       alert(data.message);
//       onClose();
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert(`An error occurred during upload: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const loadOpenCV = () => {
//       if (window.cv) {
//         console.log("OpenCV.js already loaded");
//         setIsOpenCVLoaded(true);
//         return;
//       }

//       window.onOpenCVReady = () => {
//         console.log("OpenCV.js initialized");
//         setIsOpenCVLoaded(true);
//       };

//       const script = document.createElement("script");
//       script.src = "https://docs.opencv.org/4.5.5/opencv.js";
//       script.async = true;
//       script.onload = () => console.log("OpenCV.js script loaded");
//       script.onerror = (err) => console.error("Error loading OpenCV.js", err);
//       document.body.appendChild(script);

//       return () => {
//         if (script && script.parentNode) {
//           document.body.removeChild(script);
//         }
//         delete window.onOpenCVReady;
//       };
//     };

//     loadOpenCV();
//   }, []);

//   const increaseZoom = () => {
//     setZoomLevel((prev) => Math.min(prev + 0.25, 3));
//   };

//   const decreaseZoom = () => {
//     setZoomLevel((prev) => Math.max(prev - 0.25, 1));
//   };

//   const handleCloseCamera = () => {
//     setIsScanning(false);
//     setIsFullScreenScanning(false);
//     setCapturedImage(null);
//   };

//   return (
//     <div className={`${isFullScreenScanning ? "fixed inset-0 z-50" : "bg-zinc-800 p-10 "}`}>
//       <div
//         className={`${
//           isFullScreenScanning
//             ? "h-full max-h-full"
//             : "bg-white p-6 rounded-lg max-w-4xl mx-auto overflow-y-auto xl:max-h-[710px] max-h-[860px]"
//         }`}
//       >
//         {!isFullScreenScanning ? <h2 className="text-3xl text-center font-semibold mb-6">{action} Form</h2> : null}
//         <form onSubmit={handleSubmit} className="suform">
//           {!isFullScreenScanning ? (
//             <>
//               <div className="form-group">
//                 <label>Type</label>
//                 <select value={type} onChange={(e) => setType(e.target.value)}>
//                   <option value="">Select Type</option>
//                   <option value="uni">University</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//               <div className="flex flex-col sm:flex-row sm:gap-4">
//                 <div className="form-groupf">
//                   <label>Department</label>
//                   <select value={selectedDepartment} onChange={handleDepartmentChange} required>
//                     <option value="">Select Department</option>
//                     {departments.map((dept) => (
//                       <option key={dept._id} value={dept._id}>
//                         {dept.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-groupf">
//                   <label>Category</label>
//                   <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
//                     <option value="">Select Category</option>
//                     {categories.map((cat, index) => (
//                       <option key={index} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Subject</label>
//                 <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
//               </div>
//               <div className="flex flex-col sm:flex-row sm:gap-4">
//                 <div className="form-groupf">
//                   <label>Date</label>
//                   <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
//                 </div>
//                 <div className="form-groupf">
//                   <label>Diary No</label>
//                   <input type="text" value={diaryNo} onChange={(e) => setDiaryNo(e.target.value)} required />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>From</label>
//                 <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} required />
//               </div>
//               <div className="form-group">
//                 <label>Disposal</label>
//                 <input type="text" value={disposal} onChange={(e) => setDisposal(e.target.value)} required />
//               </div>
//               <div className="form-group">
//                 <label>Status</label>
//                 <select value={status} onChange={(e) => setStatus(e.target.value)} required>
//                   <option value="">Select Status</option>
//                   <option value="open">Open</option>
//                   <option value="closed">Closed</option>
//                 </select>
//               </div>
//             </>
//           ) : null}

//           {action === "Scan" ? (
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">Document Scanning</h3>
//               {!isScanning && !capturedImage && (
//                 <button className="subutton" type="button" onClick={handleScanStart}>
//                   Start Scanning
//                 </button>
//               )}
//               {isScanning && (
//                 <div className="bg-zinc-800 absolute inset-0 flex flex-col items-center justify-center">
//                   <div className="relative w-full h-full" onClick={handleFocus}>
//                     <Webcam
//                       className="w-full h-full object-cover"
//                       audio={false}
//                       screenshotFormat="image/jpeg"
//                       ref={(ref) => {
//                         webcamRef.current = ref;
//                         videoRef.current = ref && ref.video;
//                       }}
//                       width="100%"
//                       playsInline
//                       videoConstraints={{
//                         facingMode: cameraFacingMode,
//                         width: { ideal: 1920 },
//                         height: { ideal: 1080 },
//                         advanced: [{ zoom: zoomLevel }],
//                       }}
//                     />
//                     {isFocusing && (
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <Focus className="w-12 h-12 text-white animate-pulse" />
//                       </div>
//                     )}
//                     {isProcessing && (
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                         <div className="text-white flex flex-col items-center">
//                           <RefreshCw className="w-12 h-12 animate-spin mb-2" />
//                           <p>Processing image...</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
//                     <button className="p-2 bg-white rounded-full" onClick={decreaseZoom} type="button">
//                       <ZoomOut className="w-6 h-6" />
//                     </button>
//                     <button
//                       className="w-16 h-16 bg-white border-4 border-green-500 rounded-full shadow-lg hover:bg-gray-300 transition duration-200"
//                       onClick={handleCapture}
//                       type="button"
//                     >
//                       <Camera className="w-8 h-8 mx-auto" />
//                     </button>
//                     <button className="p-2 bg-white rounded-full" onClick={increaseZoom} type="button">
//                       <ZoomIn className="w-6 h-6" />
//                     </button>
//                   </div>
//                   <button
//                     className="absolute top-4 left-4 p-2 bg-white rounded-full"
//                     onClick={handleCloseCamera}
//                     type="button"
//                   >
//                     <p className="w-6 h-6">X</p>
//                   </button>
//                 </div>
//               )}
//               {capturedImage && (
//                 <div className="space-y-4">
//                   <img
//                     src={capturedImage || "/placeholder.svg"}
//                     alt="Captured"
//                     className="w-full rounded-lg shadow-lg"
//                   />
//                   <button className="subutton" type="button" onClick={handleScanStart}>
//                     Scan Again
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="form-group">
//               <label>File</label>
//               <div
//                 {...getRootProps()}
//                 className={`flex flex-col items-center justify-center w-full h-40 p-6 border-2 border-dashed bg-gray-100 rounded-lg cursor-pointer transition-all ${
//                   isDragActive ? "border-blue-500 bg-gray-200" : "border-gray-400"
//                 }`}
//               >
//                 <input {...getInputProps({ accept: ".pdf,image/*" })} />
//                 <UploadCloud size={40} className="text-gray-500 mb-3" />
//                 {isDragActive ? (
//                   <p className="text-lg font-semibold text-blue-600">Drop your file here...</p>
//                 ) : (
//                   <p className="text-lg text-gray-700">
//                     Drag & Drop your PDF or Image here or{" "}
//                     <span className="text-blue-500 font-medium">click to browse</span>
//                   </p>
//                 )}
//               </div>
//               {file && (
//                 <p className="mt-2 text-gray-700">
//                   Uploaded File: <strong>{fileName}</strong>
//                 </p>
//               )}
//               {isProcessing && <p>Extracting text from file... Please wait.</p>}
//             </div>
//           )}
//           {!isFullScreenScanning ? (
//             <div className="flex gap-10 justify-center">
//               <button className="subutton" type="submit" disabled={isLoading || (!file && !capturedImage)}>
//                 {isLoading ? "Saving..." : "Save"}
//               </button>
//               <button className="subutton" type="button" onClick={onClose}>
//                 Cancel
//               </button>
//             </div>
//           ) : null}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ScanUpload;










// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"
// import Webcam from "react-webcam"
// import { jsPDF } from "jspdf"
// import { useDropzone } from "react-dropzone"
// import {
//   UploadCloud,
//   ZoomIn,
//   ZoomOut,
//   RefreshCw,
//   Camera,
//   Focus,
//   Crop,
//   X,
//   Check,
//   SlidersHorizontal,
//   RotateCw,
// } from "lucide-react"
// import Tesseract from "tesseract.js"
// import * as pdfjsLib from "pdfjs-dist/webpack"
// import ReactCrop from "react-image-crop"
// import "react-image-crop/dist/ReactCrop.css"

// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

// // Preprocess image only for OCR, preserving original
// const preprocessImageForOCR = async (imageData, filterType) => {
//   return new Promise((resolve) => {
//     try {
//       const img = new Image()
//       img.crossOrigin = "anonymous"

//       img.onload = () => {
//         const canvas = document.createElement("canvas")
//         canvas.width = img.width
//         canvas.height = img.height
//         const ctx = canvas.getContext("2d")

//         if (!ctx) {
//           console.error("Failed to get canvas context")
//           resolve(imageData)
//           return
//         }

//         ctx.drawImage(img, 0, 0)
//         let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

//         switch (filterType) {
//           case "bw":
//             imgData = convertToBlackAndWhite(imgData)
//             break
//           case "grayscale":
//             imgData = convertToGrayscale(imgData)
//             break
//           case "high-contrast":
//             imgData = enhanceContrast(imgData)
//             break
//           case "enhanced":
//             imgData = enhanceImage(imgData)
//             break
//           case "color-enhance":
//             imgData = enhanceColorDocument(imgData)
//             break
//           default:
//             // Keep original
//             break
//         }

//         ctx.putImageData(imgData, 0, 0)
//         resolve(canvas.toDataURL("image/jpeg", 0.95))
//       }

//       img.onerror = () => {
//         console.error("Error loading image")
//         resolve(imageData)
//       }

//       img.src = imageData
//     } catch (error) {
//       console.error("Error in preprocessImageForOCR:", error)
//       resolve(imageData)
//     }
//   })
// }

// // Convert to grayscale
// const convertToGrayscale = (imageData) => {
//   const data = new Uint8ClampedArray(imageData.data)
//   for (let i = 0; i < data.length; i += 4) {
//     const r = data[i]
//     const g = data[i + 1]
//     const b = data[i + 2]
//     const gray = 0.2989 * r + 0.587 * g + 0.114 * b
//     data[i] = data[i + 1] = data[i + 2] = gray
//   }
//   return new ImageData(data, imageData.width, imageData.height)
// }

// // Convert to black and white
// const convertToBlackAndWhite = (imageData) => {
//   const data = new Uint8ClampedArray(imageData.data)
//   // First convert to grayscale
//   for (let i = 0; i < data.length; i += 4) {
//     const r = data[i]
//     const g = data[i + 1]
//     const b = data[i + 2]
//     const gray = 0.2989 * r + 0.587 * g + 0.114 * b
//     data[i] = data[i + 1] = data[i + 2] = gray
//   }

//   // Apply threshold
//   const threshold = 128
//   for (let i = 0; i < data.length; i += 4) {
//     const value = data[i] > threshold ? 255 : 0
//     data[i] = data[i + 1] = data[i + 2] = value
//   }

//   return new ImageData(data, imageData.width, imageData.height)
// }

// // Enhance contrast
// const enhanceContrast = (imageData) => {
//   const data = new Uint8ClampedArray(imageData.data)

//   // Find min and max values
//   let min = 255
//   let max = 0
//   for (let i = 0; i < data.length; i += 4) {
//     const r = data[i]
//     const g = data[i + 1]
//     const b = data[i + 2]
//     const gray = 0.2989 * r + 0.587 * g + 0.114 * b
//     min = Math.min(min, gray)
//     max = Math.max(max, gray)
//   }

//   // Apply contrast stretching
//   const range = max - min
//   if (range === 0) return imageData

//   for (let i = 0; i < data.length; i += 4) {
//     for (let j = 0; j < 3; j++) {
//       data[i + j] = (255 * (data[i + j] - min)) / range
//     }
//   }

//   return new ImageData(data, imageData.width, imageData.height)
// }

// // Enhanced image processing for document scanning
// const enhanceImage = (imageData) => {
//   const data = new Uint8ClampedArray(imageData.data)
//   const width = imageData.width
//   const height = imageData.height

//   // Convert to grayscale
//   for (let i = 0; i < data.length; i += 4) {
//     const r = data[i]
//     const g = data[i + 1]
//     const b = data[i + 2]
//     const gray = 0.2989 * r + 0.587 * g + 0.114 * b
//     data[i] = data[i + 1] = data[i + 2] = gray
//   }

//   // Apply adaptive thresholding
//   const blockSize = Math.max(3, Math.floor(Math.min(width, height) / 50)) * 2 + 1
//   const C = 10 // Constant subtracted from the mean

//   const result = new Uint8ClampedArray(data.length)
//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const idx = (y * width + x) * 4

//       // Calculate local mean
//       let sum = 0
//       let count = 0

//       const halfBlock = Math.floor(blockSize / 2)
//       for (let j = Math.max(0, y - halfBlock); j <= Math.min(height - 1, y + halfBlock); j++) {
//         for (let i = Math.max(0, x - halfBlock); i <= Math.min(width - 1, x + halfBlock); i++) {
//           sum += data[(j * width + i) * 4]
//           count++
//         }
//       }

//       const mean = sum / count
//       const threshold = mean - C

//       // Apply threshold
//       const value = data[idx] > threshold ? 255 : 0
//       result[idx] = result[idx + 1] = result[idx + 2] = value
//       result[idx + 3] = 255 // Alpha channel
//     }
//   }

//   return new ImageData(result, width, height)
// }

// // Enhanced color document processing
// const enhanceColorDocument = (imageData) => {
//   const data = new Uint8ClampedArray(imageData.data)
//   const width = imageData.width
//   const height = imageData.height

//   // Enhance saturation and contrast while preserving colors
//   for (let i = 0; i < data.length; i += 4) {
//     const r = data[i]
//     const g = data[i + 1]
//     const b = data[i + 2]

//     // Convert RGB to HSL
//     const [h, s, l] = rgbToHsl(r, g, b)

//     // Enhance saturation and lightness
//     const newS = Math.min(s * 1.2, 1.0) // Increase saturation by 20%
//     let newL = l

//     // Adjust lightness based on current value
//     if (l < 0.4) {
//       newL = l * 1.1 // Brighten dark areas
//     } else if (l > 0.7) {
//       newL = l * 0.95 // Slightly darken very bright areas
//     }

//     // Convert back to RGB
//     const [newR, newG, newB] = hslToRgb(h, newS, newL)

//     data[i] = newR
//     data[i + 1] = newG
//     data[i + 2] = newB
//   }

//   // Apply subtle sharpening
//   const result = applySharpening(data, width, height)

//   return new ImageData(result, width, height)
// }

// // Helper: RGB to HSL conversion
// const rgbToHsl = (r, g, b) => {
//   r /= 255
//   g /= 255
//   b /= 255

//   const max = Math.max(r, g, b)
//   const min = Math.min(r, g, b)
//   let h,
//     s,
//     l = (max + min) / 2

//   if (max === min) {
//     h = s = 0 // achromatic
//   } else {
//     const d = max - min
//     s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

//     switch (max) {
//       case r:
//         h = (g - b) / d + (g < b ? 6 : 0)
//         break
//       case g:
//         h = (b - r) / d + 2
//         break
//       case b:
//         h = (r - g) / d + 4
//         break
//     }

//     h /= 6
//   }

//   return [h, s, l]
// }

// // Helper: HSL to RGB conversion
// const hslToRgb = (h, s, l) => {
//   let r, g, b

//   if (s === 0) {
//     r = g = b = l // achromatic
//   } else {
//     const hue2rgb = (p, q, t) => {
//       if (t < 0) t += 1
//       if (t > 1) t -= 1
//       if (t < 1 / 6) return p + (q - p) * 6 * t
//       if (t < 1 / 2) return q
//       if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
//       return p
//     }

//     const q = l < 0.5 ? l * (1 + s) : l + s - l * s
//     const p = 2 * l - q

//     r = hue2rgb(p, q, h + 1 / 3)
//     g = hue2rgb(p, q, h)
//     b = hue2rgb(p, q, h - 1 / 3)
//   }

//   return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
// }

// // Helper: Apply sharpening filter
// const applySharpening = (data, width, height) => {
//   const result = new Uint8ClampedArray(data.length)

//   // Copy original data to result
//   for (let i = 0; i < data.length; i++) {
//     result[i] = data[i]
//   }

//   // Apply sharpening kernel
//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       const idx = (y * width + x) * 4

//       for (let c = 0; c < 3; c++) {
//         // For each color channel
//         const current = data[idx + c]
//         const top = data[((y - 1) * width + x) * 4 + c]
//         const bottom = data[((y + 1) * width + x) * 4 + c]
//         const left = data[(y * width + (x - 1)) * 4 + c]
//         const right = data[(y * width + (x + 1)) * 4 + c]

//         // Apply sharpening formula
//         const sharpened = 5 * current - top - bottom - left - right

//         // Clamp values
//         result[idx + c] = Math.min(255, Math.max(0, sharpened))
//       }
//     }
//   }

//   return result
// }

// // Detect if image is black-and-white
// const isBlackAndWhiteImage = (imageData) => {
//   const data = imageData.data
//   for (let i = 0; i < data.length; i += 4) {
//     const r = data[i]
//     const g = data[i + 1]
//     const b = data[i + 2]
//     if (Math.abs(r - g) > 20 || Math.abs(g - b) > 20 || Math.abs(b - r) > 20) {
//       return false
//     }
//   }
//   return true
// }

// // Document detection and cropping
// const detectAndCropDocument = async (imageData) => {
//   return new Promise((resolve) => {
//     if (!window.cv) {
//       console.warn("OpenCV not available, using improved edge detection")
//       // Use improved edge detection when OpenCV is not available
//       resolve(detectDocumentEdges(imageData))
//       return
//     }

//     try {
//       const img = new Image()
//       img.onload = () => {
//         try {
//           const canvas = document.createElement("canvas")
//           canvas.width = img.width
//           canvas.height = img.height
//           const ctx = canvas.getContext("2d")

//           if (!ctx) {
//             console.error("Failed to get canvas context")
//             resolve(imageData)
//             return
//           }

//           ctx.drawImage(img, 0, 0)
//           const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

//           const croppedImageData = findAndCropDocumentSimple(imgData)

//           if (croppedImageData) {
//             canvas.width = croppedImageData.width
//             canvas.height = croppedImageData.height
//             ctx.putImageData(croppedImageData, 0, 0)
//             resolve(canvas.toDataURL("image/jpeg", 0.95))
//           } else {
//             resolve(img.src)
//           }
//         } catch (error) {
//           console.error("Error processing image:", error)
//           resolve(img.src)
//         }
//       }
//       img.src = imageData
//     } catch (error) {
//       console.error("Error in detectAndCropDocument:", error)
//       resolve(imageData)
//     }
//   })
// }

// // Improved document edge detection without OpenCV
// const detectDocumentEdges = (imageData) => {
//   return new Promise((resolve) => {
//     const img = new Image()
//     img.onload = () => {
//       const canvas = document.createElement("canvas")
//       const ctx = canvas.getContext("2d")

//       canvas.width = img.width
//       canvas.height = img.height
//       ctx.drawImage(img, 0, 0)

//       const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
//       const { width, height, data } = imgData

//       // Convert to grayscale for edge detection
//       const grayscale = new Uint8ClampedArray(width * height)
//       for (let i = 0, j = 0; i < data.length; i += 4, j++) {
//         grayscale[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
//       }

//       // Apply Gaussian blur to reduce noise
//       const blurred = new Uint8ClampedArray(width * height)
//       const blurRadius = 2

//       for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//           let sum = 0
//           let count = 0

//           for (let dy = -blurRadius; dy <= blurRadius; dy++) {
//             for (let dx = -blurRadius; dx <= blurRadius; dx++) {
//               const nx = x + dx
//               const ny = y + dy

//               if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
//                 sum += grayscale[ny * width + nx]
//                 count++
//               }
//             }
//           }

//           blurred[y * width + x] = sum / count
//         }
//       }

//       // Apply Sobel operator for edge detection
//       const edges = new Uint8ClampedArray(width * height)
//       const threshold = 40 // Lower threshold to catch more edges

//       for (let y = 1; y < height - 1; y++) {
//         for (let x = 1; x < width - 1; x++) {
//           const idx = y * width + x

//           // Sobel kernels
//           const gx =
//             -1 * blurred[(y - 1) * width + (x - 1)] +
//             0 * blurred[(y - 1) * width + x] +
//             1 * blurred[(y - 1) * width + (x + 1)] +
//             -2 * blurred[y * width + (x - 1)] +
//             0 * blurred[y * width + x] +
//             2 * blurred[y * width + (x + 1)] +
//             -1 * blurred[(y + 1) * width + (x - 1)] +
//             0 * blurred[(y + 1) * width + x] +
//             1 * blurred[(y + 1) * width + (x + 1)]

//           const gy =
//             -1 * blurred[(y - 1) * width + (x - 1)] +
//             -2 * blurred[(y - 1) * width + x] +
//             -1 * blurred[(y - 1) * width + (x + 1)] +
//             0 * blurred[y * width + (x - 1)] +
//             0 * blurred[y * width + x] +
//             0 * blurred[y * width + (x + 1)] +
//             1 * blurred[(y + 1) * width + (x - 1)] +
//             2 * blurred[(y + 1) * width + x] +
//             1 * blurred[(y + 1) * width + (x + 1)]

//           // Gradient magnitude
//           const magnitude = Math.sqrt(gx * gx + gy * gy)

//           // Thresholding
//           edges[idx] = magnitude > threshold ? 255 : 0
//         }
//       }

//       // Find document boundaries using contour detection
//       // First, find connected components (potential document edges)
//       const visited = new Set()
//       const contours = []

//       for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//           const idx = y * width + x

//           if (edges[idx] > 0 && !visited.has(idx)) {
//             // Start of a new contour
//             const contour = []
//             const stack = [{ x, y }]
//             visited.add(idx)

//             while (stack.length > 0) {
//               const { x: cx, y: cy } = stack.pop()
//               contour.push({ x: cx, y: cy })

//               // Check 8 neighbors
//               for (let dy = -1; dy <= 1; dy++) {
//                 for (let dx = -1; dx <= 1; dx++) {
//                   if (dx === 0 && dy === 0) continue

//                   const nx = cx + dx
//                   const ny = cy + dy

//                   if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
//                     const nidx = ny * width + nx
//                     if (edges[nidx] > 0 && !visited.has(nidx)) {
//                       stack.push({ x: nx, y: ny })
//                       visited.add(nidx)
//                     }
//                   }
//                 }
//               }
//             }

//             // Only keep contours with enough points (to filter out noise)
//             if (contour.length > 100) {
//               contours.push(contour)
//             }
//           }
//         }
//       }

//       // If we found contours, find the largest one that could be a document
//       if (contours.length > 0) {
//         // Sort contours by size (descending)
//         contours.sort((a, b) => b.length - a.length)

//         // Take the largest contour and find its bounding box
//         const largestContour = contours[0]
//         let minX = width,
//           minY = height,
//           maxX = 0,
//           maxY = 0

//         for (const { x, y } of largestContour) {
//           minX = Math.min(minX, x)
//           minY = Math.min(minY, y)
//           maxX = Math.max(maxX, x)
//           maxY = Math.max(maxY, y)
//         }

//         // Check if the bounding box is a reasonable size for a document
//         if (maxX - minX > width * 0.2 && maxY - minY > height * 0.2) {
//           // Add some padding
//           const padding = Math.max(10, Math.min(width, height) * 0.02)
//           minX = Math.max(0, minX - padding)
//           minY = Math.max(0, minY - padding)
//           maxX = Math.min(width, maxX + padding)
//           maxY = Math.min(height, maxY + padding)

//           // Attempt to find the four corners of the document for perspective correction
//           const corners = findDocumentCorners(largestContour, minX, minY, maxX, maxY)

//           if (corners && corners.length === 4) {
//             // Apply perspective correction
//             const correctedImage = applyPerspectiveCorrection(img, corners, maxX - minX, maxY - minY)
//             resolve(correctedImage)
//             return
//           }

//           // If corner detection fails, just crop to the bounding box
//           const croppedCanvas = document.createElement("canvas")
//           const croppedCtx = croppedCanvas.getContext("2d")

//           const cropWidth = maxX - minX
//           const cropHeight = maxY - minY

//           croppedCanvas.width = cropWidth
//           croppedCanvas.height = cropHeight

//           croppedCtx.drawImage(img, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

//           resolve(croppedCanvas.toDataURL("image/jpeg", 0.95))
//           return
//         }
//       }

//       // If no suitable document contour was found, return the original
//       resolve(imageData)
//     }

//     img.src = imageData
//   })
// }

// // Helper function for finding document corners
// const findDocumentCorners = (contour, minX, minY, maxX, maxY) => {
//   // This is a simplified corner detection algorithm
//   // For production, you might want a more sophisticated algorithm

//   // First, reduce the contour to key points
//   const step = Math.max(1, Math.floor(contour.length / 100))
//   const reducedContour = []

//   for (let i = 0; i < contour.length; i += step) {
//     reducedContour.push(contour[i])
//   }

//   // Find points closest to the four corners of the bounding box
//   const corners = [
//     { x: minX, y: minY }, // top-left
//     { x: maxX, y: minY }, // top-right
//     { x: maxX, y: maxY }, // bottom-right
//     { x: minX, y: maxY }, // bottom-left
//   ]

//   const result = []

//   for (const corner of corners) {
//     let minDistance = Number.MAX_VALUE
//     let closestPoint = null

//     for (const point of reducedContour) {
//       const distance = Math.sqrt(Math.pow(point.x - corner.x, 2) + Math.pow(point.y - corner.y, 2))

//       if (distance < minDistance) {
//         minDistance = distance
//         closestPoint = point
//       }
//     }

//     if (closestPoint) {
//       result.push(closestPoint)
//     } else {
//       return null // Failed to find all corners
//     }
//   }

//   return result
// }

// // Helper function for perspective correction
// const applyPerspectiveCorrection = (img, corners, width, height) => {
//   const canvas = document.createElement("canvas")
//   const ctx = canvas.getContext("2d")

//   canvas.width = width
//   canvas.height = height

//   // Sort corners: top-left, top-right, bottom-right, bottom-left
//   corners.sort((a, b) => {
//     // Sort by y first (top to bottom)
//     if (Math.abs(a.y - b.y) > 10) {
//       return a.y - b.y
//     }
//     // If y is similar, sort by x (left to right)
//     return a.x - b.x
//   })

//   // Now we have corners sorted by y, but we need to sort the first two and last two by x
//   const top = corners.slice(0, 2).sort((a, b) => a.x - b.x)
//   const bottom = corners.slice(2, 4).sort((a, b) => a.x - b.x)

//   const sortedCorners = [
//     top[0], // top-left
//     top[1], // top-right
//     bottom[1], // bottom-right
//     bottom[0], // bottom-left
//   ]

//   // Draw complex polygon clipping path
//   ctx.beginPath()
//   ctx.moveTo(0, 0)
//   ctx.lineTo(width, 0)
//   ctx.lineTo(width, height)
//   ctx.lineTo(0, height)
//   ctx.closePath()

//   // Calculate transformation matrix (simplified perspective transform)
//   // This is a basic implementation - a full perspective transform would use matrix operations

//   try {
//     // Draw the original image with the transformation
//     ctx.save()

//     // Map source points to destination rectangle
//     const dx1 = 0,
//       dy1 = 0
//     const dx2 = width,
//       dy2 = 0
//     const dx3 = width,
//       dy3 = height
//     const dx4 = 0,
//       dy4 = height

//     const sx1 = sortedCorners[0].x,
//       sy1 = sortedCorners[0].y
//     const sx2 = sortedCorners[1].x,
//       sy2 = sortedCorners[1].y
//     const sx3 = sortedCorners[2].x,
//       sy3 = sortedCorners[2].y
//     const sx4 = sortedCorners[3].x,
//       sy4 = sortedCorners[3].y

//     // Draw the image section
//     ctx.drawImage(
//       img,
//       Math.min(sx1, sx2, sx3, sx4),
//       Math.min(sy1, sy2, sy3, sy4),
//       Math.max(sx1, sx2, sx3, sx4) - Math.min(sx1, sx2, sx3, sx4),
//       Math.max(sy1, sy2, sy3, sy4) - Math.min(sy1, sy2, sy3, sy4),
//       0,
//       0,
//       width,
//       height,
//     )

//     ctx.restore()

//     return canvas.toDataURL("image/jpeg", 0.95)
//   } catch (e) {
//     console.error("Error applying perspective correction:", e)

//     // Fallback to simple crop if perspective transform fails
//     ctx.drawImage(
//       img,
//       Math.min(corners[0].x, corners[1].x, corners[2].x, corners[3].x),
//       Math.min(corners[0].y, corners[1].y, corners[2].y, corners[3].y),
//       width,
//       height,
//       0,
//       0,
//       width,
//       height,
//     )

//     return canvas.toDataURL("image/jpeg", 0.95)
//   }
// }

// // Simplified document detection with OpenCV
// const findAndCropDocumentSimple = (imageData) => {
//   if (!window.cv) {
//     console.error("OpenCV is not loaded yet")
//     return null
//   }

//   try {
//     const cv = window.cv
//     const src = cv.matFromImageData(imageData)
//     const gray = new cv.Mat()
//     cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)

//     const blurred = new cv.Mat()
//     const ksize = new cv.Size(5, 5)
//     cv.GaussianBlur(gray, blurred, ksize, 0)

//     const edges = new cv.Mat()
//     cv.Canny(blurred, edges, 75, 200)

//     const contours = new cv.MatVector()
//     const hierarchy = new cv.Mat()
//     cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

//     let maxArea = 0
//     let maxContourIndex = -1

//     for (let i = 0; i < contours.size(); i++) {
//       const contour = contours.get(i)
//       const area = cv.contourArea(contour)
//       if (area > maxArea) {
//         maxArea = area
//         maxContourIndex = i
//       }
//     }

//     if (maxContourIndex === -1 || maxArea < src.rows * src.cols * 0.1) {
//       src.delete()
//       gray.delete()
//       blurred.delete()
//       edges.delete()
//       contours.delete()
//       hierarchy.delete()
//       return null
//     }

//     const maxContour = contours.get(maxContourIndex)
//     const epsilon = 0.02 * cv.arcLength(maxContour, true)
//     const approx = new cv.Mat()
//     cv.approxPolyDP(maxContour, approx, epsilon, true)

//     if (approx.rows === 4) {
//       const points = []
//       for (let i = 0; i < 4; i++) {
//         points.push({ x: approx.data32S[i * 2], y: approx.data32S[i * 2 + 1] })
//       }

//       points.sort((a, b) => a.y - b.y)
//       const topPoints = points.slice(0, 2).sort((a, b) => a.x - b.x)
//       const bottomPoints = points.slice(2, 4).sort((a, b) => a.x - b.x)
//       points[0] = topPoints[0]
//       points[1] = topPoints[1]
//       points[2] = bottomPoints[1]
//       points[3] = bottomPoints[0]

//       const width = Math.max(
//         Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y),
//         Math.hypot(points[3].x - points[2].x, points[3].y - points[2].y),
//       )
//       const height = Math.max(
//         Math.hypot(points[3].x - points[0].x, points[3].y - points[0].y),
//         Math.hypot(points[2].x - points[1].x, points[2].y - points[1].y),
//       )

//       const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
//         points[0].x,
//         points[0].y,
//         points[1].x,
//         points[1].y,
//         points[2].x,
//         points[2].y,
//         points[3].x,
//         points[3].y,
//       ])
//       const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width - 1, 0, width - 1, height - 1, 0, height - 1])

//       const M = cv.getPerspectiveTransform(srcTri, dstTri)
//       const warpedImage = new cv.Mat()
//       cv.warpPerspective(src, warpedImage, M, new cv.Size(width, height))

//       const result = new cv.Mat()
//       cv.cvtColor(warpedImage, result, cv.COLOR_BGR2RGBA)

//       const croppedImageData = new ImageData(new Uint8ClampedArray(result.data), result.cols, result.rows)

//       src.delete()
//       gray.delete()
//       blurred.delete()
//       edges.delete()
//       contours.delete()
//       hierarchy.delete()
//       approx.delete()
//       srcTri.delete()
//       dstTri.delete()
//       M.delete()
//       warpedImage.delete()
//       result.delete()

//       return croppedImageData
//     }

//     src.delete()
//     gray.delete()
//     blurred.delete()
//     edges.delete()
//     contours.delete()
//     hierarchy.delete()
//     approx.delete()

//     return null
//   } catch (error) {
//     console.error("Error in findAndCropDocumentSimple:", error)
//     return null
//   }
// }

// // Apply crop to image
// const applyCrop = (image, crop) => {
//   return new Promise((resolve) => {
//     const img = new Image()
//     img.onload = () => {
//       const canvas = document.createElement("canvas")
//       const ctx = canvas.getContext("2d")

//       if (!ctx) {
//         console.error("Failed to get canvas context")
//         resolve(image)
//         return
//       }

//       // Calculate actual pixel values
//       const scaleX = img.naturalWidth / img.width
//       const scaleY = img.naturalHeight / img.height

//       const pixelCrop = {
//         x: crop.x * scaleX,
//         y: crop.y * scaleY,
//         width: crop.width * scaleX,
//         height: crop.height * scaleY,
//       }

//       canvas.width = pixelCrop.width
//       canvas.height = pixelCrop.height

//       ctx.drawImage(
//         img,
//         pixelCrop.x,
//         pixelCrop.y,
//         pixelCrop.width,
//         pixelCrop.height,
//         0,
//         0,
//         pixelCrop.width,
//         pixelCrop.height,
//       )

//       resolve(canvas.toDataURL("image/jpeg", 0.95))
//     }
//     img.src = image
//   })
// }

// // Function to determine the best filter for a document automatically
// const determineBestFilter = async (imageData) => {
//   return new Promise((resolve) => {
//     const img = new Image()
//     img.onload = () => {
//       const canvas = document.createElement("canvas")
//       canvas.width = img.width
//       canvas.height = img.height
//       const ctx = canvas.getContext("2d")

//       ctx.drawImage(img, 0, 0)
//       const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
//       const { data, width, height } = imgData

//       // Calculate image characteristics
//       let brightness = 0
//       let contrast = 0
//       let darknessCount = 0
//       let colorCount = 0

//       // Sample pixels for analysis (skip some for performance)
//       const sampleStep = 4 // Sample every 4th pixel
//       const samples = []

//       for (let i = 0; i < data.length; i += 4 * sampleStep) {
//         const r = data[i]
//         const g = data[i + 1]
//         const b = data[i + 2]

//         samples.push({ r, g, b })

//         // Calculate brightness (0-255)
//         const pixelBrightness = 0.299 * r + 0.587 * g + 0.114 * b
//         brightness += pixelBrightness

//         // Count dark pixels
//         if (pixelBrightness < 50) darknessCount++

//         // Check if pixel has significant color
//         if (Math.abs(r - g) > 20 || Math.abs(g - b) > 20 || Math.abs(r - b) > 20) {
//           colorCount++
//         }
//       }

//       const totalSamples = samples.length
//       brightness /= totalSamples

//       // Calculate variance (for contrast)
//       let variance = 0
//       for (const { r, g, b } of samples) {
//         const pixelBrightness = 0.299 * r + 0.587 * g + 0.114 * b
//         variance += Math.pow(pixelBrightness - brightness, 2)
//       }
//       contrast = Math.sqrt(variance / totalSamples)

//       // Normalize metrics
//       const darkRatio = darknessCount / totalSamples
//       const colorRatio = colorCount / totalSamples
//       const isLowContrast = contrast < 40
//       const isDark = brightness < 100
//       const isColorful = colorRatio > 0.3

//       console.log(
//         `Image analysis - Brightness: ${brightness.toFixed(2)}, Contrast: ${contrast.toFixed(2)}, Color ratio: ${colorRatio.toFixed(2)}`,
//       )

//       // Decision tree for best filter
//       if (isColorful) {
//         if (isDark) {
//           resolve("color-enhance") // Dark colored document
//         } else if (isLowContrast) {
//           resolve("high-contrast") // Low contrast colored document
//         } else {
//           resolve("color-enhance") // Normal colored document
//         }
//       } else {
//         // Black and white or grayscale document
//         if (isDark) {
//           resolve("enhanced") // Dark document, needs enhancement
//         } else if (isLowContrast) {
//           resolve("high-contrast") // Low contrast document
//         } else {
//           resolve("bw") // Already clear black and white document
//         }
//       }
//     }

//     img.onerror = () => {
//       console.error("Error analyzing image")
//       resolve("enhanced") // Default to enhanced filter
//     }

//     img.src = imageData
//   })
// }

// const ScanUpload = ({ fileData, action, onClose }) => {
//   const [type, setType] = useState(fileData?.type || "")
//   const [file, setFile] = useState(fileData?.file || null)
//   const [fileName, setFileName] = useState(fileData?.file?.name || "")
//   const [departments, setDepartments] = useState([])
//   const [selectedDepartment, setSelectedDepartment] = useState(fileData?.department || "")
//   const [categories, setCategories] = useState([])
//   const [selectedCategory, setSelectedCategory] = useState(fileData?.category || "")
//   const [subject, setSubject] = useState(fileData?.subject || "")
//   const [date, setDate] = useState(fileData?.date || new Date().toISOString().split("T")[0])
//   const [diaryNo, setDiaryNo] = useState(fileData?.diaryNo || "")
//   const [from, setFrom] = useState(fileData?.from || "")
//   const [disposal, setDisposal] = useState(fileData?.disposal || "")
//   const [status, setStatus] = useState(fileData?.status || "")
//   const [isScanning, setIsScanning] = useState(false)
//   const [capturedImage, setCapturedImage] = useState(null)
//   const [processedImage, setProcessedImage] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const webcamRef = useRef(null)
//   const [isFullScreenScanning, setIsFullScreenScanning] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [isOpenCVLoaded, setIsOpenCVLoaded] = useState(false)
//   const [zoomLevel, setZoomLevel] = useState(1)
//   const [cameraFacingMode, setCameraFacingMode] = useState("environment")
//   const [isFocusing, setIsFocusing] = useState(false)
//   const videoRef = useRef(null)
//   const [hasCameraPermission, setHasCameraPermission] = useState(null)
//   const [isCropping, setIsCropping] = useState(false)
//   const [crop, setCrop] = useState({ unit: "%", width: 80, height: 80, x: 10, y: 10 })
//   const [completedCrop, setCompletedCrop] = useState(null)
//   const [currentFilter, setCurrentFilter] = useState("enhanced")
//   const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
//   const [isApproved, setIsApproved] = useState(false)
//   const [extractedText, setExtractedText] = useState("")
//   const [showRealTimePreview, setShowRealTimePreview] = useState(false)
//   const [previewFilter, setPreviewFilter] = useState("original")
//   const [autoFilterApplied, setAutoFilterApplied] = useState(false)
//   const [imageRotation, setImageRotation] = useState(0)

//   const requestCameraAccess = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true })
//       stream.getTracks().forEach((track) => track.stop()) // Stop the stream immediately
//       setHasCameraPermission(true)
//       console.log("Camera access granted")
//     } catch (error) {
//       console.error("Camera access denied", error)
//       setHasCameraPermission(false)
//       alert("Camera access is required for scanning. Please allow camera access and try again.")
//     }
//   }

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await fetch(`/api/department?type=${type}`, { method: "GET" })
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }
//         const data = await response.json()
//         setDepartments(data)
//       } catch (error) {
//         console.error("Failed to fetch departments", error)
//         // Don't show alert to user, just log the error
//       }
//     }

//     if (type) {
//       fetchDepartments()
//     }
//   }, [type])

//   useEffect(() => {
//     if (selectedDepartment) {
//       const department = departments.find((dept) => dept._id === selectedDepartment)
//       setCategories(department?.categories || [])
//     }
//   }, [selectedDepartment, departments])

//   const handleDepartmentChange = (e) => {
//     const departmentId = e.target.value
//     setSelectedDepartment(departmentId)
//     setSelectedCategory("")
//   }

//   // Enhanced capture function with automatic processing
//   const handleCapture = async () => {
//     console.log("handleCapture function called")
//     if (webcamRef.current) {
//       setIsProcessing(true)
//       try {
//         console.log("Attempting to capture image")
//         const imageSrc = webcamRef.current.getScreenshot()

//         if (!imageSrc) {
//           throw new Error("Failed to capture image from camera")
//         }

//         console.log("Image captured, beginning automatic processing")
//         setCapturedImage(imageSrc)

//         // Step 1: Detect and crop document boundaries
//         console.log("Detecting document boundaries")
//         let processedImage = imageSrc
//         try {
//           const croppedImage = await detectAndCropDocument(imageSrc)
//           if (croppedImage) {
//             processedImage = croppedImage
//             console.log("Document detection and cropping successful")
//           } else {
//             console.log("Document detection failed, using original image")
//           }
//         } catch (cropError) {
//           console.error("Error in document detection:", cropError)
//         }

//         // Step 2: Automatically apply the best filter based on document analysis
//         console.log("Applying automatic enhancement")
//         try {
//           const bestFilter = await determineBestFilter(processedImage)
//           const enhancedImage = await preprocessImageForOCR(processedImage, bestFilter)
//           setProcessedImage(enhancedImage)
//           setCurrentFilter(bestFilter)
//           setAutoFilterApplied(true)
//           console.log(`Auto-applied "${bestFilter}" filter`)
//         } catch (filterError) {
//           console.error("Error applying auto filter:", filterError)
//           setProcessedImage(processedImage)
//         }

//         setIsScanning(false)
//         setIsFullScreenScanning(false)
//         setShowRealTimePreview(true)
//         console.log("Camera view closed")

//         // Step 3: Run OCR in the background without showing the text
//         console.log("Starting background OCR")
//         try {
//           await performEnhancedOCR(processedImage)
//           console.log("OCR completed")
//         } catch (ocrError) {
//           console.error("Error in OCR:", ocrError)
//         }
//       } catch (error) {
//         console.error("Error processing captured image:", error)
//       } finally {
//         setIsProcessing(false)
//         console.log("Processing completed")
//       }
//     } else {
//       console.error("Webcam reference is null")
//     }
//   }

//   const performEnhancedOCR = async (imageData) => {
//     setIsProcessing(true)
//     try {
//       // Apply enhanced filter for OCR if not already applied
//       const ocrImage = currentFilter === "enhanced" ? imageData : await preprocessImageForOCR(imageData, "enhanced")

//       const { data } = await Tesseract.recognize(ocrImage, "eng", {
//         tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY,
//         tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
//         tessedit_char_whitelist:
//           "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:!?()[]{}+-*/=<>@#$%^&|~`' ",
//         preserve_interword_spaces: "1",
//       })

//       const extractedText = data.text
//       console.log("OCR Extracted Text:", extractedText)
//       setExtractedText(extractedText)

//       const subject = findSubjectInText(extractedText)
//       if (subject) {
//         setSubject(subject)
//         setFileName(subject) // Set fileName to subject for scanned images
//       } else {
//         console.warn("No subject found in OCR text")
//         // Try to extract a meaningful title from the text
//         const potentialTitle = extractPotentialTitle(extractedText)
//         if (potentialTitle) {
//           setSubject(potentialTitle)
//           setFileName(potentialTitle)
//         }
//       }
//     } catch (error) {
//       console.error("OCR Error:", error)
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   // Extract potential title from text
//   const extractPotentialTitle = (text) => {
//     // Split text into lines and find the first non-empty line
//     const lines = text
//       .split(/\n|\r/)
//       .map((line) => line.trim())
//       .filter((line) => line.length > 0)

//     if (lines.length > 0) {
//       // Use the first line if it's not too long (likely a title)
//       if (lines[0].length < 100) {
//         return lines[0]
//       }

//       // Otherwise look for the first sentence
//       const firstSentence = text.match(/^[^.!?]+[.!?]/)
//       if (firstSentence && firstSentence[0].length < 100) {
//         return firstSentence[0].trim()
//       }
//     }

//     return null
//   }

//   // Improved subject extraction
//   const findSubjectInText = (text) => {
//     // Try multiple patterns to find subject
//     const subjectPatterns = [
//       /subject\s*:\s*(.*?)(?:\n|\r|$|\s{2,}|\.|!|\?)/i,
//       /re\s*:\s*(.*?)(?:\n|\r|$|\s{2,}|\.|!|\?)/i,
//       /title\s*:\s*(.*?)(?:\n|\r|$|\s{2,}|\.|!|\?)/i,
//       /regarding\s*:\s*(.*?)(?:\n|\r|$|\s{2,}|\.|!|\?)/i,
//       /topic\s*:\s*(.*?)(?:\n|\r|$|\s{2,}|\.|!|\?)/i,
//     ]

//     for (const pattern of subjectPatterns) {
//       const match = text.match(pattern)
//       if (match && match[1] && match[1].trim().length > 0) {
//         return match[1].trim()
//       }
//     }

//     return null
//   }

//   const handleScanStart = async () => {
//     // Check if we already have camera permission
//     if (hasCameraPermission === null) {
//       try {
//         await requestCameraAccess()
//         setIsScanning(true)
//         setIsFullScreenScanning(true)
//         setCapturedImage(null)
//         setProcessedImage(null)
//         setIsApproved(false)
//         setShowRealTimePreview(false)
//         setAutoFilterApplied(false)
//         setImageRotation(0)
//       } catch (error) {
//         console.error("Error requesting camera access:", error)
//       }
//     } else if (hasCameraPermission === true) {
//       setIsScanning(true)
//       setIsFullScreenScanning(true)
//       setCapturedImage(null)
//       setProcessedImage(null)
//       setIsApproved(false)
//       setShowRealTimePreview(false)
//       setAutoFilterApplied(false)
//       setImageRotation(0)
//     } else {
//       // We've been denied permission before
//       alert(
//         "Camera access is required for scanning. Please allow camera access in your browser settings and try again.",
//       )
//     }
//   }

//   const handleFocus = useCallback(
//     async (event) => {
//       if (videoRef.current && "mediaDevices" in navigator) {
//         setIsFocusing(true)
//         const { offsetX, offsetY } = event.nativeEvent
//         const { videoWidth, videoHeight } = videoRef.current

//         const focusX = offsetX / videoRef.current.offsetWidth
//         const focusY = offsetY / videoRef.current.offsetHeight

//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacingMode } })
//           const track = stream.getVideoTracks()[0]

//           if (track.getCapabilities && "focusMode" in track.getCapabilities()) {
//             await track.applyConstraints({ advanced: [{ focusMode: "manual" }] })

//             if ("focusDistance" in track.getCapabilities()) {
//               await track.applyConstraints({
//                 advanced: [
//                   {
//                     focusMode: "manual",
//                     focusDistance: Math.sqrt(Math.pow(focusX - 0.5, 2) + Math.pow(focusY - 0.5, 2)),
//                   },
//                 ],
//               })
//             }
//           }
//         } catch (error) {
//           console.error("Error setting focus:", error)
//         } finally {
//           setIsFocusing(false)
//         }
//       }
//     },
//     [cameraFacingMode],
//   )

//   const handleFileChange = useCallback(async (file) => {
//     setIsProcessing(true)

//     if (!file) {
//       setIsProcessing(false)
//       return
//     }

//     setFile(file)
//     setFileName(file.name)

//     try {
//       if (file.type === "application/pdf") {
//         const fileBuffer = await file.arrayBuffer()
//         const text = await extractTextFromPdf(fileBuffer)
//         setExtractedText(text)

//         const subject = findSubjectInText(text)
//         if (subject) {
//           setSubject(subject)
//         } else {
//           const potentialTitle = extractPotentialTitle(text)
//           if (potentialTitle) {
//             setSubject(potentialTitle)
//           } else {
//             console.warn("No subject found in the uploaded file")
//           }
//         }
//       } else if (file.type.startsWith("image/")) {
//         // Handle image files
//         const reader = new FileReader()
//         reader.onload = async (e) => {
//           const imageData = e.target?.result
//           setCapturedImage(imageData)

//           // Process the image automatically
//           try {
//             // Step 1: Detect and crop document
//             const croppedImage = await detectAndCropDocument(imageData)
//             const processedImg = croppedImage || imageData

//             // Step 2: Determine and apply best filter
//             const bestFilter = await determineBestFilter(processedImg)
//             const enhancedImage = await preprocessImageForOCR(processedImg, bestFilter)

//             setProcessedImage(enhancedImage)
//             setCurrentFilter(bestFilter)
//             setAutoFilterApplied(true)
//             setShowRealTimePreview(true)

//             // Step 3: Run OCR
//             await performEnhancedOCR(enhancedImage)
//           } catch (processError) {
//             console.error("Error processing image:", processError)
//             setProcessedImage(imageData)

//             try {
//               await performEnhancedOCR(imageData)
//             } catch (ocrError) {
//               console.error("Error in OCR:", ocrError)
//             }
//           }
//         }
//         reader.readAsDataURL(file)
//       } else {
//         console.warn("Unsupported file type")
//       }
//     } catch (error) {
//       console.error("Error processing file:", error)
//     } finally {
//       setIsProcessing(false)
//     }
//   }, [])

//   const onDrop = useCallback(
//     (acceptedFiles) => {
//       console.log("Files dropped:", acceptedFiles)
//       const file = acceptedFiles[0]
//       if (file) {
//         handleFileChange(file)
//       }
//     },
//     [handleFileChange],
//   )

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "application/pdf": [".pdf"],
//       "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
//     },
//     onDragEnter: () => console.log("Drag entered"),
//     onDragLeave: () => console.log("Drag left"),
//   })

//   async function extractTextFromPdf(fileBuffer) {
//     try {
//       const loadingTask = pdfjsLib.getDocument(fileBuffer)
//       const pdf = await loadingTask.promise

//       let textContent = ""
//       for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
//         const page = await pdf.getPage(pageIndex)
//         const text = await page.getTextContent()
//         textContent += text.items.map((item) => item.str).join(" ")
//       }

//       return textContent
//     } catch (error) {
//       console.error("Error extracting text from PDF:", error)
//       return ""
//     }
//   }

//   const convertImageToPdf = async (imageData) => {
//     return new Promise((resolve) => {
//       const img = new Image()
//       img.onload = () => {
//         const pdf = new jsPDF({
//           orientation: img.width > img.height ? "l" : "p",
//           unit: "px",
//           format: [img.width, img.height],
//         })
//         pdf.addImage(imageData, "JPEG", 0, 0, img.width, img.height)
//         resolve(pdf.output("blob"))
//       }
//       img.src = imageData
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     if ((!file && !processedImage) || !selectedDepartment || !subject || !diaryNo || !from || !disposal || !status) {
//       alert("Please fill out all fields and either upload a file or capture an image.")
//       setIsLoading(false)
//       return
//     }

//     const formData = new FormData()

//     if (file) {
//       formData.append("file", file)
//       formData.append("fileName", fileName || subject) // Use subject as fallback
//     } else if (processedImage) {
//       const pdfBlob = await convertImageToPdf(processedImage)
//       const finalFileName = fileName || subject || "captured_image" // Use subject if available
//       formData.append("file", pdfBlob, `${finalFileName}.pdf`)
//       formData.append("fileName", finalFileName)
//     }

//     formData.append("type", type)
//     formData.append("department", selectedDepartment)
//     formData.append("category", selectedCategory)
//     formData.append("subject", subject)
//     formData.append("date", date)
//     formData.append("diaryNo", diaryNo)
//     formData.append("from", from)
//     formData.append("disposal", disposal)
//     formData.append("status", status)

//     const method = fileData ? "PUT" : "POST"
//     const url = fileData ? `/api/scanupload/${fileData._id}` : "/api/scanupload"

//     try {
//       const response = await fetch(url, { method, body: formData })
//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       alert(data.message)
//       onClose()
//     } catch (error) {
//       console.error("Upload error:", error)
//       alert(`An error occurred during upload: ${error.message}`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     const loadOpenCV = () => {
//       if (window.cv) {
//         console.log("OpenCV.js already loaded")
//         setIsOpenCVLoaded(true)
//         return
//       }

//       window.onOpenCVReady = () => {
//         console.log("OpenCV.js initialized")
//         setIsOpenCVLoaded(true)
//       }

//       const script = document.createElement("script")
//       script.src = "https://docs.opencv.org/4.5.5/opencv.js"
//       script.async = true
//       script.onload = () => console.log("OpenCV.js script loaded")
//       script.onerror = (err) => console.error("Error loading OpenCV.js", err)
//       document.body.appendChild(script)

//       return () => {
//         if (script && script.parentNode) {
//           document.body.removeChild(script)
//         }
//         delete window.onOpenCVReady
//       }
//     }

//     loadOpenCV()
//   }, [])

//   const increaseZoom = () => {
//     setZoomLevel((prev) => Math.min(prev + 0.25, 3))
//   }

//   const decreaseZoom = () => {
//     setZoomLevel((prev) => Math.max(prev - 0.25, 1))
//   }

//   const handleCloseCamera = () => {
//     setIsScanning(false)
//     setIsFullScreenScanning(false)
//     setCapturedImage(null)
//     setProcessedImage(null)
//     setShowRealTimePreview(false)
//   }

//   const startCropping = () => {
//     setIsCropping(true)
//   }

//   const cancelCropping = () => {
//     setIsCropping(false)
//   }

//   const confirmCrop = async () => {
//     if (completedCrop && processedImage) {
//       try {
//         const croppedImage = await applyCrop(processedImage, completedCrop)
//         setProcessedImage(croppedImage)
//         setIsCropping(false)

//         // Run OCR on the cropped image
//         await performEnhancedOCR(croppedImage)
//       } catch (error) {
//         console.error("Error applying crop:", error)
//       }
//     }
//   }

//   const applyFilter = async (filterType) => {
//     if (processedImage) {
//       setIsProcessing(true)
//       try {
//         const filteredImage = await preprocessImageForOCR(processedImage, filterType)
//         setProcessedImage(filteredImage)
//         setCurrentFilter(filterType)
//         setIsFilterMenuOpen(false)
//         setAutoFilterApplied(false)

//         // Run OCR on the filtered image
//         await performEnhancedOCR(filteredImage)
//       } catch (error) {
//         console.error("Error applying filter:", error)
//       } finally {
//         setIsProcessing(false)
//       }
//     }
//   }

//   const toggleFilterMenu = () => {
//     setIsFilterMenuOpen(!isFilterMenuOpen)
//   }

//   // Preview filter in real-time
//   // const previewFilterChange = async (filterType) => {
//   //   if (capturedImage) {
//   //     setPreviewFilter(filterType)
//   //     const previewImage = await preprocessImageForOCR(capturedImage, filterType)
//   //     setProcessedImage(previewImage)
//   //   }
//   // }

//   // Approve document
//   const approveDocument = () => {
//     setIsApproved(true)
//     // Final processing with the selected filter
//     applyFilter(currentFilter)
//   }

//   // Toggle camera facing mode
//   const toggleCameraFacing = () => {
//     setCameraFacingMode((prev) => (prev === "environment" ? "user" : "environment"))
//   }

//   // Helper function to rotate image
//   const rotateImageData = (imageData, degrees) => {
//     return new Promise((resolve) => {
//       const img = new Image()
//       img.onload = () => {
//         const canvas = document.createElement("canvas")
//         const ctx = canvas.getContext("2d")

//         // Set proper canvas dimensions for the rotation
//         if (degrees === 90 || degrees === 270) {
//           canvas.width = img.height
//           canvas.height = img.width
//         } else {
//           canvas.width = img.width
//           canvas.height = img.height
//         }

//         // Translate and rotate
//         ctx.translate(canvas.width / 2, canvas.height / 2)
//         ctx.rotate((degrees * Math.PI) / 180)

//         // Draw the image
//         if (degrees === 90 || degrees === 270) {
//           ctx.drawImage(img, -img.height / 2, -img.width / 2)
//         } else {
//           ctx.drawImage(img, -img.width / 2, -img.height / 2)
//         }

//         resolve(canvas.toDataURL("image/jpeg", 0.95))
//       }
//       img.src = imageData
//     })
//   }

//   return (
//     <div className={`${isFullScreenScanning ? "fixed inset-0 z-50" : "bg-zinc-800 p-10 "}`}>
//       <div
//         className={`${
//           isFullScreenScanning
//             ? "h-full max-h-full"
//             : "bg-white p-6 rounded-lg max-w-4xl mx-auto overflow-y-auto xl:max-h-[710px] max-h-[860px]"
//         }`}
//       >
//         {!isFullScreenScanning ? <h2 className="text-3xl text-center font-semibold mb-6">{action} Form</h2> : null}
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           {!isFullScreenScanning ? (
//             <>
//               <div className="flex flex-col gap-2 w-full">
//                 <label className="font-medium">Type</label>
//                 <select
//                   value={type}
//                   onChange={(e) => setType(e.target.value)}
//                   className="p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="">Select Type</option>
//                   <option value="uni">University</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//               <div className="flex flex-col sm:flex-row sm:gap-4">
//                 <div className="flex flex-col gap-2 w-full">
//                   <label className="font-medium">Department</label>
//                   <select
//                     value={selectedDepartment}
//                     onChange={handleDepartmentChange}
//                     required
//                     className="p-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="">Select Department</option>
//                     {departments.map((dept) => (
//                       <option key={dept._id} value={dept._id}>
//                         {dept.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex flex-col gap-2 w-full">
//                   <label className="font-medium">Category</label>
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="p-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((cat, index) => (
//                       <option key={index} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2 w-full">
//                 <label className="font-medium">Subject</label>
//                 <input
//                   type="text"
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                   required
//                   className="p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="flex flex-col sm:flex-row sm:gap-4">
//                 <div className="flex flex-col gap-2 w-full">
//                   <label className="font-medium">Date</label>
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     required
//                     className="p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>
//                 <div className="flex flex-col gap-2 w-full">
//                   <label className="font-medium">Diary No</label>
//                   <input
//                     type="text"
//                     value={diaryNo}
//                     onChange={(e) => setDiaryNo(e.target.value)}
//                     required
//                     className="p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2 w-full">
//                 <label className="font-medium">From</label>
//                 <input
//                   type="text"
//                   value={from}
//                   onChange={(e) => setFrom(e.target.value)}
//                   required
//                   className="p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="flex flex-col gap-2 w-full">
//                 <label className="font-medium">Disposal</label>
//                 <input
//                   type="text"
//                   value={disposal}
//                   onChange={(e) => setDisposal(e.target.value)}
//                   required
//                   className="p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="flex flex-col gap-2 w-full">
//                 <label className="font-medium">Status</label>
//                 <select
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                   required
//                   className="p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="">Select Status</option>
//                   <option value="open">Open</option>
//                   <option value="closed">Closed</option>
//                 </select>
//               </div>
//             </>
//           ) : null}

//           {action === "Scan" ? (
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">Document Scanning</h3>
//               {!isScanning && !processedImage && (
//                 <button
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   type="button"
//                   onClick={handleScanStart}
//                 >
//                   Start Scanning
//                 </button>
//               )}
//               {isScanning && (
//                 <div className="bg-zinc-800 absolute inset-0 flex flex-col items-center justify-center">
//                   <div className="relative w-full h-full" onClick={handleFocus}>
//                     <Webcam
//                       className="w-full h-full object-cover"
//                       audio={false}
//                       screenshotFormat="image/jpeg"
//                       ref={(ref) => {
//                         webcamRef.current = ref
//                         videoRef.current = ref && ref.video
//                       }}
//                       width="100%"
//                       playsInline
//                       videoConstraints={{
//                         facingMode: cameraFacingMode,
//                         width: { ideal: 1920 },
//                         height: { ideal: 1080 },
//                         advanced: [{ zoom: zoomLevel }],
//                       }}
//                     />
//                     {isFocusing && (
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <Focus className="w-12 h-12 text-white animate-pulse" />
//                       </div>
//                     )}
//                     {isProcessing && (
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                         <div className="text-white flex flex-col items-center">
//                           <RefreshCw className="w-12 h-12 animate-spin mb-2" />
//                           <p>Processing image...</p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Document frame guide */}
//                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                       <div className="border-2 border-dashed border-white w-4/5 h-3/5 opacity-70 rounded-md"></div>
//                     </div>
//                   </div>
//                   <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
//                     <button className="p-3 bg-white rounded-full shadow-lg" onClick={decreaseZoom} type="button">
//                       <ZoomOut className="w-6 h-6" />
//                     </button>
//                     <button
//                       className="w-16 h-16 bg-white border-4 border-blue-500 rounded-full shadow-lg hover:bg-gray-100 transition duration-200"
//                       onClick={handleCapture}
//                       type="button"
//                     >
//                       <Camera className="w-8 h-8 mx-auto text-blue-600" />
//                     </button>
//                     <button className="p-3 bg-white rounded-full shadow-lg" onClick={increaseZoom} type="button">
//                       <ZoomIn className="w-6 h-6" />
//                     </button>
//                   </div>
//                   <button
//                     className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg"
//                     onClick={handleCloseCamera}
//                     type="button"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                   <button
//                     className="absolute top-4 left-4 p-3 bg-white rounded-full shadow-lg"
//                     onClick={toggleCameraFacing}
//                     type="button"
//                   >
//                     <RefreshCw className="w-6 h-6" />
//                   </button>
//                 </div>
//               )}
//               {processedImage && !isCropping && showRealTimePreview && (
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <img
//                       src={processedImage || "/placeholder.svg"}
//                       alt="Captured"
//                       className="w-full rounded-lg shadow-lg"
//                       style={{ transform: `rotate(${imageRotation}deg)` }}
//                     />
//                     {isProcessing && (
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
//                         <div className="text-white flex flex-col items-center">
//                           <RefreshCw className="w-12 h-12 animate-spin mb-2" />
//                           <p>Processing image...</p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Auto-enhancement indicator */}
//                     {autoFilterApplied && (
//                       <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md opacity-80">
//                         Auto-enhanced
//                       </div>
//                     )}
//                   </div>

//                   {/* Subject preview (compact) */}

//                   <div className="flex flex-wrap gap-2 justify-center">
//                     {!isApproved ? (
//                       <button
//                         className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                         type="button"
//                         onClick={approveDocument}
//                       >
//                         <Check className="w-4 h-4 mr-1 inline-block" /> Approve Document
//                       </button>
//                     ) : (
//                       <div className="w-full p-3 bg-green-100 border border-green-300 rounded-lg text-center text-green-800">
//                         Document approved and ready for submission
//                       </div>
//                     )}

//                     <button
//                       className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                       type="button"
//                       onClick={handleScanStart}
//                     >
//                       Scan Again
//                     </button>
//                     <button
//                       className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                       type="button"
//                       onClick={startCropping}
//                     >
//                       <Crop className="w-4 h-4 mr-1 inline-block" /> Crop
//                     </button>
//                     <div className="relative">
//                       <button
//                         className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                         type="button"
//                         onClick={toggleFilterMenu}
//                       >
//                         <SlidersHorizontal className="w-4 h-4 mr-1 inline-block" /> Filters
//                       </button>
//                       {isFilterMenuOpen && (
//                         <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg p-2 border">
//                           <button
//                             className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
//                             onClick={() => applyFilter("original")}
//                           >
//                             Original
//                           </button>
//                           <button
//                             className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
//                             onClick={() => applyFilter("enhanced")}
//                           >
//                             Enhanced
//                           </button>
//                           <button
//                             className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
//                             onClick={() => applyFilter("bw")}
//                           >
//                             Black & White
//                           </button>
//                           <button
//                             className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
//                             onClick={() => applyFilter("grayscale")}
//                           >
//                             Grayscale
//                           </button>
//                           <button
//                             className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
//                             onClick={() => applyFilter("high-contrast")}
//                           >
//                             High Contrast
//                           </button>
//                           <button
//                             className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
//                             onClick={() => applyFilter("color-enhance")}
//                           >
//                             Color Enhance
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {processedImage && isCropping && (
//                 <div className="space-y-4">
//                   <ReactCrop
//                     crop={crop}
//                     onChange={(c) => setCrop(c)}
//                     onComplete={(c) => setCompletedCrop(c)}
//                     aspect={undefined}
//                   >
//                     <img src={processedImage || "/placeholder.svg"} alt="To crop" />
//                   </ReactCrop>
//                   <div className="flex justify-center gap-4">
//                     <button
//                       className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                       type="button"
//                       onClick={confirmCrop}
//                     >
//                       <Check className="w-4 h-4 mr-1 inline-block" /> Apply Crop
//                     </button>
//                     <button
//                       className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                       type="button"
//                       onClick={cancelCropping}
//                     >
//                       <X className="w-4 h-4 mr-1 inline-block" /> Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex flex-col gap-2 w-full">
//               <label className="font-medium">File</label>
//               <div
//                 {...getRootProps()}
//                 className={`flex flex-col items-center justify-center w-full h-40 p-6 border-2 border-dashed bg-gray-100 rounded-lg cursor-pointer transition-all ${
//                   isDragActive ? "border-blue-500 bg-gray-200" : "border-gray-400"
//                 }`}
//               >
//                 <input {...getInputProps()} />
//                 <UploadCloud size={40} className="text-gray-500 mb-3" />
//                 {isDragActive ? (
//                   <p className="text-lg font-semibold text-blue-600">Drop your file here...</p>
//                 ) : (
//                   <p className="text-lg text-gray-700">
//                     Drag & Drop your PDF or Image here or{" "}
//                     <span className="text-blue-500 font-medium">click to browse</span>
//                   </p>
//                 )}
//               </div>
//               {file && (
//                 <p className="mt-2 text-gray-700">
//                   Uploaded File: <strong>{fileName}</strong>
//                 </p>
//               )}
//               {isProcessing && <p>Extracting text from file... Please wait.</p>}

//               {/* Show processed image preview for uploaded files too */}
//               {processedImage && !file && (
//                 <div className="mt-4">
//                   <h4 className="font-medium mb-2">Processed Document:</h4>
//                   <img
//                     src={processedImage || "/placeholder.svg"}
//                     alt="Processed document"
//                     className="w-full max-h-64 object-contain border border-gray-300 rounded-lg"
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//           {!isFullScreenScanning ? (
//             <div className="flex gap-10 justify-center">
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 type="submit"
//                 disabled={isLoading || (!file && !processedImage)}
//               >
//                 {isLoading ? "Saving..." : "Save"}
//               </button>
//               <button
//                 className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 type="button"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//             </div>
//           ) : null}
//         </form>
//       </div>
//     </div>
//   )
// }

// export default ScanUpload








"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Webcam from "react-webcam"
import { jsPDF } from "jspdf"
import { useDropzone } from "react-dropzone"
import {
  UploadCloud,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Camera,
  Focus,
  Crop,
  X,
  Check,
  SlidersHorizontal,
  RotateCw,
} from "lucide-react"
import Tesseract from "tesseract.js"
import * as pdfjsLib from "pdfjs-dist/webpack"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

// Image processing functions
const preprocessImageForOCR = async (imageData, filterType) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0)
      
      let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Apply filters based on type
      switch (filterType) {
        case "bw":
          imgData = convertToBlackAndWhite(imgData)
          break
        case "grayscale":
          imgData = convertToGrayscale(imgData)
          break
        case "high-contrast":
          imgData = enhanceContrast(imgData)
          break
        case "enhanced":
          imgData = enhanceImage(imgData)
          break
        case "color-enhance":
          imgData = enhanceColorDocument(imgData)
          break
        default:
          // Keep original
          break
      }
      
      ctx.putImageData(imgData, 0, 0)
      resolve(canvas.toDataURL("image/jpeg", 0.9))
    }
    img.src = imageData
  })
}


const enhanceColorDocument = (imageData) => {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  // Enhance saturation and contrast while preserving colors
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert RGB to HSL
    const [h, s, l] = rgbToHsl(r, g, b);

    // Enhance saturation and lightness
    const newS = Math.min(s * 1.2, 1.0); // Increase saturation by 20%
    let newL = l;

    // Adjust lightness based on current value
    if (l < 0.4) {
      newL = l * 1.1; // Brighten dark areas
    } else if (l > 0.7) {
      newL = l * 0.95; // Slightly darken very bright areas
    }

    // Convert back to RGB
    const [newR, newG, newB] = hslToRgb(h, newS, newL);

    data[i] = newR;
    data[i + 1] = newG;
    data[i + 2] = newB;
  }

  // Apply subtle sharpening
  const result = applySharpening(data, width, height);

  return new ImageData(result, width, height);
};

// Helper: RGB to HSL conversion
const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
};

// Helper: HSL to RGB conversion
const hslToRgb = (h, s, l) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

// Helper: Apply sharpening filter
const applySharpening = (data, width, height) => {
  const result = new Uint8ClampedArray(data.length);

  // Copy original data
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i];
  }

  // Apply sharpening kernel (simplified unsharp mask)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) { // For each color channel (R,G,B)
        // Simple sharpening kernel
        const sharpened = 
          data[idx + c] * 5 - 
          data[((y-1) * width + x) * 4 + c] - 
          data[((y+1) * width + x) * 4 + c] - 
          data[(y * width + (x-1)) * 4 + c] - 
          data[(y * width + (x+1)) * 4 + c];

        // Clamp values between 0-255
        result[idx + c] = Math.min(255, Math.max(0, sharpened));
      }
    }
  }

  return result;
};



const convertToGrayscale = (imageData) => {
  const data = new Uint8ClampedArray(imageData.data)
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    data[i] = data[i + 1] = data[i + 2] = gray
  }
  return new ImageData(data, imageData.width, imageData.height)
}

const convertToBlackAndWhite = (imageData) => {
  const data = new Uint8ClampedArray(imageData.data)
  // First convert to grayscale
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    data[i] = data[i + 1] = data[i + 2] = gray
  }

  // Apply threshold
  const threshold = 128
  for (let i = 0; i < data.length; i += 4) {
    const value = data[i] > threshold ? 255 : 0
    data[i] = data[i + 1] = data[i + 2] = value
  }

  return new ImageData(data, imageData.width, imageData.height)
}

const enhanceContrast = (imageData) => {
  const data = new Uint8ClampedArray(imageData.data)
  let min = 255
  let max = 0

  // Find min and max values
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    min = Math.min(min, gray)
    max = Math.max(max, gray)
  }

  // Apply contrast stretching
  const range = max - min
  if (range === 0) return imageData

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      data[i + j] = (255 * (data[i + j] - min)) / range
    }
  }

  return new ImageData(data, imageData.width, imageData.height)
}

const enhanceImage = (imageData) => {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  // Convert to grayscale
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    data[i] = data[i + 1] = data[i + 2] = gray
  }

  // Apply adaptive thresholding
  const blockSize = Math.max(3, Math.floor(Math.min(width, height) / 50)) * 2 + 1
  const C = 10

  const result = new Uint8ClampedArray(data.length)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4

      // Calculate local mean
      let sum = 0
      let count = 0

      const halfBlock = Math.floor(blockSize / 2)
      for (let j = Math.max(0, y - halfBlock); j <= Math.min(height - 1, y + halfBlock); j++) {
        for (let i = Math.max(0, x - halfBlock); i <= Math.min(width - 1, x + halfBlock); i++) {
          sum += data[(j * width + i) * 4]
          count++
        }
      }

      const mean = sum / count
      const threshold = mean - C

      // Apply threshold
      const value = data[idx] > threshold ? 255 : 0
      result[idx] = result[idx + 1] = result[idx + 2] = value
      result[idx + 3] = 255
    }
  }

  return new ImageData(result, width, height)
}

const detectDocumentEdges = (imageData) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const { width, height, data } = imgData

      // Convert to grayscale for edge detection
      const grayscale = new Uint8ClampedArray(width * height)
      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        grayscale[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      }

      // Apply Gaussian blur to reduce noise
      const blurred = new Uint8ClampedArray(width * height)
      const blurRadius = 2

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let sum = 0
          let count = 0

          for (let dy = -blurRadius; dy <= blurRadius; dy++) {
            for (let dx = -blurRadius; dx <= blurRadius; dx++) {
              const nx = x + dx
              const ny = y + dy

              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                sum += grayscale[ny * width + nx]
                count++
              }
            }
          }

          blurred[y * width + x] = sum / count
        }
      }

      // Apply Sobel operator for edge detection
      const edges = new Uint8ClampedArray(width * height)
      const threshold = 40

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x

          // Sobel kernels
          const gx =
            -1 * blurred[(y - 1) * width + (x - 1)] +
            0 * blurred[(y - 1) * width + x] +
            1 * blurred[(y - 1) * width + (x + 1)] +
            -2 * blurred[y * width + (x - 1)] +
            0 * blurred[y * width + x] +
            2 * blurred[y * width + (x + 1)] +
            -1 * blurred[(y + 1) * width + (x - 1)] +
            0 * blurred[(y + 1) * width + x] +
            1 * blurred[(y + 1) * width + (x + 1)]

          const gy =
            -1 * blurred[(y - 1) * width + (x - 1)] +
            -2 * blurred[(y - 1) * width + x] +
            -1 * blurred[(y - 1) * width + (x + 1)] +
            0 * blurred[y * width + (x - 1)] +
            0 * blurred[y * width + x] +
            0 * blurred[y * width + (x + 1)] +
            1 * blurred[(y + 1) * width + (x - 1)] +
            2 * blurred[(y + 1) * width + x] +
            1 * blurred[(y + 1) * width + (x + 1)]

          // Gradient magnitude
          const magnitude = Math.sqrt(gx * gx + gy * gy)

          // Thresholding
          edges[idx] = magnitude > threshold ? 255 : 0
        }
      }

      // Find document boundaries using contour detection
      const visited = new Set()
      const contours = []

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x

          if (edges[idx] > 0 && !visited.has(idx)) {
            const contour = []
            const stack = [{ x, y }]
            visited.add(idx)

            while (stack.length > 0) {
              const { x: cx, y: cy } = stack.pop()
              contour.push({ x: cx, y: cy })

              // Check 8 neighbors
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  if (dx === 0 && dy === 0) continue

                  const nx = cx + dx
                  const ny = cy + dy

                  if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const nidx = ny * width + nx
                    if (edges[nidx] > 0 && !visited.has(nidx)) {
                      stack.push({ x: nx, y: ny })
                      visited.add(nidx)
                    }
                  }
                }
              }
            }

            if (contour.length > 100) {
              contours.push(contour)
            }
          }
        }
      }

      // If we found contours, find the largest one that could be a document
      if (contours.length > 0) {
        contours.sort((a, b) => b.length - a.length)

        const largestContour = contours[0]
        let minX = width,
          minY = height,
          maxX = 0,
          maxY = 0

        for (const { x, y } of largestContour) {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }

        // Check if the bounding box is a reasonable size for a document
        if (maxX - minX > width * 0.2 && maxY - minY > height * 0.2) {
          // Add some padding
          const padding = Math.max(10, Math.min(width, height) * 0.02)
          minX = Math.max(0, minX - padding)
          minY = Math.max(0, minY - padding)
          maxX = Math.min(width, maxX + padding)
          maxY = Math.min(height, maxY + padding)

          // Crop to the bounding box
          const croppedCanvas = document.createElement("canvas")
          const croppedCtx = croppedCanvas.getContext("2d")

          const cropWidth = maxX - minX
          const cropHeight = maxY - minY

          croppedCanvas.width = cropWidth
          croppedCanvas.height = cropHeight

          croppedCtx.drawImage(img, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

          resolve(croppedCanvas.toDataURL("image/jpeg", 0.9))
          return
        }
      }

      // If no suitable document contour was found, return the original
      resolve(imageData)
    }

    img.src = imageData
  })
}

const determineBestFilter = async (imageData) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")

      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const { data, width, height } = imgData

      // Calculate image characteristics
      let brightness = 0
      let contrast = 0
      let darknessCount = 0
      let colorCount = 0

      // Sample pixels for analysis
      const sampleStep = 4
      const samples = []

      for (let i = 0; i < data.length; i += 4 * sampleStep) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        samples.push({ r, g, b })

        const pixelBrightness = 0.299 * r + 0.587 * g + 0.114 * b
        brightness += pixelBrightness

        if (pixelBrightness < 50) darknessCount++

        if (Math.abs(r - g) > 20 || Math.abs(g - b) > 20 || Math.abs(r - b) > 20) {
          colorCount++
        }
      }

      const totalSamples = samples.length
      brightness /= totalSamples

      // Calculate variance (for contrast)
      let variance = 0
      for (const { r, g, b } of samples) {
        const pixelBrightness = 0.299 * r + 0.587 * g + 0.114 * b
        variance += Math.pow(pixelBrightness - brightness, 2)
      }
      contrast = Math.sqrt(variance / totalSamples)

      // Normalize metrics
      const darkRatio = darknessCount / totalSamples
      const colorRatio = colorCount / totalSamples
      const isLowContrast = contrast < 40
      const isDark = brightness < 100
      const isColorful = colorRatio > 0.3

      // Decision tree for best filter
      if (isColorful) {
        if (isDark) {
          resolve("color-enhance")
        } else if (isLowContrast) {
          resolve("high-contrast")
        } else {
          resolve("color-enhance")
        }
      } else {
        if (isDark) {
          resolve("enhanced")
        } else if (isLowContrast) {
          resolve("high-contrast")
        } else {
          resolve("bw")
        }
      }
    }

    img.onerror = () => {
      resolve("enhanced")
    }

    img.src = imageData
  })
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
  const [processedImage, setProcessedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const webcamRef = useRef(null)
  const [isFullScreenScanning, setIsFullScreenScanning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [cameraFacingMode, setCameraFacingMode] = useState("environment")
  const [isFocusing, setIsFocusing] = useState(false)
  const videoRef = useRef(null)
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [isCropping, setIsCropping] = useState(false)
  const [crop, setCrop] = useState({ unit: "%", width: 80, height: 80, x: 10, y: 10 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [currentFilter, setCurrentFilter] = useState("enhanced")
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [extractedText, setExtractedText] = useState("")
  const [autoFilterApplied, setAutoFilterApplied] = useState(false)

  // Request camera permission
  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop())
      setHasCameraPermission(true)
    } catch (error) {
      setHasCameraPermission(false)
      alert("Camera access is required for scanning. Please allow camera access and try again.")
    }
  }

  // Handle document capture
  const handleCapture = async () => {
    if (webcamRef.current) {
      setIsProcessing(true)
      try {
        const imageSrc = webcamRef.current.getScreenshot()
        if (!imageSrc) throw new Error("Failed to capture image")

        setCapturedImage(imageSrc)

        // Step 1: Detect and crop document boundaries
        let processedImage = imageSrc
        try {
          const croppedImage = await detectDocumentEdges(imageSrc)
          if (croppedImage) {
            processedImage = croppedImage
          }
        } catch (cropError) {
          console.error("Error in document detection:", cropError)
        }

        // Step 2: Automatically apply the best filter
        try {
          const bestFilter = await determineBestFilter(processedImage)
          const enhancedImage = await preprocessImageForOCR(processedImage, bestFilter)
          setProcessedImage(enhancedImage)
          setCurrentFilter(bestFilter)
          setAutoFilterApplied(true)
        } catch (filterError) {
          console.error("Error applying auto filter:", filterError)
          setProcessedImage(processedImage)
        }

        setIsScanning(false)
        setIsFullScreenScanning(false)
      } catch (error) {
        console.error("Error processing captured image:", error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  // Start scanning
  const handleScanStart = async () => {
    if (hasCameraPermission === null) {
      try {
        await requestCameraAccess()
        setIsScanning(true)
        setIsFullScreenScanning(true)
        setCapturedImage(null)
        setProcessedImage(null)
        setIsApproved(false)
        setAutoFilterApplied(false)
      } catch (error) {
        console.error("Error requesting camera access:", error)
      }
    } else if (hasCameraPermission === true) {
      setIsScanning(true)
      setIsFullScreenScanning(true)
      setCapturedImage(null)
      setProcessedImage(null)
      setIsApproved(false)
      setAutoFilterApplied(false)
    } else {
      alert("Camera access is required for scanning. Please allow camera access in your browser settings and try again.")
    }
  }

  // Close camera
  const handleCloseCamera = () => {
    setIsScanning(false)
    setIsFullScreenScanning(false)
    setCapturedImage(null)
    setProcessedImage(null)
  }

  // Toggle camera facing mode
  const toggleCameraFacing = () => {
    setCameraFacingMode((prev) => (prev === "environment" ? "user" : "environment"))
  }

  // Zoom controls
  const increaseZoom = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  const decreaseZoom = () => setZoomLevel((prev) => Math.max(prev - 0.25, 1))

  // Crop functions
  const startCropping = () => setIsCropping(true)
  const cancelCropping = () => setIsCropping(false)

  const confirmCrop = async () => {
    if (completedCrop && processedImage) {
      try {
        const croppedImage = await applyCrop(processedImage, completedCrop)
        setProcessedImage(croppedImage)
        setIsCropping(false)
      } catch (error) {
        console.error("Error applying crop:", error)
      }
    }
  }

  // Apply filter
  const applyFilter = async (filterType) => {
    if (processedImage) {
      setIsProcessing(true)
      try {
        const filteredImage = await preprocessImageForOCR(processedImage, filterType)
        setProcessedImage(filteredImage)
        setCurrentFilter(filterType)
        setIsFilterMenuOpen(false)
        setAutoFilterApplied(false)
      } catch (error) {
        console.error("Error applying filter:", error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  // Approve document
  const approveDocument = () => {
    setIsApproved(true)
    applyFilter(currentFilter)
  }

  // Handle file upload
  const handleFileChange = useCallback(async (file) => {
    setIsProcessing(true)
    setFile(file)
    setFileName(file.name)

    try {
      if (file.type === "application/pdf") {
        const fileBuffer = await file.arrayBuffer()
        const text = await extractTextFromPdf(fileBuffer)
        setExtractedText(text)
      } else if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const imageData = e.target?.result
          setCapturedImage(imageData)

          try {
            const croppedImage = await detectDocumentEdges(imageData)
            const processedImg = croppedImage || imageData
            const bestFilter = await determineBestFilter(processedImg)
            const enhancedImage = await preprocessImageForOCR(processedImg, bestFilter)
            setProcessedImage(enhancedImage)
            setCurrentFilter(bestFilter)
            setAutoFilterApplied(true)
          } catch (error) {
            console.error("Error processing image:", error)
            setProcessedImage(imageData)
          }
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error("Error processing file:", error)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  // Dropzone config
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) handleFileChange(file)
    },
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
    },
  })

  const enhanceColorDocument = (imageData) => {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  // Enhance saturation and contrast while preserving colors
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert RGB to HSL
    const [h, s, l] = rgbToHsl(r, g, b);

    // Enhance saturation and lightness
    const newS = Math.min(s * 1.2, 1.0); // Increase saturation by 20%
    let newL = l;

    // Adjust lightness based on current value
    if (l < 0.4) {
      newL = l * 1.1; // Brighten dark areas
    } else if (l > 0.7) {
      newL = l * 0.95; // Slightly darken very bright areas
    }

    // Convert back to RGB
    const [newR, newG, newB] = hslToRgb(h, newS, newL);

    data[i] = newR;
    data[i + 1] = newG;
    data[i + 2] = newB;
  }

  // Apply subtle sharpening
  const result = applySharpening(data, width, height);

  return new ImageData(result, width, height);
};

// Helper: RGB to HSL conversion
const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
};

// Helper: HSL to RGB conversion
const hslToRgb = (h, s, l) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

// Helper: Apply sharpening filter
const applySharpening = (data, width, height) => {
  const result = new Uint8ClampedArray(data.length);

  // Copy original data
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i];
  }

  // Apply sharpening kernel (simplified unsharp mask)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) { // For each color channel (R,G,B)
        // Simple sharpening kernel
        const sharpened = 
          data[idx + c] * 5 - 
          data[((y-1) * width + x) * 4 + c] - 
          data[((y+1) * width + x) * 4 + c] - 
          data[(y * width + (x-1)) * 4 + c] - 
          data[(y * width + (x+1)) * 4 + c];

        // Clamp values between 0-255
        result[idx + c] = Math.min(255, Math.max(0, sharpened));
      }
    }
  }

  return result;
};

  // Extract text from PDF
  async function extractTextFromPdf(fileBuffer) {
    try {
      const loadingTask = pdfjsLib.getDocument(fileBuffer)
      const pdf = await loadingTask.promise

      let textContent = ""
      for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
        const page = await pdf.getPage(pageIndex)
        const text = await page.getTextContent()
        textContent += text.items.map((item) => item.str).join(" ")
      }

      return textContent
    } catch (error) {
      console.error("Error extracting text from PDF:", error)
      return ""
    }
  }

  // Convert image to PDF
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

  // Apply crop to image
  const applyCrop = (image, crop) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        const scaleX = img.naturalWidth / img.width
        const scaleY = img.naturalHeight / img.height

        const pixelCrop = {
          x: crop.x * scaleX,
          y: crop.y * scaleY,
          width: crop.width * scaleX,
          height: crop.height * scaleY,
        }

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        ctx.drawImage(
          img,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height,
        )

        resolve(canvas.toDataURL("image/jpeg", 0.9))
      }
      img.src = image
    })
  }


  const handleFocus = useCallback(
    async (event) => {
      if (videoRef.current && "mediaDevices" in navigator) {
        setIsFocusing(true);
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: cameraFacingMode,
              advanced: [{ zoom: zoomLevel }]
            } 
          });
          
          const track = stream.getVideoTracks()[0];
          
          if (track.getCapabilities && "focusMode" in track.getCapabilities()) {
            // Get click position relative to video element
            const rect = videoRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // Normalize coordinates (0-1)
            const focusX = x / rect.width;
            const focusY = y / rect.height;
            
            // Try to set focus (implementation varies by browser/device)
            try {
              await track.applyConstraints({
                advanced: [{
                  focusMode: "manual",
                  focusDistance: 0, // Focus on the clicked point
                  pointsOfInterest: [{x: focusX, y: focusY}]
                }]
              });
            } catch (focusError) {
              console.log("Precise focus not supported, using center focus");
              // Fallback to center focus if precise focus isn't supported
              await track.applyConstraints({
                advanced: [{
                  focusMode: "auto"
                }]
              });
            }
          }
        } catch (error) {
          console.error("Error setting focus:", error);
        } finally {
          setIsFocusing(false);
        }
      }
    },
    [cameraFacingMode, zoomLevel]
  );




  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    if ((!file && !processedImage) || !selectedDepartment || !subject || !diaryNo || !from || !disposal || !status) {
      alert("Please fill out all fields and either upload a file or capture an image.")
      setIsLoading(false)
      return
    }

    const formData = new FormData()

    if (file) {
      formData.append("file", file)
      formData.append("fileName", fileName || subject)
    } else if (processedImage) {
      const pdfBlob = await convertImageToPdf(processedImage)
      const finalFileName = fileName || subject || "captured_image"
      formData.append("file", pdfBlob, `${finalFileName}.pdf`)
      formData.append("fileName", finalFileName)
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

    const method = fileData ? "PUT" : "POST"
    const url = fileData ? `/api/scanupload/${fileData._id}` : "/api/scanupload"

    try {
      const response = await fetch(url, { method, body: formData })
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

  // Fetch departments when type changes
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`/api/department?type=${type}`, { method: "GET" })
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setDepartments(data)
      } catch (error) {
        console.error("Failed to fetch departments", error)
      }
    }

    if (type) fetchDepartments()
  }, [type])

  // Update categories when department changes
  useEffect(() => {
    if (selectedDepartment) {
      const department = departments.find((dept) => dept._id === selectedDepartment)
      setCategories(department?.categories || [])
    }
  }, [selectedDepartment, departments])

  return (
    <div className={`${isFullScreenScanning ? "fixed inset-0 z-50" : "bg-zinc-800 p-10 "}`}>
      <div
        className={`${
          isFullScreenScanning
            ? "h-full max-h-full"
            : "bg-white p-6 rounded-lg max-w-4xl mx-auto overflow-y-auto xl:max-h-[710px] max-h-[860px]"
        }`}
      >
        {!isFullScreenScanning && <h2 className="text-3xl text-center font-semibold mb-6">{action} Form</h2>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isFullScreenScanning ? (
            <>
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Type</option>
                  <option value="uni">University</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-medium">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    required
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-medium">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
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
              
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-medium">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-medium">Diary No</label>
                  <input
                    type="text"
                    value={diaryNo}
                    onChange={(e) => setDiaryNo(e.target.value)}
                    required
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium">From</label>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium">Disposal</label>
                <input
                  type="text"
                  value={disposal}
                  onChange={(e) => setDisposal(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded-md"
                >
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
              
              {!isScanning && !processedImage && (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  type="button"
                  onClick={handleScanStart}
                >
                  Start Scanning
                </button>
              )}
              
              {isScanning && (
                <div className="bg-zinc-800 absolute inset-0 flex flex-col items-center justify-center">
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

                    {/* Document frame guide */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="border-2 border-dashed border-white w-4/5 h-3/5 opacity-70 rounded-md"></div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
                    <button className="p-3 bg-white rounded-full shadow-lg" onClick={decreaseZoom} type="button">
                      <ZoomOut className="w-6 h-6" />
                    </button>
                    <button
                      className="w-16 h-16 bg-white border-4 border-blue-500 rounded-full shadow-lg hover:bg-gray-100 transition duration-200"
                      onClick={handleCapture}
                      type="button"
                    >
                      <Camera className="w-8 h-8 mx-auto text-blue-600" />
                    </button>
                    <button className="p-3 bg-white rounded-full shadow-lg" onClick={increaseZoom} type="button">
                      <ZoomIn className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <button
                    className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg"
                    onClick={handleCloseCamera}
                    type="button"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  <button
                    className="absolute top-4 left-4 p-3 bg-white rounded-full shadow-lg"
                    onClick={toggleCameraFacing}
                    type="button"
                  >
                    <RefreshCw className="w-6 h-6" />
                  </button>
                </div>
              )}
              
              {processedImage && !isCropping && (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={processedImage || "/placeholder.svg"}
                      alt="Captured"
                      className="w-full rounded-lg shadow-lg"
                    />
                    
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="text-white flex flex-col items-center">
                          <RefreshCw className="w-12 h-12 animate-spin mb-2" />
                          <p>Processing image...</p>
                        </div>
                      </div>
                    )}

                    {autoFilterApplied && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md opacity-80">
                        Auto-enhanced
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {!isApproved ? (
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        type="button"
                        onClick={approveDocument}
                      >
                        <Check className="w-4 h-4 mr-1 inline-block" /> Approve Document
                      </button>
                    ) : (
                      <div className="w-full p-3 bg-green-100 border border-green-300 rounded-lg text-center text-green-800">
                        Document approved and ready for submission
                      </div>
                    )}

                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      type="button"
                      onClick={handleScanStart}
                    >
                      Scan Again
                    </button>
                    
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      type="button"
                      onClick={startCropping}
                    >
                      <Crop className="w-4 h-4 mr-1 inline-block" /> Crop
                    </button>
                    
                    <div className="relative">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        type="button"
                        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                      >
                        <SlidersHorizontal className="w-4 h-4 mr-1 inline-block" /> Filters
                      </button>
                      
                      {isFilterMenuOpen && (
                        <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg p-2 border">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                            onClick={() => applyFilter("original")}
                          >
                            Original
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                            onClick={() => applyFilter("enhanced")}
                          >
                            Enhanced
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                            onClick={() => applyFilter("bw")}
                          >
                            Black & White
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                            onClick={() => applyFilter("grayscale")}
                          >
                            Grayscale
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                            onClick={() => applyFilter("high-contrast")}
                          >
                            High Contrast
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {processedImage && isCropping && (
                <div className="space-y-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={undefined}
                  >
                    <img src={processedImage || "/placeholder.svg"} alt="To crop" />
                  </ReactCrop>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      type="button"
                      onClick={confirmCrop}
                    >
                      <Check className="w-4 h-4 mr-1 inline-block" /> Apply Crop
                    </button>
                    
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      type="button"
                      onClick={cancelCropping}
                    >
                      <X className="w-4 h-4 mr-1 inline-block" /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <label className="font-medium">File</label>
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center w-full h-40 p-6 border-2 border-dashed bg-gray-100 rounded-lg cursor-pointer transition-all ${
                  isDragActive ? "border-blue-500 bg-gray-200" : "border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
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

              {processedImage && !file && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Processed Document:</h4>
                  <img
                    src={processedImage || "/placeholder.svg"}
                    alt="Processed document"
                    className="w-full max-h-64 object-contain border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
          
          {!isFullScreenScanning && (
            <div className="flex gap-10 justify-center">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading || (!file && !processedImage)}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ScanUpload