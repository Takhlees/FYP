"use client";

import { useState, useEffect, useRef } from "react";
import ScanUpload from "./ScanUpload";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import ChatBot from "@components/ChatBot";
import { Upload, Scan } from "lucide-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [action, setAction] = useState("");
  const [selectedMail, setSelectedMail] = useState(null);
  const [overDueMails, setOverDueMails] = useState([]);
  const [recentMails, setRecentMails] = useState([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [recentError, setRecentError] = useState(null);
  const [showOverdueMails, setShowOverdueMails] = useState(false);
  const router = useRouter();
  const [displayText, setDisplayText] = useState("");
  const credibilityWords = ["Simple", "Efficient", "Secure"];
  const timeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isStatusUpdated, setIsStatusUpdated] = useState(false);

  const uploadScanRef = useRef(null);
  const recentActivityRef = useRef(null);


  const [hasShownLoginSuccess, setHasShownLoginSuccess] = useState(false);
  const [isFreshLogin, setIsFreshLogin] = useState(false);

  // Function to fetch overdue mails
  const fetchOverdueMails = async () => {
    try {
      const response = await fetch("/api/reminder", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setOverDueMails(data.overdueMails || []);
    } catch (error) {
      console.error("Error fetching overdue mails:", error);
    }
  };

  // Function to fetch recent mails
  const fetchRecentMails = async () => {
    try {
      setIsLoadingRecent(true);
      const response = await fetch("/api/recent");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();
      setRecentMails(data);
    } catch (error) {
      setRecentError(error.message);
      setRecentMails([]); // Reset to empty array on error
    } finally {
      setIsLoadingRecent(false);
    }
  };

  useEffect(() => {
    if (showForm || selectedMail) {
      // Get current scroll bar width to prevent layout shift
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [showForm, selectedMail]);

  // Effect for session check and fetching overdue mails
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        if (!session) {
          router.push("/");
        } else {
          // Check if this is a fresh login by checking URL parameters or session timestamp
          const urlParams = new URLSearchParams(window.location.search);
          const fromLogin = urlParams.get('from') === 'login';
          
          if (fromLogin) {
            setIsFreshLogin(true);
            // Remove the parameter to prevent showing on refresh
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();

    fetchOverdueMails();
    fetchRecentMails();
  }, [router]);

  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 1500;

    let currentIndex = 0;
    let charIndex = 0;
    let isTyping = true;

    const typeOrDelete = () => {
      const currentWord = credibilityWords[currentIndex];

      if (isTyping) {
        if (charIndex < currentWord.length) {
          setDisplayText(currentWord.slice(0, charIndex + 1));
          charIndex++;
          timeoutRef.current = setTimeout(typeOrDelete, typingSpeed);
        } else {
          timeoutRef.current = setTimeout(() => {
            isTyping = false;
            typeOrDelete();
          }, pauseDuration);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentWord.slice(0, charIndex - 1));
          charIndex--;
          timeoutRef.current = setTimeout(typeOrDelete, deletingSpeed);
        } else {
          currentIndex = (currentIndex + 1) % credibilityWords.length;
          isTyping = true;
          typeOrDelete();
        }
      }
    };

    typeOrDelete();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMailClick = async (mail) => {
    setSelectedMail(mail);
  };

  const handleOpenUpload = () => {
    setAction("Upload");
    setShowForm(true);
  };

  const handleOpenScan = () => {
    setAction("Scan");
    setShowForm(true);
  };

  // Add navigation functions for Quick Actions
  const handleQuickActionClick = (actionType) => {
    switch (actionType) {
      case 'recent':
        // Scroll to Recent Activity section with offset for navbar
        setTimeout(() => {
          const element = recentActivityRef.current;
          if (element) {
            const yOffset = -80; // Offset for navbar/spacing
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
        break;
      case 'upload-scan':
        // Scroll to upload/scan section (hero section with buttons)
        setTimeout(() => {
          const element = uploadScanRef.current;
          if (element) {
            const yOffset = -100; // Offset for better centering
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
        break;

      case 'overdue':
        // Toggle the overdue mails panel
        setShowOverdueMails((prev) => !prev);
        break;
      default:
        break;
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    console.log("Starting status change to:", newStatus);
    let successShown = false; // Track if success was shown

    try {
      setIsStatusUpdating(true);
      setIsStatusUpdated(false); // Reset success state at the start
      console.log("Status update started, loading state set");
      
      const response = await fetch(
        `/api/reminder/${selectedMail._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedMail = await response.json();
      console.log("Updated mail received:", updatedMail);
      
      // Update the selectedMail state to show the new status immediately
      setSelectedMail(updatedMail);
      
      // Update overdue mails array
      setOverDueMails((prevMails) =>
        prevMails.map((mail) =>
          mail._id === updatedMail._id ? updatedMail : mail
        )
      );

      // Update recent mails array
      setRecentMails((prevMails) =>
        prevMails.map((mail) =>
          mail._id === updatedMail._id ? updatedMail : mail
        )
      );

      console.log("Local arrays updated, refreshing data sources");

      // Refresh both data sources to ensure consistency
      await Promise.all([
        fetchOverdueMails(),
        fetchRecentMails()
      ]);
      
      console.log("Data sources refreshed, setting success state");
      
      // Set success state and show toast only after everything is successful
      setIsStatusUpdated(true);
      successShown = true; // Mark that success was shown
      
      // Small delay to ensure no race conditions
      setTimeout(() => {
        showSuccessToast("Status Updated", `Mail status changed to ${newStatus}`);
      }, 100);
      
      // Close the dialog after a short delay to show the success
      setTimeout(() => {
        console.log("Closing dialog after success");
        setSelectedMail(null);
        setIsStatusUpdated(false);
      }, 1500);

    } catch (error) {
      console.error("Error in status change:", error);
      
      // Only show error toast if we haven't already shown success
      if (!successShown) {
        showErrorToast("Update Failed", "Failed to update mail status. Please try again.");
      }
      
      // Ensure success state is false
      setIsStatusUpdated(false);
    } finally {
      console.log("Status change completed, resetting loading state");
      setIsStatusUpdating(false);
    }
  };

  const handleViewPDF = async () => {
    try {
      setPdfLoading(true);
      setPdfError(null);

      const endpoint = selectedMail.isOverdue
        ? `/api/reminder/${selectedMail._id}`
        : `/api/recent/${selectedMail._id}`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("PDF not available");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      setPdfError(error.message);
    } finally {
      setPdfLoading(false);
    }
  };
  useEffect(() => {
    const bubbles = document.querySelectorAll(".animate-bubble");
    bubbles.forEach((bubble) => {
      const randomTop = Math.random() * 100 + "%";
      const randomLeft = Math.random() * 100 + "%";
      bubble.style.top = randomTop;
      bubble.style.left = randomLeft;
    });
    }, []);



  // Effect for showing login success toast only after fresh login
  useEffect(() => {
    if (isFreshLogin && !hasShownLoginSuccess && !isLoading) {
      // Show login success toast only once after fresh login
      showSuccessToast("Login Successful", "You have been logged in successfully.");
      setHasShownLoginSuccess(true);
      setIsFreshLogin(false); // Reset to prevent showing on refresh
    }
  }, [isFreshLogin, hasShownLoginSuccess, isLoading]);

  return (
    <>      {showForm ? (
        <div className="fixed inset-0 z-50 overflow-auto">
          <ScanUpload action={action} onClose={() => setShowForm(false)} />
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          
          {selectedMail && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001] p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-blue-600 text-white px-4 sm:px-6 py-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Mail Details</h2>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm">
                      {selectedMail.subject}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={selectedMail.status}
                        onChange={handleStatusChange}
                        disabled={isStatusUpdating}
                        className={`w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm ${
                          isStatusUpdating ? 'opacity-50 cursor-not-allowed' : ''
                        }`}>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="in-progress">In Progress</option>
                      </select>
                      {isStatusUpdating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-700 bg-opacity-75 rounded-md">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                    </div>
                    {isStatusUpdating && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Updating status...
                      </p>
                    )}
                    {isStatusUpdated && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Status updated successfully!
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm">
                      {selectedMail.category || "Not specified"}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={handleViewPDF}
                      disabled={pdfLoading}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm ${
                        pdfLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}>
                      {pdfLoading ? (
                        <span className="flex items-center justify-center">
                          <PulseLoader
                            color="#ffffff"
                            size={6}
                            className="mr-2"
                          />
                          Loading PDF...
                        </span>
                      ) : (
                        "View PDF" 
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMail(null);
                        setPdfError(null);
                        setIsStatusUpdated(false);
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-black dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm">
                      Close
                    </button>
                  </div>
                  {pdfError && (
                    <div className="mt-4 text-red-500 text-sm">{pdfError}</div>
                  )}
                </div>
              </div>
            </div>
          )}
            <div className="flex-grow w-full flex flex-col items-center px-4 sm:px-8 lg:px-14 py-2 sm:py-8 lg:py-14">
            {/* Header Section */}
            <div className="flex items-center justify-center min-h-[100vh] sm:min-h-screen w-full pt-4 sm:pt-0" ref={uploadScanRef}>
              <div className="text-center mx-auto mb-12 transform -translate-y-20 sm:-translate-y-16 lg:-translate-y-20">
                <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4 leading-tight px-4">
                  <span className="inline-block">Modern Document</span>
                  <br />
                  <span className="inline-block">Management Made</span>{" "}
                  <span
                    className="inline-block bg-gradient-to-r from-black via-mid to-light dark:from-white dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent"
                    style={{ minWidth: "80px", textAlign: "left" }}>
                    {displayText}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 px-4 max-w-2xl mx-auto">
                  Streamline your workflow with our intelligent file management
                  system.
                </p>
                <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
                  <button
                    onClick={handleOpenUpload}
                    className="flex items-center justify-center gap-2 px-6 sm:px-10 py-2.5 sm:py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg shadow-md text-base sm:text-lg font-medium relative group text-center transition-transform transform hover:scale-105 duration-300 cursor-pointer w-full sm:w-auto">
                    <Upload size={18} className="dark:stroke-black" /> Upload
                  </button>
                  <button
                    onClick={handleOpenScan}
                    className="flex items-center justify-center gap-2 px-6 sm:px-10 py-2.5 sm:py-2 bg-gray-200 dark:bg-gray-600 text-black dark:text-white rounded-lg shadow-md text-base sm:text-lg font-medium relative group text-center transition-transform transform hover:scale-105 duration-300 cursor-pointer w-full sm:w-auto hover:bg-gray-300 dark:hover:bg-gray-500">
                    <Scan size={18} className="dark:stroke-white" /> Scan
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="w-full max-w-6xl mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 lg:mb-10 w-full px-4">
                <span className="bg-gradient-to-r from-black via-mid to-light dark:from-white dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent">
                  Quick Actions
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 px-4">
                <div 
                  className="relative group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 lg:hover:scale-110 duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
                  onClick={() => handleQuickActionClick('recent')}
                >
                  <svg
                    className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-base sm:text-lg font-medium text-black dark:text-white mb-2">
                    Recent Files
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    Access your recently viewed documents
                  </p>
                </div>
                <div 
                  className="relative group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 lg:hover:scale-110 duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
                  onClick={() => handleQuickActionClick('upload-scan')}
                >
                  <svg
                    className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <h3 className="text-base sm:text-lg font-medium text-black dark:text-white mb-2">
                    Upload and Scan
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    Easily upload and scan your documents effectively
                  </p>
                </div>
                <div 
                  className="relative group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 lg:hover:scale-110 duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-1"
                  onClick={() => handleQuickActionClick('overdue')}
                >
                  <svg
                    className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-base sm:text-lg font-medium text-black dark:text-white mb-2">
                    Overdue Mails
                    {overDueMails.length > 0 && (
                      <span className="ml-2 text-red-500 font-bold">!</span>
                    )}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    View and manage overdue mails 
                  </p>
                </div>
              </div>
            </div>

            {/* Powerful Features Section */}
            <div className="w-full max-w-6xl mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 lg:mb-10 w-full px-4">
                <span className="bg-gradient-to-r from-black via-mid to-light dark:from-white dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent">
                  Powerful Features
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 px-4">
                <div className="relative group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 lg:hover:scale-110 duration-300 cursor-pointer border border-gray-200 dark:border-gray-700">
                  <svg
                    className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-base sm:text-lg font-medium text-black dark:text-white mb-2">
                    Smart Organization
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    Organize documents automatically by selecting relevant
                    department and category.
                  </p>
                </div>
                <div className="relative group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 lg:hover:scale-110 duration-300 cursor-pointer border border-gray-200 dark:border-gray-700">
                  <svg
                    className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 3.055A9.001 9.001 0 1019.945 13H11V3.055z"
                    />
                  </svg>
                  <h3 className="text-base sm:text-lg font-medium text-black dark:text-white mb-2">
                    OCR Text Extraction
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    Extract and manage text from documents efficiently.
                  </p>
                </div>
                <div className="relative group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 lg:hover:scale-110 duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
                  <svg
                    className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-base sm:text-lg font-medium text-black dark:text-white mb-2">
                    File Management
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    Upload, view, and retrieve documents seamlessly in one
                    place.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="w-full max-w-6xl mb-12 px-4" ref={recentActivityRef}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-left w-full">
                  <span className="bg-gradient-to-r from-black via-mid to-light dark:from-white dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent">
                    Recent Activity
                  </span>
                </h2>
              </div>

              {isLoadingRecent ? (
                <div className="flex justify-center py-8">
                  <PulseLoader
                    color="#d2d4d6"
                    size={17}
                    speedMultiplier={0.7}
                  />
                </div>
              ) : recentError ? (
                <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg text-left text-sm">
                  {recentError}
                </div>
              ) : Array.isArray(recentMails) && recentMails.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {recentMails.map((mail) => (
                    <div
                      key={mail._id}
                      className="bg-white dark:bg-gray-800 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300 cursor-pointer text-left border border-gray-200 dark:border-gray-700"
                      onClick={() => handleMailClick(mail)}>
                      <div className="flex-1 mb-2 sm:mb-0">
                        <p className="text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base">
                          {mail.subject}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
                          {mail.status === "open"
                            ? "New mail received"
                            : mail.status === "in-progress"
                            ? "Mail in progress"
                            : "Mail resolved"}
                        </p>
                      </div>
                      <div className="sm:ml-4 text-left sm:text-right min-w-[120px]">
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                          {new Date(mail.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-left border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity found</p>
                </div>
              )}
            </div>
          </div>

          {pdfError && (
            <div className="fixed bottom-4 right-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base max-w-xs sm:max-w-sm">
              <span className="block sm:inline">{pdfError}</span>
              <button
                className="absolute top-0 right-0 px-2 py-1 text-lg"
                onClick={() => setPdfError(null)}>
                ×
              </button>
            </div>
          )}         
          <div 
            className="fixed right-4 sm:right-5 bottom-6 sm:bottom-12 md:bottom-10 z-50 flex flex-col items-end space-y-3 transition-all duration-300"
          >
            {/* Chat Button */}
            <div
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg text-sm sm:text-lg font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap"
               onClick={() => {
                 setShowChat(true);
                 if (showOverdueMails) {
                   setShowOverdueMails(false);
                 }
               }}>
              <span className="text-lg sm:text-xl">💬</span>
              <span className="hidden sm:inline">Let's Chat</span>
              <span className="sm:hidden">Chat</span>
            </div>
            
            <div
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 w-72 sm:w-80 md:w-96 max-w-[calc(100vw-2rem)]"
              onClick={() => setShowOverdueMails(!showOverdueMails)}
            >
              <div
                className={`p-3 sm:p-4 font-medium text-base sm:text-lg flex justify-between items-center transition-all duration-300 ${
                  showOverdueMails ? "border-b border-gray-100 dark:border-gray-600" : ""
                }`}
              >
                <span className="flex items-center flex-1 min-w-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-500 transition-transform duration-300 flex-shrink-0 ${
                      showOverdueMails ? "rotate-12" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm sm:text-lg truncate text-gray-900 dark:text-gray-100">
                    Overdue Mails
                  </span>
                  {overDueMails.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse flex-shrink-0">
                      {overDueMails.length}
                    </span>
                  )}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                    showOverdueMails ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>              <div
                className={`overflow-hidden overflow-x-hidden transition-all duration-500 ease-in-out ${
                  showOverdueMails 
                    ? "max-h-64 sm:max-h-72 opacity-100" 
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className={`
                  p-2 sm:p-3 transform transition-all duration-300 ${
                    showOverdueMails 
                      ? "translate-y-0 scale-100" 
                      : "-translate-y-4 scale-95"
                  }`}>
                  {overDueMails.length > 0 ? (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-600 space-y-1 max-h-48 sm:max-h-56 overflow-y-auto overflow-x-hidden">
                      {overDueMails.map((mail, index) => (
                        <li
                          key={mail._id}
                          className={`py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-all duration-300 cursor-pointer transform hover:scale-102 hover:shadow-sm ${
                            showOverdueMails 
                              ? "translate-x-0 opacity-100" 
                              : "translate-x-4 opacity-0"
                          }`}
                          style={{
                            transitionDelay: showOverdueMails ? `${index * 50}ms` : '0ms',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMailClick(mail);
                          }}
                        >
                          <div className="font-medium text-gray-800 dark:text-gray-200 text-xs sm:text-sm transition-colors duration-200 truncate">
                            {mail.subject}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                            <span
                              className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 transition-all duration-300 flex-shrink-0 ${
                                mail.status === "open"
                                  ? "bg-red-500 animate-pulse"
                                  : mail.status === "in-progress"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            ></span>
                            <span className="truncate">{mail.status}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`text-center py-3 text-gray-500 dark:text-gray-400 text-xs sm:text-sm transition-all duration-300 ${
                      showOverdueMails 
                        ? "translate-y-0 opacity-100" 
                        : "translate-y-2 opacity-0"
                    }`}>
                      No overdue mails
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {showChat && (
            <ChatBot onClose={() => setShowChat(false)} />
                    )}

          <Footer />
        </div>
      )}
    </>
  );
}