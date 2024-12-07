"use client"
import { useState } from "react";
import ScanUpload from "../components/ScanUpload";


export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [action, setAction] = useState("");

  const handleOpenForm = (actionType) => {
    setAction(actionType);
    setShowForm(true);
  };

  return (
    <div>
      <h1>Welcome to File Management System</h1>
      <button onClick={() => handleOpenForm("Scan")}>Scan</button>
      <button onClick={() => handleOpenForm("Upload")}>Upload</button>

      {showForm && <ScanUpload action={action} onClose={() => setShowForm(false)} />}
    </div>
  );
}
