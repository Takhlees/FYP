// "use client";

// import "@styles/globals.css";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import SearchBar from "@components/SearchBar";

// export default function DepartmentPage() {
//   const router = useRouter();
//   const { id, name } = router.query;

//   const [categories, setCategories] = useState(["All"]);
//   const [newCategory, setNewCategory] = useState("");
//   const [showInput, setShowInput] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All"); // Default to "all"
//   const [files, setFiles] = useState([]);
//   // const [type, setType] = useState("");

//   // Fetch categories from the backend
//   useEffect(() => {
//     if (!id) return; // Wait for department id from query

//     const fetchCategories = async () => {
//       const response = await fetch(`/api/department/${id}`, {
//         method: "GET",
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setCategories(["All", ...data.categories]); // Add "all" as default option
//       } else {
//         console.error("Failed to fetch categories");
//       }
//     };

//     fetchCategories();
//   }, [id]);

//   // Fetch files based on selected category
//   useEffect(() => {
//     if (!selectedCategory || !id) return;
//     fetchFiles(id, selectedCategory);
//   }, [selectedCategory, id]);

//   const addCategory = async () => {
//     if (newCategory.trim()) {
//       const response = await fetch(`/api/department/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ category: newCategory }),
//       });

//       if (response.ok) {
//         const updatedCategories = await response.json();
//         if (Array.isArray(updatedCategories)) {
//           setCategories(["All", ...updatedCategories]);
//         }
//         setNewCategory("");
//         setShowInput(false);
//       } else {
//         console.error("Failed to add category");
//       }
//     }
//   };

//   const fetchFiles = async (department, category) => {
//     try {
//       let url = `/api/scanupload?department=${department}`;
//       if (category && category !== "All") {
//         url += `&category=${category}`; // Add category filter if it's not "all"
//       }

//       const response = await fetch(url);
//       if (response.ok) {
//         const data = await response.json();
//         setFiles(data); // Store in state
//       } else {
//         alert("Failed to fetch files");
//       }
//     } catch (error) {
//       console.error("Error fetching files:", error);
//     }
//   };
//   const handleDownload = async (doc) => {
//     const response = await fetch(`/api/scanupload/${doc._id}`, {
//       method: "GET",
//       headers: {
//         "Content-Disposition": "attachment", // Trigger the download in the backend
//       },
//     });

//     if (!response.ok) {
//       console.error("Failed to download file");
//       return;
//     }

//     // Create a Blob from the response and trigger download
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${doc.subject}.pdf`; // You can set this dynamically if needed
//     link.click();
//     window.URL.revokeObjectURL(url);
//   };



//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">Department: {name}</h1>
//       <div>
//         <button
//           onClick={() => setShowInput(!showInput)}
//           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
//         >
//           Add Category
//         </button>
//         {showInput && (
//           <div className="mt-4 space-y-2">
//             <input
//               type="text"
//               placeholder="Enter Category Name"
//               value={newCategory}
//               onChange={(e) => setNewCategory(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={addCategory}
//               className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
//             >
//               Add
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="mt-6">
//         <h3 className="text-lg font-medium mb-2">Categories:</h3>
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//         >
//           {Array.isArray(categories) && categories.length > 0 ? (
//             categories.map((category, index) => (
//               <option key={index} value={category}>
//                 {category}
//               </option>
//             ))
//           ) : (
//             <option>No categories available</option>
//           )}
//         </select>
//       </div>

//         <SearchBar />
//       <div className="mt-1">
//         <h3 className="text-lg font-medium mb-2">Files:</h3>
//         <div className="space-y-4">
//           {files.length > 0 ? (
//             files.map((doc) => (
//               <div
//                 key={doc._id}
//                 className="flex flex-row items-center justify-between p-4 border border-gray-300 rounded-md bg-gray-50 shadow hover:shadow-md transition"
//               >
//                 <h3 className="text-lg font-semibold">{doc.subject}</h3>
//                 <p className="text-sm text-gray-500">
//                   {new Date(doc.date).toLocaleDateString("en-GB")}
//                 </p>
//                 <p className="text-sm text-gray-700">Diary No: {doc.diaryNo}</p>
//                 <p className="text-sm text-gray-700">Status: {doc.status}</p>

//                 <div className="mt-2 flex gap-4">
//                   <a
//                     href={`/api/scanupload/${doc._id}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500 hover:underline"
//                   >
//                     View File
//                   </a>
//                   <a
//                     onClick={() => handleDownload(doc)}
//                     download
//                     className="text-green-500 hover:underline cursor-pointer"
//                   >
//                     Download File
//                   </a>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">
//               No files available for this category.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }







// "use client";

// import "@styles/globals.css";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import ScanUpload from "@components/ScanUpload";
// import {Edit, Download } from "lucide-react";
// import SearchBar from "@components/SearchBar";


// export default function DepartmentPage() {
//   const router = useRouter();
//   const { id, name } = router.query;

//   const [categories, setCategories] = useState(["All"]);
//   const [newCategory, setNewCategory] = useState("");
//   const [showInput, setShowInput] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All"); // Default to "all"
//   const [files, setFiles] = useState([]);
//   const [editingFile, setEditingFile] = useState(null);
//  const [showForm, setShowForm] = useState(false);
//  const [action, setAction] = useState("");


