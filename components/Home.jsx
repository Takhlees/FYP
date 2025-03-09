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
     {showForm ? (<div>{showForm && (
      <div>
        <ScanUpload action={action} onClose={() => setShowForm(false)} />
      </div>
    )} </div>) : 
    (
      <div className="flex flex-col min-h-screen">
      <Navbar />
       <div className="flex-grow w-full flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome to File Management System</h1>
       <div className="flex gap-4">
       <button
           onClick={() => handleOpenForm("Scan")}
           className="px-6 py-3 bg-secondary text-white rounded-lg shadow-md hover:bg-dark transition duration-200 block lg:hidden text-lg font-medium"
         >
           Scan
         </button>
     <button
       onClick={() => handleOpenForm("Upload")}
       className="px-6 py-3 bg-mid text-white rounded-lg shadow-md hover:bg-secondary transition duration-200 text-lg font-medium"
     >
       Upload
     </button>
   </div>
   


<section className="mb-12">
<h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {quickActions.map((action) => (
    <div
      key={action.title}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{action.icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{action.title}</h3>
      </div>
      <p className="text-gray-600">{action.description}</p>
    </div>
  ))}
</div>
</section>

<section>
<h2 className="text-2xl font-bold mb-6 text-gray-800">Powerful Features</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {features.map((feature) => (
    <div
      key={feature.title}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{feature.icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
      </div>
      <p className="text-gray-600">{feature.description}</p>
    </div>
  ))}
</div>
</section>
     </div>
     <Footer />
     </div>
    )}
    
    </>
  );
}
