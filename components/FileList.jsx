
// components/FileList.js
import { useState, useEffect } from 'react';

const FileList = ({ categoryId }) => {
  // Mock data for files (to be replaced by backend API later)
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const filesData = [
      { id: 1, categoryId: 1, name: 'Recruitment Policy.pdf' },
      { id: 2, categoryId: 2, name: 'Employee Benefits Guide.pdf' },
      { id: 3, categoryId: 3, name: 'Tax Filing Instructions.pdf' },
      { id: 4, categoryId: 4, name: 'Payroll Records.xlsx' },
      { id: 5, categoryId: 5, name: 'Software License Agreement.docx' },
    ];
    const filteredFiles = filesData.filter((file) => file.categoryId === categoryId);
    setFiles(filteredFiles);
  }, [categoryId]);

  return (
    <div className="file-list">
      <h4>Files</h4>
      <ul>
        {files.map((file) => (
          <li key={file.id}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
