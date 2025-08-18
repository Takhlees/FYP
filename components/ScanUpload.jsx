"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { useDropzone } from "react-dropzone";
import {
  ZoomIn,
  ZoomOut,
  Camera,
  X,
  Check,
  Zap,
  ZapOff,
  FileText,
  Copy,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  UploadCloud,
  RefreshCw,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  updateToast,
  dismissToast,
  updateLoadingToast,
} from "@/utils/toast";

// Document Preview Modal Component
const DocumentPreviewModal = ({
  isOpen,
  onClose,
  document,
  fileName,
  pdfPreviewData,
}) => {

  if (!isOpen) return null;

  // Check if we have any valid preview data
  const hasValidDocument = 
    (document && 
     document !== "/placeholder.svg" && 
     !document.includes("placeholder.svg") && 
     document.trim() !== "") ||
    (pdfPreviewData && pdfPreviewData.previewImage);

  // Determine the best image source to display
  const getImageSource = () => {
    if (pdfPreviewData?.previewImage) {
      const imageSource = `data:${pdfPreviewData.previewImage.mimeType};base64,${pdfPreviewData.previewImage.base64}`;
      return imageSource;
    }
    if (
      document &&
      document !== "/placeholder.svg" &&
      !document.includes("placeholder.svg")
    ) {
      return document;
    }
    return null;
  };

  const imageSource = getImageSource();

  return (
    <div
      className="fixed inset-0 z-[60] bg-black bg-opacity-75 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[calc(100vh-2rem)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Document Preview
              </h2>
              <p className="text-sm text-gray-600">
                {fileName || "Enhanced Document"}
                {pdfPreviewData?.pageCount &&
                  ` • ${pdfPreviewData.pageCount} page${
                    pdfPreviewData.pageCount > 1 ? "s" : ""
                  }`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto bg-gray-100 p-4">
              {hasValidDocument && imageSource ? (
                <div className="flex justify-center min-h-full">
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-200">
                    <img
                      src={imageSource}
                      alt="Document preview"
                      className="max-w-full h-auto block"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 space-y-4 h-full">
                  <FileText className="w-16 h-16" />
                  <p className="text-lg">No document preview available</p>
                  <p className="text-sm text-center">
                  {pdfPreviewData
                    ? "PDF preview data is available but image could not be generated"
                    : "Document has not been processed yet"}
                  </p>
                </div>
              )}
            </div>
        </div>

        {/* Footer - Always at bottom */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              {pdfPreviewData
                ? "PDF document with preview"
                : "Document processed and enhanced"}
            </div>
            <div className="flex items-center gap-4">
              <span>Quality: High</span>
              <span>Format: {pdfPreviewData ? "PDF" : "Optimized"}</span>
              {pdfPreviewData?.pageCount && (
                <span>Pages: {pdfPreviewData.pageCount}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



// API call to document scanner service
const callDocumentScannerAPI = async (
  file,
  action = "enhance_and_extract",
  quality = "high"
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("action", action);
  formData.append("quality", quality);

  const response = await fetch("/api/document-scanner", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "API request failed";
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.error || `HTTP error! status: ${response.status}`;
    } catch (parseError) {
      errorMessage = `HTTP error! status: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};

const ScanUpload = ({ fileData, action, onClose }) => {
  const isUploadMode = action === "Upload";
  const isEditMode = fileData && fileData.isEditMode;

  const [currentStep, setCurrentStep] = useState(0);
  const [type, setType] = useState(fileData?.type || "");
  const [file, setFile] = useState(fileData?.file || null);
  const [fileName, setFileName] = useState(fileData?.file?.name || "");
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    fileData?.department || ""
  );
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

  // Camera and image processing states
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [pdfPreviewData, setPdfPreviewData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isTorchAvailable, setIsTorchAvailable] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameraTrack, setCameraTrack] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionFailed, setExtractionFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const webcamRef = useRef(null);
  const videoRef = useRef(null);
  const clearAllState = useCallback(() => {
    setFile(null);
    setFileName("");
    setEnhancedImage(null);
    setPdfPreviewData(null);
    setExtractedText("");
    setExtractionFailed(false);
    setIsProcessing(false);
    setIsExtracting(false);
    setCurrentStep(0);
  }, []);



  const scrollToTop = useCallback(() => {
    const scrollableContainer = document.querySelector(
      ".fixed.inset-0.z-50.overflow-auto"
    );
    if (scrollableContainer) {
      scrollableContainer.scrollTop = 0; // Immediate scroll
      scrollableContainer.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, []);

  // Single useEffect to handle all scroll scenarios
  useEffect(() => {
    scrollToTop();
  }, [scrollToTop, currentStep]); // Triggers on mount and step changes

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!type) return;

      try {
        setDepartmentsLoading(true);
        const response = await fetch(`/api/department?type=${type}`, {
          method: "GET",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setDepartments(data);
        setDepartmentsLoading(false);
      } catch (error) {
        console.error("Failed to fetch departments", error);
        showErrorToast("Failed to load departments");
        setDepartmentsLoading(false);
      }
    };

    if (type) fetchDepartments();
  }, [type]);

  useEffect(() => {
    if (selectedDepartment) {
      setCategoriesLoading(true);
      const department = departments.find(
        (dept) => dept._id === selectedDepartment
      );
      const deptCategories = department?.categories || [];
      setCategories(deptCategories);
      setCategoriesLoading(false);
    }
  }, [selectedDepartment, departments]);

  useEffect(() => {
    return () => {
      if (cameraTrack) {
        cameraTrack.stop();
      }
    };
  }, [cameraTrack]);

  const turnOffTorch = useCallback(async () => {
    if (cameraTrack && isTorchAvailable && isTorchOn) {
      try {
        await cameraTrack.applyConstraints({
          advanced: [{ torch: false }],
        });
        setIsTorchOn(false);
      } catch (error) {
        console.error("Error turning off torch:", error);
      }
    }
  }, [cameraTrack, isTorchAvailable, isTorchOn]);

  const initializeCamera = useCallback(async () => {
    try {
      if (webcamRef.current && webcamRef.current.video) {
        const stream = webcamRef.current.video.srcObject;

        if (stream) {
          const videoTrack = stream.getVideoTracks()[0];
          setCameraTrack(videoTrack);

          const capabilities = videoTrack.getCapabilities
            ? videoTrack.getCapabilities()
            : {};
          setIsTorchAvailable(capabilities.torch || false);

          if (
            capabilities.focusMode &&
            capabilities.focusMode.includes("continuous")
          ) {
            try {
              await videoTrack.applyConstraints({
                advanced: [{ focusMode: "continuous" }],
              });
            } catch (error) {
              // Auto-focus not supported
            }
          }
        }
      }
    } catch (error) {
      console.error("Error initializing camera:", error);
    }
  }, []);

  const startCamera = useCallback(async () => {
    // Show loading toast immediately
    const cameraToast = showLoadingToast("Requesting camera access...");
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacingMode,
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
        },
      });

      // Dismiss camera access toast when successful (no success message needed)
      if (cameraToast) {
        dismissToast(cameraToast);
      }

      setHasCameraPermission(true);
      setIsCameraActive(true);
      setCurrentStep(0);

      setTimeout(() => {
        initializeCamera();
      }, 500);
    } catch (error) {
      console.warn("Camera access error (handled):", error.name);
      setHasCameraPermission(false);
      setIsCameraActive(false);

      // Dismiss the loading toast first
      if (cameraToast) {
        dismissToast(cameraToast);
      }

      // Show error toast
      showErrorToast(
        "Camera access denied. Please allow camera access and try again."
      );
    }
  }, [cameraFacingMode, initializeCamera]);

  const retryCamera = useCallback(() => {
    showErrorToast(
      "Please enable camera permissions in your browser settings and refresh the page."
    );
  }, []);

  // Handle file change for upload mode with API integration
  const handleFileChange = useCallback(
    async (file) => {
      if (!file) return;

      setIsProcessing(true);
      setFile(file);
      setFileName(file.name);

      try {
        // Force a re-render to ensure toast is shown
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Show loading toast immediately
        const processingToast = showLoadingToast("Processing document...");

        // Call the document scanner API
        const result = await callDocumentScannerAPI(
          file,
          "enhance_and_extract",
          "high"
        );

        // Update to show text extraction progress
        if (processingToast) {
          updateLoadingToast(
            processingToast,
            "Extracting text from document..."
          );
        }

        if (result.success) {
          // Handle enhanced image
          if (result.enhancedImage) {
            const enhancedImageUrl = `data:${result.enhancedImage.mimeType};base64,${result.enhancedImage.base64}`;
            setEnhancedImage(enhancedImageUrl);
          }

          // Handle PDF preview data
          if (result.pdfPreview) {
            setPdfPreviewData(result.pdfPreview);
          }

          // Update to show final processing
          if (processingToast) {
            updateLoadingToast(processingToast, "Finalizing document...");
          }

          // Handle text extraction and subject extraction
          if (result.textExtraction && result.textExtraction.text) {
            setExtractedText(result.textExtraction.text);

            // Use the subject from API response (it handles both specific and legacy extraction)
            const extractedSubject =
              result.textExtraction.subject ||
              result.textExtraction.legacySubject ||
              "";
            if (extractedSubject && !subject) {
              setSubject(extractedSubject);
            }
          }

          // Handle optimized PDF
          if (result.optimizedPdf) {
            const pdfBlob = new Blob(
              [
                Uint8Array.from(atob(result.optimizedPdf.base64), (c) =>
                  c.charCodeAt(0)
                ),
              ],
              { type: "application/pdf" }
            );
            const optimizedFile = new File(
              [pdfBlob],
              result.optimizedPdf.filename,
              {
                type: "application/pdf",
              }
            );
            setFile(optimizedFile);
          }



          // Only show success toast after everything completes successfully
          if (processingToast) {
            dismissToast(processingToast);
            setTimeout(() => {
              showSuccessToast("Document processed successfully!");
            }, 100);
          } else {
            showSuccessToast("Document processed successfully!");
          }
        } else {
          console.error("API returned error:", result.error);
          throw new Error(result.error || "Processing failed");
        }
      } catch (error) {
        console.error("File processing error:", error);
        // Dismiss the loading toast and show error
        if (processingToast) {
          dismissToast(processingToast);
          setTimeout(() => {
            showErrorToast(`Processing failed: ${error.message}`);
          }, 100);
        } else {
          showErrorToast(`Processing failed: ${error.message}`);
        }

        // Fallback to original file
        const fallbackUrl = URL.createObjectURL(file);
        setEnhancedImage(fallbackUrl);
      } finally {
        setIsProcessing(false);
      }
    },
    [subject]
  );

  const handleRetake = useCallback(() => {
    if (cameraTrack) {
      cameraTrack.stop();
      setCameraTrack(null);
    }
    setIsCameraActive(false);
    setHasCameraPermission(null);
    setTimeout(() => {
      startCamera();
    }, 200);
  }, [cameraTrack, startCamera]);

  // Dropzone config (for upload mode)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) handleFileChange(file);
    },
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxSize: 10485760, // 10MB limit
    multiple: false,
    onDropRejected: (fileRejections) => {
      if (fileRejections.length > 0) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          showErrorToast("File is too large. Maximum size is 10MB.");
        } else {
          showErrorToast("Invalid file. Please upload a PDF or image file.");
        }
      }
    },
  });

  // Toggle torch
  const toggleTorch = useCallback(async () => {
    if (!cameraTrack || !isTorchAvailable) return;

    try {
      await cameraTrack.applyConstraints({
        advanced: [{ torch: !isTorchOn }],
      });
      setIsTorchOn(!isTorchOn);
    } catch (error) {
      console.error("Error toggling torch:", error);
      showErrorToast("Unable to control flash");
    }
  }, [cameraTrack, isTorchAvailable, isTorchOn]);



  // Capture and process with API integration
  const captureAndProcess = useCallback(async () => {
    if (!webcamRef.current) return;

    setIsProcessing(true);

    // Force a re-render to ensure toast is shown
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Show loading toast immediately
    const processingToast = showLoadingToast(
      "Capturing and processing document..."
    );

    try {
      // Capture at optimal resolution
      const imageSrc = webcamRef.current.getScreenshot({
        width: 1654,
        height: 2339,
        screenshotFormat: "image/jpeg",
        screenshotQuality: 0.95,
      });

      if (!imageSrc) throw new Error("Failed to capture image");

      await turnOffTorch();

      if (cameraTrack) {
        cameraTrack.stop();
        setCameraTrack(null);
      }
      setIsCameraActive(false);

      // Convert data URL to blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const capturedFile = new File([blob], `scan_${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      // Update the processing toast to show enhancement progress (keep loading state)
      if (processingToast) {
        updateLoadingToast(processingToast, "Enhancing document with AI...");
      }

      const result = await callDocumentScannerAPI(
        capturedFile,
        "enhance_and_extract",
        "high"
      );

      // Update to show text extraction progress
      if (processingToast) {
        updateLoadingToast(processingToast, "Extracting text from document...");
      }

      if (result.success) {
        // Handle enhanced image
        if (result.enhancedImage) {
          const enhancedImageUrl = `data:${result.enhancedImage.mimeType};base64,${result.enhancedImage.base64}`;
          setEnhancedImage(enhancedImageUrl);
        }

        // Handle PDF preview data
        if (result.pdfPreview) {
          setPdfPreviewData(result.pdfPreview);
        }

        // Handle text extraction and subject extraction
        if (result.textExtraction && result.textExtraction.text) {
          setExtractedText(result.textExtraction.text);

          // Use the subject from API response (it handles both specific and legacy extraction)
          const extractedSubject =
            result.textExtraction.subject ||
            result.textExtraction.legacySubject ||
            "";
          if (extractedSubject && !subject) {
            setSubject(extractedSubject);
          }
        }

        // Handle optimized PDF
        if (result.optimizedPdf) {
          const pdfBlob = new Blob(
            [
              Uint8Array.from(atob(result.optimizedPdf.base64), (c) =>
                c.charCodeAt(0)
              ),
            ],
            { type: "application/pdf" }
          );
          const pdfFile = new File([pdfBlob], result.optimizedPdf.filename, {
            type: "application/pdf",
          });
          setFile(pdfFile);
          setFileName(result.optimizedPdf.filename);
        }

        // Update to show final processing
        if (processingToast) {
          updateLoadingToast(processingToast, "Finalizing document...");
        }

        // Handle text extraction and go to form
        await extractTextAndGoToForm(result);

                  // Only show success toast after everything completes successfully
          if (processingToast) {
            dismissToast(processingToast);
            setTimeout(() => {
              showSuccessToast("Document optimized successfully!");
            }, 100);
          } else {
            showSuccessToast("Document optimized successfully!");
          }
      } else {
        throw new Error(result.error || "Processing failed");
      }
    } catch (error) {
      console.error("Capture error:", error);
      // Dismiss the loading toast and show error
      if (processingToast) {
        dismissToast(processingToast);
        setTimeout(() => {
          showErrorToast(`Processing failed: ${error.message}`);
        }, 100);
      } else {
        showErrorToast(`Processing failed: ${error.message}`);
      }
      setCurrentStep(1); // Go to manual step
      return; // Stop execution here - don't continue with any success flows
    } finally {
      setIsProcessing(false);
    }
  }, [cameraTrack, turnOffTorch]);

  // Extract text and go to form with API results
  const extractTextAndGoToForm = useCallback(
    async (apiResult) => {
      setIsExtracting(true);
      setExtractionFailed(false);

      try {
        // No toast needed for text extraction

        if (apiResult.textExtraction && apiResult.textExtraction.text) {
          const extractedText = apiResult.textExtraction.text;
          setExtractedText(extractedText);

          // Use the subject from API response (it handles both specific and legacy extraction)
          const extractedSubject =
            apiResult.textExtraction.subject ||
            apiResult.textExtraction.legacySubject ||
            "";
          if (extractedSubject && !subject) {
            setSubject(extractedSubject);
          }

          // Go directly to form completion step (step 3)
          setCurrentStep(3);
          // No toast needed - main success toast already shown
        } else {
          throw new Error("No text was extracted from the document");
        }
      } catch (error) {
        console.error("Subject extraction failed:", error);
        setExtractionFailed(true);
        // On failure, go to step 1 to show enhanced image and manual options
        setCurrentStep(1);
        throw error; // Re-throw so main process can handle it
      } finally {
        setIsExtracting(false);
      }
    },
    [subject]
  );

  // Retry text extraction with API
  const retryTextExtraction = useCallback(async () => {
    if (!file) return;

    setIsExtracting(true);
    setExtractionFailed(false);

    try {
      // No toast needed for retry extraction

      const result = await callDocumentScannerAPI(file, "extract_only", "high");

      if (
        result.success &&
        result.textExtraction &&
        result.textExtraction.text
      ) {
        setExtractedText(result.textExtraction.text);

        // Use the subject from API response
        const extractedSubject =
          result.textExtraction.subject ||
          result.textExtraction.legacySubject ||
          "";
        if (extractedSubject && !subject) {
          setSubject(extractedSubject);
        }

        setExtractionFailed(false);
        // No toast needed - user can see the extracted text
      } else {
        throw new Error("Text extraction failed");
      }
    } catch (error) {
      console.error("Retry extraction failed:", error);
      setExtractionFailed(true);
      // Show error toast directly
      showErrorToast(
        "Text extraction failed again. Please fill the form manually."
      );
      return; // Stop execution here - don't continue with any success flows
    } finally {
      setIsExtracting(false);
    }
  }, [file, subject]);

  // Copy text to clipboard
  const copyToClipboard = useCallback(() => {
    if (!extractedText) return;

    navigator.clipboard
      .writeText(extractedText)
      .then(() => showSuccessToast("Text copied!"))
      .catch(() => showErrorToast("Failed to copy text"));
  }, [extractedText]);

  // Toggle camera facing mode
  const toggleCameraFacing = useCallback(() => {
    setCameraFacingMode((prev) =>
      prev === "environment" ? "user" : "environment"
    );
  }, []);

  // Zoom controls
  const increaseZoom = useCallback(
    () => setZoomLevel((prev) => Math.min(prev + 0.2, 3)),
    []
  );
  const decreaseZoom = useCallback(
    () => setZoomLevel((prev) => Math.max(prev - 0.2, 1)),
    []
  );

  const handleNumberOnlyInput = (e, setter) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleAlphabetOnlyInput = (e, setter) => {
    const value = e.target.value;
    if (/^[a-zA-Z]*$/.test(value)) {
      setter(value);
    }
  };

  // Form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsLoading(true);

      // Validation
      if (isEditMode) {
        const missingFields = [];
        if (!selectedDepartment) missingFields.push("Department");
        if (!subject) missingFields.push("Subject");
        if (!diaryNo) missingFields.push("Diary No");
        if (!from) missingFields.push("From");
        if (!disposal) missingFields.push("Disposal");
        if (!status) missingFields.push("Status");

        if (missingFields.length > 0) {
          showErrorToast(
            `Please fill required fields: ${missingFields.join(", ")}`
          );
          setIsLoading(false);
          return;
        }
      } else {
        if (
          (!file && !enhancedImage) ||
          !selectedDepartment ||
          !subject ||
          !diaryNo ||
          !from ||
          !disposal ||
          !status
        ) {
          showErrorToast("Please fill all required fields");
          setIsLoading(false);
          return;
        }
      }

      const formData = new FormData();

      try {
        if (isEditMode) {
          formData.append("type", type || "");
          formData.append("department", selectedDepartment || "");
          formData.append("category", selectedCategory || "");
          formData.append("subject", subject || "");
          formData.append("date", date || "");
          formData.append("diaryNo", diaryNo || "");
          formData.append("from", from || "");
          formData.append("disposal", disposal || "");
          formData.append("status", status || "");
          formData.append("extractedText", extractedText || "");
          formData.append("fileName", fileName || subject || "document");

          if (file) {
            formData.append("file", file);
            formData.append("replaceFile", "true");
          } else {
            formData.append("replaceFile", "false");
          }
        } else {
          // Handle file for new documents
          if (file) {
            formData.append("file", file);
            formData.append("fileName", fileName || subject || "document");
          } else if (enhancedImage) {
            // Fallback: if no file but have enhanced image, create PDF
            const response = await fetch(enhancedImage);
            const blob = await response.blob();
            const imageFile = new File(
              [blob],
              `enhanced_scan_${Date.now()}.jpg`,
              {
                type: "image/jpeg",
              }
            );

            // Use API to create optimized PDF
            const result = await callDocumentScannerAPI(
              imageFile,
              "enhance_only",
              "high"
            );
            if (result.success && result.optimizedPdf) {
              const pdfBlob = new Blob(
                [
                  Uint8Array.from(atob(result.optimizedPdf.base64), (c) =>
                    c.charCodeAt(0)
                  ),
                ],
                { type: "application/pdf" }
              );
              formData.append("file", pdfBlob, result.optimizedPdf.filename);
              formData.append("fileName", result.optimizedPdf.filename);
            } else {
              throw new Error("Failed to create PDF from enhanced image");
            }
          } else {
            throw new Error("No file or scan data available");
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
        }

        const method = isEditMode ? "PUT" : "POST";
        const url = isEditMode
          ? `/api/scanupload/${fileData._id}`
          : "/api/scanupload";

        // Force a re-render to ensure toast is shown
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Show loading toast immediately
        const savingToast = showLoadingToast(
          isEditMode ? "Updating document..." : "Saving document..."
        );

        const response = await fetch(url, { method, body: formData });

        if (!response.ok) {
          let errorMessage = "HTTP error";
          try {
            const errorData = await response.json();
            errorMessage =
              errorData.error || `HTTP error! status: ${response.status}`;
          } catch (parseError) {
            errorMessage = `HTTP error! status: ${response.status}`;
          }
          throw new Error(errorMessage);
        }

        // Dismiss the loading toast and show a clean success toast
        if (savingToast) {
          dismissToast(savingToast);
          setTimeout(() => {
            showSuccessToast(
          isEditMode
            ? "Document updated successfully!"
            : "Document saved successfully!"
        );
          }, 100);
        } else {
          showSuccessToast(
            isEditMode
              ? "Document updated successfully!"
              : "Document saved successfully!"
          );
        }

        setTimeout(() => {
          clearAllState();
          onClose();
        }, 1500);
      } catch (error) {
        console.error("Submit error:", error);
        // Dismiss the loading toast and show error
        if (savingToast) {
          dismissToast(savingToast);
          setTimeout(() => {
            showErrorToast(
          `${isEditMode ? "Update" : "Upload"} failed: ${error.message}`
        );
          }, 100);
        } else {
          showErrorToast(
            `${isEditMode ? "Update" : "Upload"} failed: ${error.message}`
          );
        }
        return; // Stop execution here - don't continue with any success flows
      } finally {
        setIsLoading(false);
      }
    },
    [
      isEditMode,
      file,
      enhancedImage,
      selectedDepartment,
      subject,
      diaryNo,
      from,
      disposal,
      status,
      fileName,
      type,
      selectedCategory,
      date,
      extractedText,
      fileData,
      onClose,
    ]
  );

  if (isEditMode) {
    return (
      <div className="bg-zinc-800 p-10">
        <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-full sm:max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl text-center font-semibold mb-4 sm:mb-6">
            Edit Document
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">Current Document</h3>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="font-medium text-sm text-blue-900">
                    {fileData.fileName || fileData.subject}
                  </p>
                  <p className="text-xs text-blue-700">
                    Document ID: {fileData._id}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Replace Document (Optional)
              </label>
              <div
                className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  document.getElementById("edit-file-input").click()
                }
              >
                <UploadCloud size={24} className="text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm text-center">
                  Click to upload a new file (optional)
                </p>
                <input
                  id="edit-file-input"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile) {
                      handleFileChange(selectedFile);
                    }
                  }}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-3 text-green-500" />
                      <div>
                        <p className="font-medium text-sm text-green-900">
                          New file selected
                        </p>
                        <p className="text-xs text-green-700">
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setFileName(fileData.fileName);
                        setEnhancedImage(null);
                        setPdfPreviewData(null);
                      }}
                      className="text-green-500 hover:text-green-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Type</option>
                <option value="uni">University</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Department *
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
                disabled={departmentsLoading}
              >
                <option value="">
                  {departmentsLoading ? "Loading departments..." : "Select Department"}
                </option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {departmentsLoading && (
                <div className="mt-2 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                disabled={categoriesLoading || !selectedDepartment}
              >
                <option value="">
                  {!selectedDepartment 
                    ? "Select Department First" 
                    : categoriesLoading 
                    ? "Loading categories..." 
                    : "Select Category"}
                </option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {categoriesLoading && (
                <div className="mt-2 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Diary No *
                </label>
                <input
                  type="text"
                  value={diaryNo}
                  onChange={(e) => handleNumberOnlyInput(e, setDiaryNo)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">From *</label>
              <input
                type="text"
                value={from}
                onChange={(e) => handleAlphabetOnlyInput(e, setFrom)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Disposal *
              </label>
              <input
                type="text"
                value={disposal}
                onChange={(e) => handleAlphabetOnlyInput(e, setDisposal)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                clearAllState();
                onClose();
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Updating..."
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Update Document
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
  // UPLOAD MODE RENDER
  if (isUploadMode) {
    return (
      <div className="bg-zinc-800 p-4 sm:p-10">
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          document={enhancedImage}
          fileName={fileName}
          pdfPreviewData={pdfPreviewData}
        />{" "}
        <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-full sm:max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl text-center font-semibold mb-4 sm:mb-6">
            {action} Form
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">Document Upload</h3>

            <div className="flex flex-col gap-2 w-full">
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed bg-gray-100 rounded-lg cursor-pointer transition-all ${
                  isDragActive
                    ? "border-blue-500 bg-gray-200"
                    : "border-gray-400"
                }`}
                style={{ minHeight: "160px" }}
              >
                <input {...getInputProps()} />
                <UploadCloud size={36} className="text-gray-500 mb-2" />
                {isDragActive ? (
                  <p className="text-lg font-semibold text-blue-600">
                    Drop your file here...
                  </p>
                ) : (
                  <p className="text-gray-700 text-center">
                    Drag & Drop your PDF or Image here or{" "}
                    <span className="text-blue-500 font-medium">
                      click to browse
                    </span>
                  </p>
                )}
              </div>

              {file && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {file.type === "application/pdf" ? (
                        <div className="flex items-center">
                          {pdfPreviewData?.previewImage ? (
                            <img
                              src={`data:${pdfPreviewData.previewImage.mimeType};base64,${pdfPreviewData.previewImage.base64}`}
                              alt="PDF Preview"
                              className="w-8 h-8 mr-3 object-cover rounded border"
                            />
                          ) : (
                            <FileText className="w-5 h-5 mr-3 text-red-500" />
                          )}
                        </div>
                      ) : (
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt="Thumbnail"
                          className="w-8 h-8 mr-3 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{fileName}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                          {file.type === "application/pdf" &&
                            pdfPreviewData?.pageCount &&
                            ` • ${pdfPreviewData.pageCount} page${
                              pdfPreviewData.pageCount > 1 ? "s" : ""
                            }`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFileName("");
                          setEnhancedImage(null);
                          setExtractedText("");
                          setPdfPreviewData(null);
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {enhancedImage && !file && (
                <div className="mt-3">
                  <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={enhancedImage || "/placeholder.svg"}
                      alt="Enhanced document"
                      className="w-full h-auto max-h-56 object-contain mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEnhancedImage(null);
                        setExtractedText("");
                        setPdfPreviewData(null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form fields section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Type</option>
                <option value="uni">University</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Department *
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
                disabled={departmentsLoading}
              >
                <option value="">
                  {departmentsLoading ? "Loading departments..." : "Select Department"}
                </option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {departmentsLoading && (
                <div className="mt-2 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                disabled={categoriesLoading || !selectedDepartment}
              >
                <option value="">
                  {!selectedDepartment 
                    ? "Select Department First" 
                    : categoriesLoading 
                    ? "Loading categories..." 
                    : "Select Category"}
                </option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {categoriesLoading && (
                <div className="mt-2 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
                               {isExtracting && (
                   <div className="text-sm text-blue-500 flex items-center mt-1">
                     Extracting subject from document...
                   </div>
                 )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Diary No *
                </label>
                <input
                  type="text"
                  value={diaryNo}
                  onChange={(e) => handleNumberOnlyInput(e, setDiaryNo)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">From *</label>
              <input
                type="text"
                value={from}
                onChange={(e) => handleAlphabetOnlyInput(e, setFrom)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Disposal *
              </label>
              <input
                type="text"
                value={disposal}
                onChange={(e) => handleAlphabetOnlyInput(e, setDisposal)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {extractionFailed && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-yellow-700 flex-grow">
                  <p className="font-medium">Text Extraction Failed</p>
                  <p>There was a problem extracting text from this document.</p>
                  <button
                    type="button"
                    onClick={retryTextExtraction}
                    disabled={isExtracting}
                    className="mt-1 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md flex items-center text-xs font-medium"
                  >
                                         {isExtracting ? (
                       "Retrying..."
                     ) : (
                       <>
                         <RotateCcw className="w-3 h-3 mr-1" />
                         Retry Text Extraction
                       </>
                     )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                clearAllState();
                onClose();
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || (!file && !enhancedImage) || isExtracting}
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Document
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render step content for scanning mode
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Camera capture
        return (
          <div className="fixed inset-0 z-50 bg-black">
            <div className="relative w-full h-full">
              {isCameraActive && hasCameraPermission !== false ? (
                <Webcam
                  className="w-full h-full object-cover"
                  audio={false}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={1.0}
                  ref={(ref) => {
                    webcamRef.current = ref;
                    videoRef.current = ref && ref.video;
                  }}
                  width="100%"
                  height="100%"
                  playsInline
                  videoConstraints={{
                    facingMode: cameraFacingMode,
                    width: { ideal: 1920, min: 1280 },
                    height: { ideal: 1080, min: 720 },
                    advanced: [{ zoom: zoomLevel }],
                  }}
                  onUserMedia={initializeCamera}
                  onUserMediaError={(error) => {
                    console.warn(
                      "Webcam component error (handled):",
                      error.name
                    );
                    setHasCameraPermission(false);
                    setIsCameraActive(false);
                    showErrorToast(
                      "Camera access denied. Please allow camera access and try again."
                    );
                  }}
                />
              ) : null}



              {/* A4 Document frame guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="relative border-2 border-dashed border-white opacity-80 rounded-lg"
                  style={{
                    width: "70%",
                    height: "70%",
                    aspectRatio: "210/297",
                  }}
                >
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>

                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
                    Scan Document
                  </div>
                </div>
              </div>

              {/* Top controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <button
                  className="p-3 bg-black bg-opacity-50 rounded-full text-white"
                  onClick={onClose}
                  type="button"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                  {isTorchAvailable && (
                    <button
                      className={`p-3 rounded-full ${
                        isTorchOn
                          ? "bg-yellow-400 text-black"
                          : "bg-black bg-opacity-50 text-white"
                      }`}
                      onClick={toggleTorch}
                      type="button"
                    >
                      {isTorchOn ? (
                        <Zap className="w-6 h-6" />
                      ) : (
                        <ZapOff className="w-6 h-6" />
                      )}
                    </button>
                  )}
                  <button
                    className="p-3 bg-black bg-opacity-50 rounded-full text-white"
                    onClick={toggleCameraFacing}
                    type="button"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Bottom controls */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
                <button
                  className="p-4 bg-black bg-opacity-50 rounded-full text-white"
                  onClick={decreaseZoom}
                  type="button"
                >
                  <ZoomOut className="w-6 h-6" />
                </button>

                <button
                  className="w-20 h-20 bg-white border-4 border-blue-500 rounded-full shadow-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center"
                  onClick={captureAndProcess}
                  type="button"
                  disabled={isProcessing}
                >
                                     {isProcessing ? (
                     "Processing..."
                   ) : (
                     <Camera className="w-10 h-10 text-blue-600" />
                   )}
                </button>

                <button
                  className="p-4 bg-black bg-opacity-50 rounded-full text-white"
                  onClick={increaseZoom}
                  type="button"
                >
                  <ZoomIn className="w-6 h-6" />
                </button>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-32 left-0 right-0 text-center">
                <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg mx-4">
                  <p className="text-sm">Position document within frame</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Enhanced document view
        return (
          <div className="space-y-6 p-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Enhanced Document</h3>
              <p className="text-orange-600 text-sm">
                Automatic text extraction failed. Please complete the form
                manually.
              </p>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              {enhancedImage ? (
                <div className="flex justify-center p-4">
                  <img
                    src={enhancedImage || "/placeholder.svg"}
                    alt="Enhanced document"
                    className="max-w-full h-auto max-h-[70vh] object-contain border shadow-sm"
                    style={{ aspectRatio: "210/297" }}
                  />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No enhanced image available
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-sm font-medium">
                  Text extraction failed
                </p>
                <p className="text-orange-700 text-sm">
                  You can retry extraction or proceed to fill the form manually.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Retake Photo
                </button>

                <button
                  type="button"
                  onClick={retryTextExtraction}
                  disabled={!file || isExtracting}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                                     {isExtracting ? (
                     "Retrying..."
                   ) : (
                     <>
                       <RefreshCw className="w-5 h-5" />
                       Retry Extraction
                     </>
                   )}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <ChevronRight className="w-5 h-5" />
                  Skip to Form
                </button>
              </div>
            </div>
          </div>
        );

      case 2: // Text extraction view
        return (
          <div className="space-y-6 p-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Extracted Text</h3>
              <p className="text-gray-600 text-sm">
                Review and edit the extracted text if needed
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-medium">Extracted Text</label>
                {extractedText && (
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                )}
              </div>

              <div className="border rounded-lg bg-gray-50 h-64 p-3 overflow-auto">
                {extractedText ? (
                  <pre className="text-sm whitespace-pre-wrap">
                    {extractedText}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No text extracted
                  </div>
                )}
              </div>

              {extractedText && (
                <div className="text-sm text-gray-500">
                  Characters: {extractedText.length} | Words:{" "}
                  {
                    extractedText.split(/\s+/).filter((word) => word.length > 0)
                      .length
                  }
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 3: 
        return (
          <div className="space-y-6 px-2 py-4 sm:p-6">
            <DocumentPreviewModal
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              document={enhancedImage}
              fileName={fileName}
              pdfPreviewData={pdfPreviewData}
            />
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Complete Document Details
              </h3>
              <p className="text-gray-600 text-sm">
                Fill in the required information
              </p>
            </div>
            {enhancedImage && (
              <div className="flex justify-center mb-4">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Eye className="w-5 h-5" />
                  <span>
                    {pdfPreviewData
                      ? "PDF Document Preview"
                      : "Enhanced Document Preview"}
                  </span>
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Type *
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="uni">University</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Department *
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      required
                      disabled={departmentsLoading}
                    >
                      <option value="">
                        {departmentsLoading ? "Loading departments..." : "Select Department"}
                      </option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {departmentsLoading && (
                      <div className="mt-2 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category and Subject */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      disabled={categoriesLoading || !selectedDepartment}
                    >
                      <option value="">
                        {!selectedDepartment 
                          ? "Select Department First" 
                          : categoriesLoading 
                          ? "Loading categories..." 
                          : "Select Category"}
                      </option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {categoriesLoading && (
                      <div className="mt-2 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                                         {isExtracting && (
                       <div className="text-sm text-blue-500 flex items-center mt-2">
                         Extracting subject...
                       </div>
                     )}
                  </div>
                </div>

                {/* Date and Diary No - Side by side */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Diary No *
                    </label>
                    <input
                      type="text"
                      value={diaryNo}
                      onChange={(e) => handleNumberOnlyInput(e, setDiaryNo)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* From and Disposal */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      From *
                    </label>
                    <input
                      type="text"
                      value={from}
                      onChange={(e) => handleAlphabetOnlyInput(e, setFrom)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Disposal *
                    </label>
                    <input
                      type="text"
                      value={disposal}
                      onChange={(e) => handleAlphabetOnlyInput(e, setDisposal)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Status - Full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>{" "}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:flex-1 px-4 py-3.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Save Document
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  // Initial render - start camera button for scan mode
  if (!isCameraActive && currentStep === 0) {
    return (
      <div className="bg-zinc-800 min-h-screen p-4">
        <div className="bg-white rounded-lg max-w-md mx-auto p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">Scan Document</h2>
            <p className="text-gray-600">
              Create a professional scanned and enhanced document
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Advanced Scanning Features:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• AI-powered document enhancement with Sharp</li>
                <li>• Real OCR text extraction using Tesseract.js</li>
                <li>• Intelligent subject extraction from documents</li>
                <li>• PDF optimization and generation</li>
              </ul>
            </div>

            <button
              onClick={
                hasCameraPermission === false ? retryCamera : startCamera
              }
              disabled={isProcessing}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-medium"
            >
              <Camera className="w-6 h-6" />
              {hasCameraPermission === false
                ? "Allow Camera Access"
                : "Start Scanner"}
            </button>

            <button
              onClick={() => {
                clearAllState();
                onClose();
              }}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main component render for scan mode
  return (
    <div className="bg-zinc-800 min-h-screen">
      {currentStep === 0 ? (
        renderStepContent()
      ) : (
        <div className="min-h-screen">
          <div className="bg-white">
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={() => {
                  clearAllState();
                  onClose();
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">Document Scanner</h2>
              <div className="w-9" />
            </div>

            {renderStepContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanUpload;
