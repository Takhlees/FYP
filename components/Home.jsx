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
  const [overDueMails, setOverDueMails] = useState([]);
  const router = useRouter();

  // Check session and redirect if not authenticated
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        router.push("/"); // Redirect to home if no session
      }
    };
    checkSession();

    async function fetchOverdueMails() {
      try {
        const response = await fetch("http://localhost:3000/api/reminder", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.overDueMails) {
          const data = await response.json();
          setOverDueMails(response.overDueMails);
        }
      } catch (error) {
        console.error("Failed to fetch overdue mails", error);
      }
    }

    fetchOverdueMails();
  }, [router]);

  const handleOpenForm = (actionType) => {
    setAction(actionType);
    setShowForm(true);
  };




const quickActions = [
  {
    title: "Recent Files",
    description: "Access your recently viewed documents",
    icon: "⏰",
  },
  {
    title: "Favorites",
    description: "View and manage your starred items",
    icon: "⭐",
  },
  {
    title: "Folders",
    description: "Browse through your organized folders",
    icon: "📁",
  },
  {
    title: "Shared",
    description: "See files shared with you",
    icon: "👥",
  },
]

const features = [
  {
    title: "Smart Organization",
    description: "AI-powered file categorization and tagging system",
    icon: "🔧",
  },
  {
    title: "Advanced Analytics",
    description: "Detailed insights into your document usage and patterns",
    icon: "📊",
  },
  {
    title: "Secure Sharing",
    description: "Enterprise-grade security for your sensitive documents",
    icon: "🛡️",
  },
]











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
          <div>
            <h1>Mail Notifications</h1>
            {overDueMails.length > 0 ? (
              <div style={{ color: "red" }}>
                <h2>Notifications</h2>
                <p>You have {overdueMails.length} overdue mails:</p>
                <ul>
                  {overdueMails.map((mail) => (
                    <li key={mail._id}>
                      <strong>{mail.subject}</strong> - Created on:{" "}
                      {new Date(mail.createdAt).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No overdue mails.</p>
            )}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}
