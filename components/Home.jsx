"use client"

import { useState } from "react";
import ScanUpload from "./ScanUpload";
import Navbar from '@components/Navbar'
import Footer from '@components/Footer'

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [action, setAction] = useState("");

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
   
     </div>
     <Footer />
     </div>
    )}
    
    </>
  );
}
