// "use client";

// import { useState, useEffect } from "react";
// import ScanUpload from "./ScanUpload";
// import Navbar from "@components/Navbar";
// import Footer from "@components/Footer";
// import { getSession } from "next-auth/react";
// import { useRouter } from "next/router";

// export default function Home() {
//   const [showForm, setShowForm] = useState(false);
//   const [action, setAction] = useState("");
//   const [overDueMails, setOverDueMails] = useState([]);
//   const router = useRouter();

//   // Check session and redirect if not authenticated
//   useEffect(() => {
//     const checkSession = async () => {
//       const session = await getSession();

//       if (!session) {
//         router.push("/"); // Redirect to home if no session
//       }
//     };
//     checkSession();

//     async function fetchOverdueMails() {
//       try {
//         const response = await fetch("http://localhost:3000/api/reminder", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.overDueMails) {
//           const data = await response.json();
//           console.log("mails:",data);
//           setOverDueMails(data.overDueMails);
//         }
//       } catch (error) {
//         console.error("Failed to fetch overdue mails", error);
//       }
//     }

//     fetchOverdueMails();
//   }, [router]);

//   const handleOpenForm = (actionType) => {
//     setAction(actionType);
//     setShowForm(true);
//   };

//   return (
//     <>
//       {showForm ? (
//         <div>
//           {showForm && (
//             <div>
//               <ScanUpload action={action} onClose={() => setShowForm(false)} />
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="flex flex-col min-h-screen">
//           <Navbar />
//           <div className="flex-grow w-full flex flex-col items-center p-8">
//             <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//               Welcome to File Management System
//             </h1>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => handleOpenForm("Scan")}
//                 className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 block lg:hidden text-lg font-medium"
//               >
//                 Scan
//               </button>
//               <button
//                 onClick={() => handleOpenForm("Upload")}
//                 className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200 text-lg font-medium"
//               >
//                 Upload
//               </button>
//             </div>
//           </div>
//           <div>
//             <h1>Mail Notifications</h1>
//             {overDueMails.length > 0 ? (
//               <div style={{ color: "red" }}>
//                 <h2>Notifications</h2>
//                 <p>You have {overDueMails.length} overdue mails:</p>
//                 <ul>
//                   {overDueMails.map((mail) => (
//                     <li key={mail._id}>
//                       <strong>{mail.subject}</strong> - Created on:{" "}
//                       {new Date(mail.createdAt).toLocaleDateString()}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <p>No overdue mails.</p>
//             )}
//           </div>
//           <Footer />
//         </div>
//       )}
//     </>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import ScanUpload from "./ScanUpload";
// import Navbar from "@components/Navbar";
// import Footer from "@components/Footer";
// import { getSession } from "next-auth/react";
// import { useRouter } from "next/router";

// export default function Home() {
//   const [showForm, setShowForm] = useState(false);
//   const [action, setAction] = useState("");
//   const [selectedMail, setSelectedMail] = useState(null);
//   const [overDueMails, setOverDueMails] = useState([]);
//   const [showOverdueMails, setShowOverdueMails] = useState(false);
//   const router = useRouter();

//   // Check session and redirect if not authenticated
//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const session = await getSession();
//         if (!session) {
//           router.push("/"); // Redirect to home if no session
//         }
//       } catch (error) {
//         console.error("Session check failed:", error);
//       }
//     };
//     checkSession();

//     // Fetch overdue mails
//     async function fetchOverdueMails() {
//       try {
//         console.log("Fetching overdue mails...");
//         const response = await fetch("http://localhost:3000/api/reminder", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         console.log("Response Status:", response.status);
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("API Data:", data); // Debugging line
//         setOverDueMails(data.overdueMails || []); // Ensure it's an array
//       } catch (error) {
//         console.error("Failed to fetch overdue mails", error);
//       }
//     }

//     fetchOverdueMails();
//   }, [router]);

//   const handleMailClick = (mail) => {
//     setSelectedMail(mail); // Set the selected mail
//   };

//   const handleStatusChange = async (e) => {
//     const newStatus = e.target.value;

//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/reminder/${selectedMail._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Update the local state with the updated mail
//       const updatedMail = await response.json();
//       setOverDueMails((prevMails) =>
//         prevMails.map((mail) =>
//           mail._id === updatedMail._id ? updatedMail : mail
//         )
//       );

