"use client";

import { useState, useEffect, useRef } from "react";
import ScanUpload from "./ScanUpload";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { Upload , Scan } from "lucide-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";

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

  // Add these state variables that were missing
  const [isScanning, setIsScanning] = useState(false);
  const [isFullScreenScanning, setIsFullScreenScanning] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  // Effect for session check and fetching overdue mails
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        if (!session) {
          router.push("/");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();

    async function fetchOverdueMails() {
      try {
        setIsLoading(false);
        const response = await fetch("http://localhost:3000/api/reminder", {
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
        console.error("Failed to fetch overdue mails", error);
      }
    }

    fetchOverdueMails();
  }, [router]);

  useEffect(() => {
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
        console.error("Fetch error:", error);
        setRecentError(error.message);
        setRecentMails([]); // Reset to empty array on error
      } finally {
        setIsLoadingRecent(false);
      }
    };

    fetchRecentMails();
  }, []);

  // Effect for typing animation
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

  // Updated handleOpenForm function
  // const handleOpenForm = (actionType) => {
  //   setAction(actionType);
  //   setShowForm(true);
  //   setIsScanning(true);
  //   setIsFullScreenScanning(true);
  //   setProcessedImage(null);
  //   setIsApproved(false);
  //   setExtractedText("");
  // };

  const handleOpenUpload = () => {
    setAction("Upload");
    setShowForm(true);
    // Reset states for upload (no scanning states)
    setIsScanning(false);
    setIsFullScreenScanning(false);
    setProcessedImage(null);
    setIsApproved(false);
    setExtractedText("");
  };

  const handleOpenScan = () => {
    setAction("Scan");
    setShowForm(true);
    // Set scanning states for scan
    setIsScanning(true);
    setIsFullScreenScanning(true);
    setProcessedImage(null);
    setIsApproved(false);
    setExtractedText("");
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      const response = await fetch(
        `http://localhost:3000/api/reminder/${selectedMail._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            // Android-specific headers
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedMail = await response.json();
      setOverDueMails((prevMails) =>
        prevMails.map((mail) =>
          mail._id === updatedMail._id ? updatedMail : mail
        )
      );

      setSelectedMail(null);
    } catch (error) {
      console.error("Failed to update mail status:", error);
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

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <PulseLoader color="#e1e4e8" size={17} speedMultiplier={0.8} />
        </div>
      )}

      {showForm ? (
        <div className="z-50 bg-white">
          <ScanUpload action={action} onClose={() => setShowForm(false)} />
        </div>
      ) : (
        
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          {/* Floating Box for Overdue Mails */}
          
          
          {selectedMail && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-4">
                  <h2 className="text-xl font-semibold">Mail Details</h2>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      {selectedMail.subject}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={selectedMail.status}
                      onChange={handleStatusChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      {selectedMail.category || "Not specified"}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleViewPDF}
                      disabled={pdfLoading}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        pdfLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {pdfLoading ? (
                        <span className="flex items-center">
                          <PulseLoader
                            color="#ffffff"
                            size={8}
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
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
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
          <div className="flex-grow w-full flex flex-col items-center p-14">
            {/* Header Section */}
            <div className="flex items-center justify-center h-screen">
              <div className="text-center mx-auto mb-12 transform -translate-y-20">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight ">
                  <span className="inline-block">Modern Document</span>
                  <br />
                  <span className="inline-block">Management Made</span>{" "}
                  <span
                    className="inline-block bg-gradient-to-r from-black via-mid to-light bg-clip-text text-transparent"
                    style={{ minWidth: "120px", textAlign: "left" }}
                  >
                    {displayText}
                  </span>
                </h1>
                <p className="text-lg text-secondary">
                  Streamline your workflow with our intelligent file management
                  system.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                  <button
                    onClick={handleOpenUpload} // Changed from handleOpenForm("Upload")
                    className="flex items-center gap-2 px-10 py-2 bg-black text-white rounded-lg shadow-md text-lg font-medium relative group text-center transition-transform transform hover:scale-110 duration-300 cursor-pointer"
                  >
                    <Upload size={20} /> Upload
                  </button>
                  <button
                    onClick={handleOpenScan} // Changed from handleOpenForm("Scan")
                    className="flex items-center gap-2 px-10 py-2 bg-gray-200 text-black rounded-lg shadow-md text-lg font-medium relative group text-center transition-transform transform hover:scale-110 duration-300 cursor-pointer"
                  >
                    <Scan size={20} /> Scan
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="w-full max-w-6xl mb-12">
              <h2 className="text-3xl font-bold text-center mb-10 w-full">
                <span className="bg-gradient-to-r from-black via-mid to-light bg-clip-text text-transparent">
                  Quick Actions
                </span>
              </h2>{" "}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="relative group bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-110 duration-300 cursor-pointer">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-black">
                    Recent Files
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Access your recently viewed documents
                  </p>
                </div>
                <div className="relative group bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-110 duration-300 cursor-pointer">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-black">
                    Upload and Scan
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Easily upload and scan your documents effectively
                  </p>
                </div>
                <div className="relative group bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-110 duration-300 cursor-pointer">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-black">
                    Search Files
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Quickly find documents with smart search filters.
                  </p>
                </div>
                <div className="relative group bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-110 duration-300 cursor-pointer">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-black">
                    Browse Files
                  </h3>
                  <p className="text-gray-500 text-sm">
                    View all your uploaded files sorted by departments and
                    categories.
                  </p>
                </div>
              </div>
            </div>

            {/* Powerful Features Section */}
            <div className="w-full max-w-6xl mb-12">
              <h2 className="text-3xl font-bold text-center mb-10 w-full">
                <span className="bg-gradient-to-r from-black via-mid to-light bg-clip-text text-transparent">
                  Powerful Features
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="brelative group bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-110 duration-300 cursor-pointer">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-black">
                    Smart Organization
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Organize documents automatically by selecting relevant
                    department and category.
                  </p>
                </div>
                <div className="relative group bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-110 duration-300 cursor-pointer">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 3.055A9.001 9.001 0 1019.945 13H11V3.055z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-black">
                    OCR Text Extraction
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Extract and manage text from documents efficiently.
                  </p>
                </div>
                <div className="relative group bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-110 duration-300 cursor-pointer">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-black">
                    File Management
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Upload, view, and retrieve documents seamlessly in one
                    place.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="w-full max-w-6xl mb-12">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold mb-8 text-left w-full">
                  <span className="bg-gradient-to-r from-black via-mid to-light bg-clip-text text-transparent">
                    Recent Activity
                  </span>
                </h2>
              </div>

              {isLoadingRecent ? (
                <div className="flex justify-center">
                  <PulseLoader
                    color="#6b7280"
                    size={10}
                    speedMultiplier={0.7}
                  />
                </div>
              ) : recentError ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-left">
                  {recentError}
                </div>
              ) : Array.isArray(recentMails) && recentMails.length > 0 ? (
                <div className="space-y-4">
                  {recentMails.map((mail) => (
                    <div
                      key={mail._id}
                      className="bg-white p-4 flex items-center justify-between rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300 cursor-pointer text-left"
                      onClick={() => handleMailClick(mail)}
                    >
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          {mail.subject}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {mail.status === "open"
                            ? "New mail received"
                            : mail.status === "in-progress"
                            ? "Mail in progress"
                            : "Mail resolved"}
                        </p>
                      </div>
                      <div className="ml-4 text-right min-w-[120px]">
                        <p className="text-gray-500 text-sm">
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
                <div className="bg-white p-4 rounded-lg shadow-md text-left">
                  <p className="text-gray-500">No recent activity found</p>
                </div>
              )}
            </div>
          </div>

          {pdfError && (
            <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <span className="block sm:inline">{pdfError}</span>
              <button
                className="absolute top-0 right-0 px-2 py-1"
                onClick={() => setPdfError(null)}
              >
                ×
              </button>
            </div>
          )}
        <div className="sticky bottom-5 z-50 w-fit ml-auto mr-5 mb-5">
            <div
              className="bg-white border border-gray-200 rounded-lg shadow-lg cursor-pointer transition-all hover:shadow-xl"
              onClick={() => setShowOverdueMails(!showOverdueMails)}
            >
              <div
                className={`p-4 font-semibold text-lg flex justify-between items-center ${
                  showOverdueMails ? "border-b border-gray-100" : ""
                }`}
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Overdue Mails
                  {overDueMails.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {overDueMails.length}
                    </span>
                  )}
                </span>
                {showOverdueMails && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOverdueMails(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {showOverdueMails && (
                <div className="max-h-80 overflow-y-auto p-2">
                  {overDueMails.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {overDueMails.map((mail) => (
                        <li
                          key={mail._id}
                          className="py-3 px-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                          onClick={() => handleMailClick(mail)}
                        >
                          <div className="font-medium text-gray-800">
                            {mail.subject}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 flex items-center">
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                mail.status === "open"
                                  ? "bg-red-500"
                                  : mail.status === "in-progress"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            ></span>
                            Status: {mail.status}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center py-4 text-gray-500">
                      No overdue mails found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}
