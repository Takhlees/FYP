"use client"

import { useState } from "react";
import ScanUpload from "./ScanUpload";


export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [action, setAction] = useState("");

  const handleOpenForm = (actionType) => {
    setAction(actionType);
    setShowForm(true);
  };

  return (
    <>
    <div className="w-full flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome to File Management System</h1>
      <div className="flex gap-4">
      <button
          onClick={() => handleOpenForm("Scan")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 block lg:hidden"
        >
          Scan
        </button>
    <button
      onClick={() => handleOpenForm("Upload")}
      className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200"
    >
      Upload
    </button>
  </div>
  
    </div>
    {showForm && (
      <div>
        <ScanUpload action={action} onClose={() => setShowForm(false)} />
      </div>
    )}
    
    </>
  );
}