//   // Fetch categories from the backend
//   useEffect(() => {
//     if (!id) return; // Wait for department id from query

//     const fetchCategories = async () => {
//       const response = await fetch(`/api/department/${id}`, {
//         method: "GET",
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setCategories(["All", ...data.categories]); // Add "all" as default option
//       } else {
//         console.error("Failed to fetch categories");
//       }
//     };

//     fetchCategories();
//   }, [id]);

//   // Fetch files based on selected category
//   useEffect(() => {
//     if (!selectedCategory || !id) return;
//     fetchFiles(id, selectedCategory);
//   }, [selectedCategory, id]);

//   const addCategory = async () => {
//     if (newCategory.trim()) {
//       const response = await fetch(`/api/department/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ category: newCategory }),
//       });

//       if (response.ok) {
//         const updatedCategories = await response.json();
//         if (Array.isArray(updatedCategories)) {
//           setCategories(["All", ...updatedCategories]);
//         }
//         setNewCategory("");
//         setShowInput(false);
//       } else {
//         console.error("Failed to add category");
//       }
//     }
//   };

//   const fetchFiles = async (department, category) => {
//     try {
//       let url = `/api/scanupload?department=${department}`;
//       if (category && category !== "All") {
//         url += `&category=${category}`; // Add category filter if it's not "all"
//       }

//       const response = await fetch(url);
//       if (response.ok) {
//         const data = await response.json();
//         setFiles(data); // Store in state
//       } else {
//         alert("Failed to fetch files");
//       }
//     } catch (error) {
//       console.error("Error fetching files:", error);
//     }
//   };

//   const handleEdit = (doc) => {
//     setEditingFile(doc);
//     setAction("Edit");
//     setShowForm(true);  // Show the upload form
//   };

//   const handleDownload = async (doc) => {
//     const response = await fetch(`/api/scanupload/${doc._id}`, {
//       method: "GET",
//       headers: {
//         "Content-Disposition": "attachment", // Trigger the download in the backend
//       },
//     });

//     if (!response.ok) {
//       console.error("Failed to download file");
//       return;
//     }

//     // Create a Blob from the response and trigger download
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${doc.subject}.pdf`; // You can set this dynamically if needed
//     link.click();
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <>
//      {showForm ? (
//       <div className="mb-6">
//         <ScanUpload fileData={editingFile} action={action} onClose={() => setShowForm(false)} />
//       </div>
//     ) : (<div className="p-6">
//   <h1 className="text-2xl font-semibold mb-4">Department: {name}</h1>
//   <button onClick={() => setShowInput(!showInput)} className="px-4 py-2 bg-blue-500 text-white rounded-md">
//         Add Category
//       </button>
    
//     {showInput && (
//       <div className="mt-4 space-y-2">
//         <input
//           type="text"
//           placeholder="Enter Category Name"
//           value={newCategory}
//           onChange={(e) => setNewCategory(e.target.value)}
//           className="px-2 py-2 border border-gray-300 rounded-md"
//         />
//         <button
//           onClick={addCategory}
//           className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md"
//         >
//           Add
//         </button>
//       </div>
//     )}

  
//   <div className="mt-6">
//     <h3 className="text-lg font-medium mb-2">Categories:</h3>
//     <div className="relative w-full">
//     <select
//       value={selectedCategory}
//       onChange={(e) => setSelectedCategory(e.target.value)}
//       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer"
//     >
//       {Array.isArray(categories) && categories.length > 0 ? (
//         categories.map((category, index) => (
//           <option className="w-full text-black bg-white" key={index} value={category}>
//             {category}
//           </option>
//         ))
        
//       ) : (
//         <option className="w-full text-gray-500">No categories available</option>
//       )}
//     </select>
//     </div>
//   </div>
  
   
//   <div className="mt-8">
//     <h3 className="text-lg font-medium mb-2">Files:</h3>

//     {/* search bar */}
//     <SearchBar />
    
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Subject</th>
//             <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
//             <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Diary No</th>
//             <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">From</th>
//             <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Disposal</th>
//             <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
//             <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {files.map((doc) => (
//             <tr key={doc._id} className="hover:bg-gray-50">
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//               <a
//                   href={`/api/scanupload/${doc._id}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-gray-600 hover:text-gray-800 hover:underline focus:outline-none"
//                 >
//                   {doc.subject}
//                 </a></td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                 {new Date(doc.date).toLocaleDateString("en-GB")}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doc.diaryNo}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doc.from}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doc.disposal}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doc.status}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex">
//                 <a
//                   onClick={() => handleEdit(doc)}
//                   className="text-indigo-600 hover:text-indigo-900 cursor-pointer mr-4"
//                 >
//                   <Edit size={20} />
//                 </a>
                
//                 <a onClick={() => handleDownload(doc)} className="text-green-600 hover:text-green-900 cursor-pointer">
//                 <Download size={20}/>
//                 </a>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// </div>
// )}
//     </>
    
//   );
// }











"use client"