//       setSelectedMail(null);
//     } catch (error) {
//       console.error("Failed to update mail status:", error);
//     }
//   };

//   const handleViewPDF = () => {
//     if (selectedMail?.pdfUrl) {
//       window.open(selectedMail.pdfUrl, "_blank"); // Open PDF in a new tab
//     } else {
//       alert("No PDF available for this mail.");
//     }
//   };

//   const handleOpenForm = (actionType) => {
//     setAction(actionType);
//     setShowForm(true);
//   };

//   return (
//     <>
//       {showForm ? (
//         <div>
//           {showForm && (
//             <div>
//               <ScanUpload action={action} onClose={() => setShowForm(false)} />
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="flex flex-col min-h-screen">
//           <Navbar />
//           {/* Floating Box for Overdue Mails */}
//           <div
//             style={{
//               position: "fixed",
//               bottom: "20px",
//               right: "20px",
//               zIndex: 1000,
//             }}
//           >
//             <div
//               style={{
//                 backgroundColor: "#fff",
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                 cursor: "pointer",
//                 position: "relative", // Ensures the close button is positioned inside
//               }}
//               onClick={() => setShowOverdueMails(!showOverdueMails)} // Toggle visibility
//             >
//               {/* Header Section with Close Button */}
//               <div
//                 style={{
//                   padding: "25px 30px",
//                   fontSize: "large",
//                   fontWeight: "bold",
//                   borderBottom: showOverdueMails ? "1px solid #eee" : "none",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <span>Overdue Mails</span>
//                 {showOverdueMails && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent parent onClick from triggering
//                       setShowOverdueMails(false);
//                     }}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       fontSize: "20px",
//                       cursor: "pointer",
//                       color: "gray",
//                     }}
//                   >
//                     ✖
//                   </button>
//                 )}
//               </div>

