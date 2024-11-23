
// components/CategoryList.js
import { useState, useEffect } from 'react';
import FileList from './FileList';

const Category = ({ departmentId }) => {
  // Mock data for categories (to be replaced by backend API later)
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Simulate fetching categories based on departmentId
  useEffect(() => {
    const categoriesData = [
      { id: 1, departmentId: 1, name: 'Recruitment' },
      { id: 2, departmentId: 1, name: 'Employee Benefits' },
      { id: 3, departmentId: 2, name: 'Tax' },
      { id: 4, departmentId: 2, name: 'Payroll' },
      { id: 5, departmentId: 3, name: 'Software' },
    ];
    const filteredCategories = categoriesData.filter(
      (category) => category.departmentId === departmentId
    );
    setCategories(filteredCategories);
  }, [departmentId]);

  const handleSelectCategory = (id) => {
    setSelectedCategory(id);
  };

  return (
    <div className="category-list">
      <h3>Categories</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <button onClick={() => handleSelectCategory(category.id)}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedCategory && <FileList categoryId={selectedCategory} />}
    </div>
  );
};

export default Category;
