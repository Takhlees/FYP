import React, { useState } from "react";
import ScanUpload from "./ScanUpload";

const HomePage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formType, setFormType] = useState(""); // 'Scan' or 'Upload'

  const handleButtonClick = (type) => {
    setFormType(type);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => handleButtonClick("Scan")}>Scan</button>
      <button onClick={() => handleButtonClick("Upload")}>Upload</button>

      {isFormVisible && (
        <ScanUpload
          formType={formType}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default HomePage;

