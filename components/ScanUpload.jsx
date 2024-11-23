import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const ScanUpload = ({ formType, onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Mock department data
    setDepartments([
      { id: 1, name: "HR" },
      { id: 2, name: "Finance" },
      { id: 3, name: "Engineering" },
    ]);

    // Autofill date
    setDate(new Date().toISOString().split("T")[0]); // Format: YYYY-MM-DD
  }, []);

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);

    const categoryData = [
      { departmentId: 1, categories: ["Recruitment", "Employee Benefits"] },
      { departmentId: 2, categories: ["Tax", "Payroll"] },
      { departmentId: 3, categories: ["Software", "Hardware"] },
    ];

    const selectedDepartmentCategories = categoryData.find(
      (dept) => dept.departmentId === parseInt(departmentId)
    );

    setCategories(selectedDepartmentCategories ? selectedDepartmentCategories.categories : []);
    setSelectedCategory("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Extract subject from file (if it's a text file)
    if (selectedFile && selectedFile.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const firstLine = text.split("\n")[0]; // Use the first line as the subject
        setSubject(firstLine);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSave = () => {
    if (!file || !selectedDepartment || !selectedCategory || !subject) {
      alert("Please complete all fields.");
      return;
    }

    // Create a PDF from the file content (if needed)
    const doc = new jsPDF();
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgData = event.target.result;
        doc.addImage(imgData, "JPEG", 10, 10, 180, 160);
        saveFile(doc);
      };
      reader.readAsDataURL(file);
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        doc.text(text, 10, 10);
        saveFile(doc);
      };
      reader.readAsText(file);
    } else {
      alert("Unsupported file type.");
    }
  };

  const saveFile = (doc) => {
    // Save file logic (mocked)
    const fileName = `${file.name.split(".")[0]}_${selectedCategory}_${selectedDepartment}.pdf`;
    console.log(`File "${fileName}" saved under Department ${selectedDepartment}, Category ${selectedCategory}.`);

    // Reset form
  
    alert("File saved successfully!");
  };

  return (
    <div className="form-modal">
      <h2>{formType} Form</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            disabled={!selectedDepartment}
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="file">File:</label>
          <input
            type="file"
            id="file"
            accept=".jpg,.jpeg,.png,.txt"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ScanUpload;
