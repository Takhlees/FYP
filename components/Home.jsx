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
