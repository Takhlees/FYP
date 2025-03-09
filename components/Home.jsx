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



"use client";

import { useState, useEffect } from "react";
import ScanUpload from "./ScanUpload";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [action, setAction] = useState("");
  const [selectedMail, setSelectedMail] = useState(null);
  const [overDueMails, setOverDueMails] = useState([]);
  const [showOverdueMails, setShowOverdueMails] = useState(false);
  const router = useRouter();

  // Check session and redirect if not authenticated
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (!session) {
          router.push("/"); // Redirect to home if no session
        }
      } catch (error) {
        console.error("Session check failed:", error);
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
  }, [router]);

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

      // Update the local state with the updated mail
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


  return (
    <>
      {showForm ? (
        <div>
          {showForm && (
            <div>
              <ScanUpload action={action} onClose={() => setShowForm(false)} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          {/* Floating Box for Overdue Mails */}
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                position: "relative", // Ensures the close button is positioned inside
              }}
              onClick={() => setShowOverdueMails(!showOverdueMails)} // Toggle visibility
            >
              {/* Header Section with Close Button */}
              <div
                style={{
                  padding: "25px 30px",
                  fontSize: "large",
                  fontWeight: "bold",
                  borderBottom: showOverdueMails ? "1px solid #eee" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Overdue Mails</span>
                {showOverdueMails && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent onClick from triggering
                      setShowOverdueMails(false);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "20px",
                      cursor: "pointer",
                      color: "gray",
                    }}
                  >
                    ✖
                  </button>
                )}
              </div>

              {/* List of Overdue Mails */}
              {showOverdueMails && (
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    padding: "8px",
                  }}
                >
                  {overDueMails.length > 0 ? (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {overDueMails.map((mail) => (
                        <li
                          key={mail._id}
                          style={{
                            marginBottom: "8px",
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                            cursor: "pointer",
                          }}
                          onClick={() => handleMailClick(mail)} // Handle click on mail
                        >
                          <div style={{ fontWeight: "500" }}>
                            {mail.subject}
                          </div>
                          <div style={{ fontSize: "14px", color: "#666" }}>
                            Status: {mail.status}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No overdue mails found.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedMail && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                zIndex: 1001,
                width: "300px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                Mail Details
              </h2>
              <div style={{ marginBottom: "12px" }}>
                <strong>Subject:</strong> {selectedMail.subject}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Status:</strong>
                <select
                  value={selectedMail.status}
                  onChange={handleStatusChange}
                  style={{
                    marginLeft: "8px",
                    padding: "4px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="in-progress">In Progress</option>
                </select>
              </div>
              <button
                onClick={handleViewPDF}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "8px",
                }}
              >
                View PDF
              </button>
              <button
                onClick={() => setSelectedMail(null)} // Close the modal
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          )}

          <div className="flex-grow w-full flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Welcome to File Management System
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => handleOpenForm("Scan")}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 block lg:hidden text-lg font-medium"
              >
                Scan
              </button>
              <button
                onClick={() => handleOpenForm("Upload")}
                className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200 text-lg font-medium"
              >
                Upload
              </button>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}
