

// components/DepartmentList.js
import { useState, useEffect } from 'react';
import Category from './Category';

const Department = () => {
  // Mock data for departments (to be replaced by backend API later)
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Simulate fetching departments
  useEffect(() => {
    const departmentsData = [
      { id: 1, name: 'HR' },
      { id: 2, name: 'Finance' },
      { id: 3, name: 'Engineering' }
    ];
    setDepartments(departmentsData);
  }, []);

  const handleSelectDepartment = (id) => {
    setSelectedDepartment(id);
  };

  return (
    <div className="department-list">
      <h2>Departments</h2>
      <ul>
        {departments.map((department) => (
          <li key={department.id}>
            <button onClick={() => handleSelectDepartment(department.id)}>
              {department.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedDepartment && (
        <Category departmentId={selectedDepartment} />
      )}
    </div>
  );
};

export default Department;