import "@styles/globals.css"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import ScanUpload from "@components/ScanUpload"
import { Edit, Download } from "lucide-react"
import SearchBar from "@components/SearchBar"

export default function DepartmentPage() {
  const router = useRouter()
  const { id, name } = router.query

  const [categories, setCategories] = useState(["All"])
  const [newCategory, setNewCategory] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All") // Default to "all"
  const [files, setFiles] = useState([])
  const [editingFile, setEditingFile] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [action, setAction] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFiles, setFilteredFiles] = useState([])


  const fetchCategories = async () => {
    const response = await fetch(`/api/department/${id}`, {
      method: "GET",
    })
    if (response.ok) {
      const data = await response.json()
      setCategories(["All", ...data.categories]) // Add "all" as default option
    } else {
      console.error("Failed to fetch categories")
    }
  }
  
  // Fetch categories from the backend
  useEffect(() => {
    if (!id) return // Wait for department id from query
    fetchCategories()
  }, [id])

  // Fetch files based on selected category
  useEffect(() => {
    if (!selectedCategory || !id) return
    fetchFiles(id, selectedCategory)
  }, [selectedCategory, id])

  // Filter files based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFiles(files) // Show all files if search query is empty
    } else {
      const lowercasedQuery = searchQuery.toLowerCase()
      const filtered = files.filter(
        (file) =>
          file.subject.toLowerCase().includes(lowercasedQuery) ||
          file.diaryNo.toLowerCase().includes(lowercasedQuery) ||
          file.from.toLowerCase().includes(lowercasedQuery),
      )
      setFilteredFiles(filtered) // Filter the files based on the search query
    }
  }, [searchQuery, files])

  const addCategory = async () => {
    if (newCategory.trim()) {
      const response = await fetch(`/api/department/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: newCategory }),
      })

      if (response.ok) {
        const updatedCategories = await response.json()
        if (Array.isArray(updatedCategories)) {
          setCategories(["All", ...updatedCategories])
        }
        setNewCategory("")
        setShowInput(false)
        fetchCategories()
      } else {
        console.error("Failed to add category")
      }
    }
  }

  const fetchFiles = async (department, category) => {
    try {
      let url = `/api/scanupload?department=${department}`
      if (category && category !== "All") {
        url += `&category=${category}` // Add category filter if it's not "all"
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setFiles(data) // Store in state
        setFilteredFiles(data) // Initially show all files
      } else {
        alert("Failed to fetch files")
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    }
  }

  const handleEdit = (doc) => {
    setEditingFile(doc)
    setAction("Edit")
    setShowForm(true) // Show the upload form
  }

  const handleDownload = async (doc) => {
    const response = await fetch(`/api/scanupload/${doc._id}`, {
      method: "GET",
      headers: {
        "Content-Disposition": "attachment", // Trigger the download in the backend
      },
    })

    if (!response.ok) {
      console.error("Failed to download file")
      return
    }

    // Create a Blob from the response and trigger download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${doc.subject}.pdf` // You can set this dynamically if needed
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      {showForm ? (
        <div className="mb-6">
          <ScanUpload fileData={editingFile} action={action} onClose={() => setShowForm(false)} />
        </div>
      ) : (
        <div className="p-6 bg-white">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold mb-4 text-[#111827]">Department: {name}</h1>
            <button
              onClick={() => setShowInput(!showInput)}
              className="px-4 bg-black text-white rounded-md relative group text-center transition-transform transform hover:scale-110 duration-300"
            >
              Add Category
            </button>
          </div>
          {showInput && (
            <div className="mt-4 space-x-2 flex w-full">
              <input
                type="text"
                placeholder="Enter Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-2 py-2 w-full border border-[#F3F4F6] rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none"
              />
              <button
                onClick={addCategory}
                className="ml-2 px-4 py-2 bg-[#3B5FE3] text-white rounded-md hover:bg-[#3051C6] transition-colors"
              >
                Add
              </button>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-[#111827]">Categories:</h3>
            <div className="w-full">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[#F3F4F6] rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] cursor-pointer outline-none"
              >
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))
                ) : (
                  <option className="w-full text-[#6B7280]">No categories available</option>
                )}
              </select>
            </div>
          </div>

          <div className="mt-6">
            {/* Search bar */}
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* Files table */}
            <div className="overflow-x-auto mt-4 rounded-lg border border-[#F3F4F6]">
              <table className="min-w-full bg-white">
                <thead className="bg-[#F3F4F6]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Diary No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Disposal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {filteredFiles.map((doc) => (
                    <tr key={doc._id} >
                      <td className="px-6 py-4 ">
                        <a
                          href={`/api/scanupload/${doc._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-light hover:text-mid hover:underline focus:outline-none"
                        >
                          {doc.subject}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        {new Date(doc.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.diaryNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.from}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.disposal}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex">
                        <a
                          onClick={() => handleEdit(doc)}
                          className="text-light hover:text-mid cursor-pointer mr-4"
                        >
                          <Edit size={20} />
                        </a>

                        <a
                          onClick={() => handleDownload(doc)}
                          className="text-light hover:text-mid cursor-pointer"
                        >
                          <Download size={20} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