//               {/* List of Overdue Mails */}
//               {showOverdueMails && (
//                 <div
//                   style={{
//                     maxHeight: "300px",
//                     overflowY: "auto",
//                     padding: "8px",
//                   }}
//                 >
//                   {overDueMails.length > 0 ? (
//                     <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//                       {overDueMails.map((mail) => (
//                         <li
//                           key={mail._id}
//                           style={{
//                             marginBottom: "8px",
//                             padding: "8px",
//                             borderBottom: "1px solid #eee",
//                             cursor: "pointer",
//                           }}
//                           onClick={() => handleMailClick(mail)} // Handle click on mail
//                         >
//                           <div style={{ fontWeight: "500" }}>
//                             {mail.subject}
//                           </div>
//                           <div style={{ fontSize: "14px", color: "#666" }}>
//                             Status: {mail.status}
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No overdue mails found.</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {selectedMail && (
//             <div
//               style={{
//                 position: "fixed",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 backgroundColor: "#fff",
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 padding: "20px",
//                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                 zIndex: 1001,
//                 width: "300px",
//               }}
//             >
//               <h2
//                 style={{
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   marginBottom: "12px",
//                 }}
//               >
//                 Mail Details
//               </h2>
//               <div style={{ marginBottom: "12px" }}>
//                 <strong>Subject:</strong> {selectedMail.subject}
//               </div>
//               <div style={{ marginBottom: "12px" }}>
//                 <strong>Status:</strong>
//                 <select
//                   value={selectedMail.status}
//                   onChange={handleStatusChange}
//                   style={{
//                     marginLeft: "8px",
//                     padding: "4px",
//                     borderRadius: "4px",
//                     border: "1px solid #ccc",
//                   }}
//                 >
//                   <option value="open">Open</option>
//                   <option value="closed">Closed</option>
//                   <option value="in-progress">In Progress</option>
//                 </select>
//               </div>
//               <button
//                 onClick={handleViewPDF}
//                 style={{
//                   padding: "8px 16px",
//                   backgroundColor: "#007bff",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   marginRight: "8px",
//                 }}
//               >
//                 View PDF
//               </button>
//               <button
//                 onClick={() => setSelectedMail(null)} // Close the modal
//                 style={{
//                   padding: "8px 16px",
//                   backgroundColor: "#ccc",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//           )}

//           <div className="flex-grow w-full flex flex-col items-center p-8">
//             <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//               Welcome to File Management System
//             </h1>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => handleOpenForm("Scan")}
//                 className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 block lg:hidden text-lg font-medium"
//               >
//                 Scan
//               </button>
//               <button
//                 onClick={() => handleOpenForm("Upload")}
//                 className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200 text-lg font-medium"
//               >
//                 Upload
//               </button>
//             </div>
//           </div>
//           <Footer />
//         </div>
//       )}
//     </>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import ScanUpload from "./ScanUpload";
// import Navbar from "@components/Navbar";
// import Footer from "@components/Footer";
// import { getSession } from "next-auth/react";
// import { useRouter } from "next/router";

// export default function Home() {
//   const [showForm, setShowForm] = useState(false);
//   const [action, setAction] = useState("");
//   const [selectedMail, setSelectedMail] = useState(null);
//   const [overDueMails, setOverDueMails] = useState([]);
//   const [showOverdueMails, setShowOverdueMails] = useState(false);
//   const router = useRouter();
//   const [displayText, setDisplayText] = useState("");
//   const credibilityWords = ["Simple", "Efficient", "Secure"];
//   const timeoutRef = useRef(null); // To store the timeout ID for cleanup

//   // Effect for session check and fetching overdue mails
//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const session = await getSession();
//         if (!session) {
//           router.push("/"); // Redirect to home if no session
//         }
//       } catch (error) {
//         console.error("Session check failed:", error);
//       }
//     };
//     checkSession();

//     // Fetch overdue mails
//     async function fetchOverdueMails() {
//       try {
//         console.log("Fetching overdue mails...");
//         const response = await fetch("http://localhost:3000/api/reminder", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         console.log("Response Status:", response.status);
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("API Data:", data); // Debugging line
//         setOverDueMails(data.overdueMails || []); // Ensure it's an array
//       } catch (error) {
//         console.error("Failed to fetch overdue mails", error);
//       }
//     }

//     fetchOverdueMails();
//   }, [router]); // Only re-run if router changes

//   // Effect for typing animation
//   useEffect(() => {
//     const typingSpeed = 100; // Speed of typing each character (ms)
//     const deletingSpeed = 50; // Speed of deleting each character (ms)
//     const pauseDuration = 1500; // Pause duration after typing (ms)

//     let currentIndex = 0; // Current word index
//     let charIndex = 0; // Current character index
//     let isTyping = true; // Typing or deleting phase

//     const typeOrDelete = () => {
//       const currentWord = credibilityWords[currentIndex];

//       if (isTyping) {
//         if (charIndex < currentWord.length) {
//           setDisplayText(currentWord.slice(0, charIndex + 1));
//           charIndex++;
//           timeoutRef.current = setTimeout(typeOrDelete, typingSpeed);
//         } else {
//           // Finished typing, pause before deleting
//           timeoutRef.current = setTimeout(() => {
//             isTyping = false;
//             typeOrDelete();
//           }, pauseDuration);
//         }
//       } else {
//         if (charIndex > 0) {
//           setDisplayText(currentWord.slice(0, charIndex - 1));
//           charIndex--;
//           timeoutRef.current = setTimeout(typeOrDelete, deletingSpeed);
//         } else {
//           // Finished deleting, move to the next word
//           currentIndex = (currentIndex + 1) % credibilityWords.length;
//           isTyping = true;
//           typeOrDelete();
//         }
//       }
//     };

//     // Start the typing effect
//     typeOrDelete();

//     // Cleanup on unmount
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []); // No dependencies, runs once on mount

//   const handleMailClick = (mail) => {
//     setSelectedMail(mail); // Set the selected mail
//   };

//   const handleStatusChange = async (e) => {
//     const newStatus = e.target.value;

//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/reminder/${selectedMail._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const updatedMail = await response.json();
//       setOverDueMails((prevMails) =>
//         prevMails.map((mail) =>
//           mail._id === updatedMail._id ? updatedMail : mail
//         )
//       );

//       setSelectedMail(null);
//     } catch (error) {
//       console.error("Failed to update mail status:", error);
//     }
//   };

//   const handleViewPDF = () => {
//     if (selectedMail?.pdfUrl) {
//       window.open(selectedMail.pdfUrl, "_blank"); // Open PDF in a new tab
//     } else {
//       alert("No PDF available for this mail.");
//     }
//   };

//   const handleOpenForm = (actionType) => {
//     setAction(actionType);
//     setShowForm(true);
//   };

//   return (
//     <>
//       {showForm ? (
//         <div>
//           {showForm && (
//             <div>
//               <ScanUpload action={action} onClose={() => setShowForm(false)} />
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="flex flex-col min-h-screen bg-gray-50">
//           <Navbar />
//           {/* Floating Box for Overdue Mails */}
//           <div
//             style={{
//               position: "fixed",
//               bottom: "20px",
//               right: "20px",
//               zIndex: 1000,
//             }}
//           >
//             <div
//               style={{
//                 backgroundColor: "#fff",
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                 cursor: "pointer",
//                 position: "relative",
//               }}
//               onClick={() => setShowOverdueMails(!showOverdueMails)}
//             >
//               <div
//                 style={{
//                   padding: "25px 30px",
//                   fontSize: "large",
//                   fontWeight: "bold",
//                   borderBottom: showOverdueMails ? "1px solid #eee" : "none",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <span>Overdue Mails</span>
//                 {showOverdueMails && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setShowOverdueMails(false);
//                     }}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       fontSize: "20px",
//                       cursor: "pointer",
//                       color: "gray",
//                     }}
//                   >
//                     ✖
//                   </button>
//                 )}
//               </div>
//               {showOverdueMails && (
//                 <div
//                   style={{
//                     maxHeight: "300px",
//                     overflowY: "auto",
//                     padding: "8px",
//                   }}
//                 >
//                   {overDueMails.length > 0 ? (
//                     <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//                       {overDueMails.map((mail) => (
//                         <li
//                           key={mail._id}
//                           style={{
//                             marginBottom: "8px",
//                             padding: "8px",
//                             borderBottom: "1px solid #eee",
//                             cursor: "pointer",
//                           }}
//                           onClick={() => handleMailClick(mail)}
//                         >
//                           <div style={{ fontWeight: "500" }}>{mail.subject}</div>
//                           <div style={{ fontSize: "14px", color: "#666" }}>
//                             Status: {mail.status}
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No overdue mails found.</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {selectedMail && (
//             <div
//               style={{
//                 position: "fixed",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 backgroundColor: "#fff",
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 padding: "20px",
//                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                 zIndex: 1001,
//                 width: "300px",
//               }}
//             >
//               <h2
//                 style={{
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   marginBottom: "12px",
//                 }}
//               >
//                 Mail Details
//               </h2>
//               <div style={{ marginBottom: "12px" }}>
//                 <strong>Subject:</strong> {selectedMail.subject}
//               </div>
//               <div style={{ marginBottom: "12px" }}>
//                 <strong>Status:</strong>
//                 <select
//                   value={selectedMail.status}
//                   onChange={handleStatusChange}
//                   style={{
//                     marginLeft: "8px",
//                     padding: "4px",
//                     borderRadius: "4px",
//                     border: "1px solid #ccc",
//                   }}
//                 >
//                   <option value="open">Open</option>
//                   <option value="closed">Closed</option>
//                   <option value="in-progress">In Progress</option>
//                 </select>
//               </div>
//               <button
//                 onClick={handleViewPDF}
//                 style={{
//                   padding: "8px 16px",
//                   backgroundColor: "#007bff",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   marginRight: "8px",
//                 }}
//               >
//                 View PDF
//               </button>
//               <button
//                 onClick={() => setSelectedMail(null)}
//                 style={{
//                   padding: "8px 16px",
//                   backgroundColor: "#ccc",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//           )}

//           <div className="flex-grow w-full flex flex-col items-center p-16">
//             {/* Header Section */}
//             <div className="text-center mb-12">
//               <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
//                 <span className="inline-block">Modern Document</span>
//                 <br />
//                 <span className="inline-block">Management Made</span>{" "}
//                 <span
//                   className="inline-block text-blue-600"
//                   style={{ minWidth: "120px", textAlign: "left" }}
//                 >
//                   {displayText}
//                 </span>
//               </h1>
//               <p className="text-lg text-gray-600">
//                 Streamline your workflow with our intelligent <br /> file
//                 management system.
//               </p>
//               <div className="mt-6 flex justify-center gap-4">
//                 <button
//                   onClick={() => handleOpenForm("Upload")}
//                   className="px-6 py-3 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition duration-200 text-lg font-medium"
//                 >
//                   Upload Files
//                 </button>
//                 <button
//                   onClick={() => handleOpenForm("Scan")}
//                   className="px-6 py-3 bg-gray-200 text-blue-700 rounded-lg shadow-md hover:bg-gray-300 transition duration-200 text-lg font-medium"
//                 >
//                   Scan
//                 </button>
//               </div>
//             </div>

//             {/* Quick Actions Section */}
//             <div className="w-full max-w-6xl mb-12">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//                 Quick Actions
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                   <svg
//                     className="w-12 h-12 mx-auto mb-4 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-medium text-gray-700">
//                     Recent Files
//                   </h3>
//                   <p className="text-gray-500 text-sm">
//                     Access your recently viewed documents
//                   </p>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                   <svg
//                     className="w-12 h-12 mx-auto mb-4 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-medium text-gray-700">Favorites</h3>
//                   <p className="text-gray-500 text-sm">
//                     View and manage your starred items
//                   </p>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                   <svg
//                     className="w-12 h-12 mx-auto mb-4 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-medium text-gray-700">Folders</h3>
//                   <p className="text-gray-500 text-sm">
//                     Browse through your organized folders
//                   </p>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                   <svg
//                     className="w-12 h-12 mx-auto mb-4 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-medium text-gray-700">Shared</h3>
//                   <p className="text-gray-500 text-sm">
//                     See files shared with you
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Powerful Features Section */}
//             <div className="w-full max-w-6xl mb-12">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//                 Powerful Features
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                   <svg
//                     className="w-12 h-12 mx-auto mb-4 text-purple-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-medium text-gray-700">
//                     Smart Organization
//                   </h3>
//                   <p className="text-gray-500 text-sm">
//                     AI-powered file categorization and tagging system
//                   </p>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                   <svg
//                     className="w-12 h-12 mx-auto mb-4 text-purple-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M11 3.055A9.001 9.001 0 1019.945 13H11V3.055z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-medium text-gray-700">
//                     Advanced Analytics
//                   </h3>
//                   <p className="text-gray-500 text-sm">
//                     Detailed insights into your document usage and patterns
//                   </p>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                   <svg
//                     className="w-12 h-12 mx-auto mb-4 text-purple-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-medium text-gray-700">
//                     Secure Sharing
//                   </h3>
//                   <p className="text-gray-500 text-sm">
//                     Enterprise-grade security for your sensitive documents
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Activity Section */}
//             <div className="w-full max-w-6xl mb-12">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-gray-800">
//                   Recent Activity
//                 </h2>
//                 <button
//                   className="text-blue-600 hover:underline text-sm font-medium"
//                 >
//                   View All
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-700 font-medium">Q4 Report.pdf</p>
//                     <p className="text-gray-500 text-sm">You uploaded this file</p>
//                   </div>
//                   <p className="text-gray-500 text-sm">2 minutes ago</p>
//                 </div>
//                 <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-700 font-medium">
//                       Project Proposal.docx
//                     </p>
//                     <p className="text-gray-500 text-sm">Josh K. shared this file</p>
//                   </div>
//                   <p className="text-gray-500 text-sm">1 hour ago</p>
//                 </div>
//                 <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-700 font-medium">Meeting Notes.md</p>
//                     <p className="text-gray-500 text-sm">Mike R. edited this file</p>
//                   </div>
//                   <p className="text-gray-500 text-sm">3 hours ago</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Footer />
//         </div>
//       )}
//     </>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import ScanUpload from "./ScanUpload";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { Upload } from "lucide-react";
import { Scan } from "lucide-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
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
  const timeoutRef = useRef(null); // To store the timeout ID for cleanup
  const [isLoading, setIsLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);

  // Effect for session check and fetching overdue mails
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        if (!session) {
          router.push("/"); // Redirect to home if no session
        }
      } catch (error) {
        console.error("Session check failed:", error);
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();

    // Fetch overdue mails
    async function fetchOverdueMails() {
      try {
        console.log("Fetching overdue mails...");
        const response = await fetch("http://localhost:3000/api/reminder", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response Status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Data:", data); // Debugging line
        setOverDueMails(data.overdueMails || []); // Ensure it's an array
      } catch (error) {
        console.error("Failed to fetch overdue mails", error);
      }
    }

    fetchOverdueMails();
  }, [router]); // Only re-run if router changes

  useEffect(() => {
    const fetchRecentMails = async () => {
      try {
        setIsLoadingRecent(true);
        const response = await fetch("/api/recent");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setRecentMails(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setRecentError(error.message);
      } finally {
        setIsLoadingRecent(false);
      }
    };

    fetchRecentMails();
  }, []);

  // Effect for typing animation
  useEffect(() => {
    const typingSpeed = 100; // Speed of typing each character (ms)
    const deletingSpeed = 50; // Speed of deleting each character (ms)
    const pauseDuration = 1500; // Pause duration after typing (ms)

    let currentIndex = 0; // Current word index
    let charIndex = 0; // Current character index
    let isTyping = true; // Typing or deleting phase

    const typeOrDelete = () => {
      const currentWord = credibilityWords[currentIndex];

      if (isTyping) {
        if (charIndex < currentWord.length) {
          setDisplayText(currentWord.slice(0, charIndex + 1));
          charIndex++;
          timeoutRef.current = setTimeout(typeOrDelete, typingSpeed);
        } else {
          // Finished typing, pause before deleting
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
          // Finished deleting, move to the next word
          currentIndex = (currentIndex + 1) % credibilityWords.length;
          isTyping = true;
          typeOrDelete();
        }
      }
    };

    // Start the typing effect
    typeOrDelete();

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // No dependencies, runs once on mount

  const handleMailClick = (mail) => {
    setSelectedMail(mail); // Set the selected mail
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

  const handleViewPDF = () => {
    if (selectedMail?.pdfUrl) {
      window.open(selectedMail.pdfUrl, "_blank"); // Open PDF in a new tab
    } else {
      alert("No PDF available for this mail.");
    }
  };

  const handleOpenForm = (actionType) => {
    setAction(actionType);
    setShowForm(true);
  };

  useEffect(() => {
    // Set random positions for each bubble
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
      <div className=" absolute inset-0 overflow-hidden z-0">
        <div className="animate-bubble bg-gray-300 rounded-full opacity-30 w-60 h-60 absolute"></div>
        <div className="animate-bubble bg-gray-300 rounded-full opacity-30 w-72 h-72 absolute"></div>
        <div className="animate-bubble bg-gray-300 rounded-full opacity-30 w-50 h-50 absolute"></div>
        <div className="animate-bubble bg-gray-300 rounded-full opacity-30 w-40 h-40 absolute"></div>
        <div className="animate-bubble bg-gray-300 rounded-full opacity-30 w-30 h-30 absolute"></div>
      </div>
      {showForm ? (
        <div>
          {showForm && (
            <div>
              <ScanUpload action={action} onClose={() => setShowForm(false)} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          {/* Floating Box for Overdue Mails */}
          <div className="fixed bottom-5 right-5 z-50">
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
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleViewPDF}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      View PDF
                    </button>
                    <button
                      onClick={() => setSelectedMail(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex-grow w-full flex flex-col items-center p-14">
            {/* Header Section */}
            <div className="flex items-center justify-center h-screen">
              <div className="text-center mx-auto mb-12 transform -translate-y-20">
                <h1 className="text-6xl font-bold text-gray-800 mb-4 leading-tight ">
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
                    onClick={() => handleOpenForm("Upload")}
                    className="flex items-center gap-2 px-10 py-2 bg-black text-white rounded-lg shadow-md text-lg font-medium relative group text-center transition-transform transform hover:scale-110 duration-300 cursor-pointer"
                  >
                    <Upload size={20} /> Upload
                  </button>
                  <button
                    onClick={() => handleOpenForm("Scan")}
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
                  <h3 className="text-lg font-medium text-black">Favorites</h3>
                  <p className="text-gray-500 text-sm">
                    View and manage your starred items
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
                  <h3 className="text-lg font-medium text-black">Folders</h3>
                  <p className="text-gray-500 text-sm">
                    Browse through your organized folders
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
                  <h3 className="text-lg font-medium text-black">Shared</h3>
                  <p className="text-gray-500 text-sm">
                    See files shared with you
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
                    AI-powered file categorization and tagging system
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
                    Advanced Analytics
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Detailed insights into your document usage and patterns
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
                    Secure Sharing
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Enterprise-grade security for your sensitive documents
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
                  <PulseLoader color="#6b7280" size={10} speedMultiplier={0.7}/>
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
                      className="bg-white p-4 flex items-center justify-between rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer text-left"
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

          <Footer />
        </div>
      )}
    </>
  );
}
