import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function DepartmentPage() {
  const router = useRouter();
  const { id, name } = router.query;

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showInput, setShowInput] = useState(false);

  // Fetch categories from the backend
  useEffect(() => {
    if (!id) return; // Wait for department name from query

    const fetchCategories = async () => {
      const response = await fetch(`/api/department/${id}` , {
        method: 'GET'
    });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, [id]);

  const addCategory = async () => {
    if (newCategory.trim()) {
      const response = await fetch(`/api/department/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: newCategory }),
      });

      if (response.ok) {
        const updatedCategories = await response.json();
        setCategories(updatedCategories);
        setNewCategory("");
        setShowInput(false);
      } else {
        console.error("Failed to add category");
      }
    }
  };

  return (
    <div>
      <h1>Department : {name}</h1>
      <div>
        <button onClick={() => setShowInput(!showInput)}>
          Add Category
        </button>
        {showInput && (
          <div>
            <input
              type="text"
              placeholder="Enter Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={addCategory}>Add</button>
          </div>
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>Categories:</h3>
        <select>
          <option value="" disabled selected>
            Select a Category
          </option>
          {Array.isArray(categories) && categories.length > 0 ? (
  categories.map((category, index) => (
    <option key={index} value={category}>
      {category}
    </option>
  ))
) : (
  <option>No categories available</option>
)}
        </select>
      </div>
    </div>
  );
}
