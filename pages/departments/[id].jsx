// "use client";

// import "@styles/globals.css";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import ScanUpload from "@components/ScanUpload";
// import { Edit, Download, ArrowLeft, Trash2, X } from "lucide-react";
// import SearchBar from "@components/SearchBar";

// export default function DepartmentPage() {
//   const router = useRouter();
//   const { id, name } = router.query;
//   const [isLoading, setIsLoading] = useState(false);
//   const [categories, setCategories] = useState(["All"]);
//   const [newCategory, setNewCategory] = useState("");
//   const [showInput, setShowInput] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [files, setFiles] = useState([]);
//   const [editingFile, setEditingFile] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [action, setAction] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredFiles, setFilteredFiles] = useState([]);
//   const [previewDoc, setPreviewDoc] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(`/api/department/${id}`, {
//         method: "GET",
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setCategories(["All", ...data.categories]);
//       } else {
//         console.error("Failed to fetch categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     if (!id) return;
//     fetchCategories();
//   }, [id]);

//   useEffect(() => {
//     if (!selectedCategory || !id) return;
//     fetchFiles(id, selectedCategory);
//   }, [selectedCategory, id]);

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredFiles(files);
//     } else {
//       const lowercasedQuery = searchQuery.toLowerCase();
//       const filtered = files.filter(
//         (file) =>
//           file.subject?.toLowerCase().includes(lowercasedQuery) ||
//           file.diaryNo?.toLowerCase().includes(lowercasedQuery) ||
//           file.from?.toLowerCase().includes(lowercasedQuery)
//       );
//       setFilteredFiles(filtered);
//     }
//   }, [searchQuery, files]);

//   const addCategory = async () => {
//     if (newCategory.trim()) {
//       try {
//         const response = await fetch(`/api/department/${id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ category: newCategory }),
//         });

//         if (response.ok) {
//           const updatedCategories = await response.json();
//           if (Array.isArray(updatedCategories)) {
//             setCategories(["All", ...updatedCategories]);
//           }
//           setNewCategory("");
//           setShowInput(false);
//           fetchCategories();
//         } else {
//           console.error("Failed to add category");
//         }
//       } catch (error) {
//         console.error("Error adding category:", error);
//       }
//     }
//   };

//   const fetchFiles = async (department, category) => {
//     setIsLoading(true);
//     try {
//       let url = `/api/scanupload?department=${department}`;
//       if (category && category !== "All") {
//         url += `&category=${category}`;
//       }

//       const response = await fetch(url);
//       if (response.ok) {
//         const data = await response.json();
//         const files = data.documents || [];
//         setFiles(files);
//         setFilteredFiles(files);
//       } else {
//         console.error("Failed to fetch files");
//         alert("Failed to fetch files");
//       }
//     } catch (error) {
//       console.error("Error fetching files:", error);
//       alert("Error fetching files");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePreview = async (doc) => {
//     try {
//       setPreviewDoc(doc);
//       setShowPreview(true);
      
//       // Fetch the PDF data
//       const response = await fetch(`/api/scanupload/${doc._id}?download=true`);
//       if (response.ok) {
//         const blob = await response.blob();
//         const url = URL.createObjectURL(blob);
//         setPdfUrl(url);
//       } else {
//         alert('Failed to load PDF preview');
//         setShowPreview(false);
//       }
//     } catch (error) {
//       console.error('Preview error:', error);
//       alert('Failed to load PDF preview');
//       setShowPreview(false);
//     }
//   };

//   const closePreview = () => {
//     setShowPreview(false);
//     setPreviewDoc(null);
//     if (pdfUrl) {
//       URL.revokeObjectURL(pdfUrl);
//       setPdfUrl(null);
//     }
//   };

//   const handleEdit = (doc) => {
//     try {
//       // Simple detection: if filename contains scan patterns, it was scanned
//       const isScanned = doc.fileName && (
//         doc.fileName.includes('a4_scan_') || 
//         doc.fileName.includes('scanned_') ||
//         doc.fileName.includes('scan_')
//       );
      
//       const originalMode = isScanned ? "Scan" : "Upload";

//       // Prepare the file data for editing with proper structure
//       const editData = {
//         _id: doc._id,
//         type: doc.type,
//         department: doc.department,
//         category: doc.category,
//         subject: doc.subject,
//         date: doc.date ? new Date(doc.date).toISOString().split('T')[0] : '',
//         diaryNo: doc.diaryNo,
//         from: doc.from,
//         disposal: doc.disposal,
//         status: doc.status,
//         extractedText: doc.extractedText || '',
//         fileName: doc.fileName || doc.subject || 'document',
//         isEditMode: true
//       };
      
//       setEditingFile(editData);
//       setAction(originalMode);
//       setShowForm(true);
//     } catch (error) {
//       console.error("Error setting up edit:", error);
//       alert("Error opening edit form");
//     }
//   };

//   const handleDownload = async (doc) => {
//     try {
//       const response = await fetch(`/api/scanupload/${doc._id}?download=true`, {
//         method: "GET",
//       });
      
//       if (!response.ok) {
//         throw new Error(`Download failed: ${response.status}`);
//       }

//       const blob = await response.blob();
      
//       if (!blob || blob.size === 0) {
//         throw new Error('Downloaded file is empty');
//       }

//       downloadBlob(blob, doc);

//     } catch (error) {
//       console.error("Download failed:", error);
//       alert(`Download failed: ${error.message}`);
//     }
//   };

//   const downloadBlob = (blob, doc) => {
//     try {
//       if (!blob || blob.size === 0) {
//         throw new Error('Downloaded file is empty');
//       }

//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.style.display = 'none';
      
//       let fileName = doc.fileName || doc.subject || 'document';
//       fileName = fileName.replace(/[^a-z0-9.-]/gi, '_');
      
//       if (!fileName.toLowerCase().endsWith('.pdf')) {
//         fileName += '.pdf';
//       }
      
//       link.download = fileName;
      
//       document.body.appendChild(link);
//       link.click();
      
//       setTimeout(() => {
//         if (document.body.contains(link)) {
//           document.body.removeChild(link);
//         }
//         window.URL.revokeObjectURL(url);
//       }, 100);
      
//     } catch (error) {
//       console.error('Error creating download:', error);
//       alert('Failed to download file');
//     }
//   };

//   const handleDelete = async (doc) => {
//     if (!confirm(`Are you sure you want to delete "${doc.subject}"?`)) {
//       return;
//     }

//     try {
//       const response = await fetch(`/api/scanupload/${doc._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           action: "soft_delete",
//           isDeleted: true,
//           deletedAt: new Date().toISOString()
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
//         throw new Error(errorData.message || `Delete failed: ${response.status}`);
//       }

//       // Refresh the files list after deletion
//       if (selectedCategory && id) {
//         fetchFiles(id, selectedCategory);
//       }
      
//       alert('Document deleted successfully');
//     } catch (error) {
//       console.error("Delete failed:", error);
//       alert(`Delete failed: ${error.message}`);
//     }
//   };

//   const handleFormClose = () => {
//     setShowForm(false);
//     setEditingFile(null);
//     setAction("");
//     // Refresh the files list after edit
//     if (selectedCategory && id) {
//       fetchFiles(id, selectedCategory);
//     }
//   };

//   return (
//     <>
//       {/* PDF Preview Modal */}
//       {showPreview && previewDoc && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-11/12 h-5/6 flex flex-col">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 {previewDoc.subject}
//               </h2>
//               <button
//                 onClick={closePreview}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="flex-1 p-4">
//               {pdfUrl ? (
//                 <iframe
//                   src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
//                   className="w-full h-full border-0"
//                   title="PDF Preview"
//                   style={{ pointerEvents: 'auto' }}
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <p>Loading PDF...</p>
//                 </div>
//               )}
//             </div>
//             <div className="p-4 border-t flex gap-2 justify-end">
//               <button
//                 onClick={() => handleDownload(previewDoc)}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               >
//                 Download
//               </button>
//               <button
//                 onClick={closePreview}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showForm ? (
//         <div className="mb-6">
//           <ScanUpload
//             fileData={editingFile}
//             action={action}
//             onClose={handleFormClose}
//           />
//         </div>
//       ) : (
//         <div className="p-6 bg-white">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <button
//                 onClick={() => router.back()}
//                 className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
//                 aria-label="Go back"
//               >
//                 <ArrowLeft size={20} />
//               </button>
//               <h1 className="text-2xl font-semibold text-[#111827]">
//                 Department: {name}
//               </h1>
//             </div>

//             <button
//               onClick={() => setShowInput(!showInput)}
//               className="flex items-center gap-2 px-4 py-2 bg-[#1e1b4b] text-white rounded-md hover:bg-[#2e2a5a] transition-colors"
//             >
//               Add Category
//             </button>
//           </div>
          
//           {showInput && (
//             <div className="mt-6 mb-8 p-6 rounded-lg shadow-lg border border-gray-200 bg-white">
//               <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-medium text-[#111827] mb-4">Add New Category</h3>
//           <button
//         onClick={() => setShowInput(false)}
//         className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none"
//         title="Close"
//       >
//         ×
//       </button>
//       </div >
//       <div className="flex gap-4">
//               <input
//                 type="text"
//                 placeholder="Enter Category Name"
//                 value={newCategory}
//                 onChange={(e) => setNewCategory(e.target.value)}
//                 className="px-2 py-2 w-full border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none"
//               />
//               <button
//                 onClick={addCategory}
//                 className="px-5 py-2.5 bg-black text-white rounded-md shadow-sm relative group text-center transition-transform transform hover:scale-110 duration-300"
//               >
//                 Add
//               </button>
//             </div>
//             </div>
//           )}

//           <div className="mt-6">
//             <h3 className="text-lg font-medium mb-2 text-[#111827]">
//               Categories:
//             </h3>
//             <div className="w-full">
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full px-2 py-1 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] cursor-pointer"
//               >
//                 {Array.isArray(categories) && categories.length > 0 ? (
//                   categories.map((category, index) => (
//                     <option key={index} value={category}>
//                       {category}
//                     </option>
//                   ))
//                 ) : (
//                   <option className="w-full text-[#6B7280]">
//                     No categories available
//                   </option>
//                 )}
//               </select>
              
//             </div>
//           </div>

//           <div className="mt-6">
//             <SearchBar
//               searchQuery={searchQuery}
//               setSearchQuery={setSearchQuery}
//             />

//             <div className="overflow-x-auto mt-4 rounded-lg border-2 border-gray-300">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-[#F3F4F6]">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
//                       Subject
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
//                       Diary No
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
//                       From
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
//                       Disposal
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-300">
//                   {isLoading ? (
//                     <tr>
//                       <td colSpan="7" className="px-6 py-4 text-center">
//                         Loading files...
//                       </td>
//                     </tr>
//                   ) : Array.isArray(filteredFiles) && filteredFiles.length > 0 ? (
//                     filteredFiles.map((doc) => (
//                       <tr key={doc._id}>
//                         <td className="px-6 py-4">
//                           <button
//                             onClick={() => handlePreview(doc)}
//                             className="text-light hover:text-mid hover:underline focus:outline-none cursor-pointer text-left"
//                           >
//                             {doc.subject}
//                           </button>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
//                           {doc.date ? new Date(doc.date).toLocaleDateString("en-GB") : 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
//                           {doc.diaryNo || 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
//                           {doc.from || 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
//                           {doc.disposal || 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
//                           {doc.status || 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => handleEdit(doc)}
//                               className="text-blue-600 hover:text-blue-800 cursor-pointer"
//                               title="Edit document"
//                             >
//                               <Edit size={20} />
//                             </button>
//                             <button
//                               onClick={() => handleDownload(doc)}
//                               className="text-green-600 hover:text-green-800 cursor-pointer"
//                               title="Download PDF"
//                             >
//                               <Download size={20} />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(doc)}
//                               className="text-red-600 hover:text-red-800 cursor-pointer"
//                               title="Delete document"
//                             >
//                               <Trash2 size={20} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="7"
//                         className="px-6 py-4 text-center text-gray-500"
//                       >
//                         No files found...
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// } 





















// // "use client"

// // import "@styles/globals.css"

// // import { useState, useEffect } from "react"

// // import { useRouter } from "next/router"

// // import ScanUpload from "@components/ScanUpload"

// // import { Edit, Download, ArrowLeft, Trash2, X } from "lucide-react"

// // import SearchBar from "@components/SearchBar"

// // export default function DepartmentPage() {
// //   const router = useRouter()

// //   const { id, name } = router.query

// //   const [isLoading, setIsLoading] = useState(false)

// //   const [categories, setCategories] = useState(["All"])

// //   const [newCategory, setNewCategory] = useState("")

// //   const [showInput, setShowInput] = useState(false)

// //   const [selectedCategory, setSelectedCategory] = useState("All")

// //   const [files, setFiles] = useState([])

// //   const [editingFile, setEditingFile] = useState(null)

// //   const [showForm, setShowForm] = useState(false)

// //   const [action, setAction] = useState("")

// //   const [searchQuery, setSearchQuery] = useState("")

// //   const [filteredFiles, setFilteredFiles] = useState([])

// //   const [previewDoc, setPreviewDoc] = useState(null)

// //   const [showPreview, setShowPreview] = useState(false)

// //   const [pdfUrl, setPdfUrl] = useState(null)

// //   // New states for delete confirmation and success dialogs
// //   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
// //   const [docToDelete, setDocToDelete] = useState(null)
// //   const [showSuccessMessage, setShowSuccessMessage] = useState(false)

// //   const fetchCategories = async () => {
// //     try {
// //       const response = await fetch(`/api/department/${id}`, {
// //         method: "GET",
// //       })

// //       if (response.ok) {
// //         const data = await response.json()

// //         setCategories(["All", ...data.categories])
// //       } else {
// //         console.error("Failed to fetch categories")
// //       }
// //     } catch (error) {
// //       console.error("Error fetching categories:", error)
// //     }
// //   }

// //   useEffect(() => {
// //     if (!id) return

// //     fetchCategories()
// //   }, [id])

// //   useEffect(() => {
// //     if (!selectedCategory || !id) return

// //     fetchFiles(id, selectedCategory)
// //   }, [selectedCategory, id])

// //   useEffect(() => {
// //     if (searchQuery.trim() === "") {
// //       setFilteredFiles(files)
// //     } else {
// //       const lowercasedQuery = searchQuery.toLowerCase()

// //       const filtered = files.filter(
// //         (file) =>
// //           file.subject?.toLowerCase().includes(lowercasedQuery) ||
// //           file.diaryNo?.toLowerCase().includes(lowercasedQuery) ||
// //           file.from?.toLowerCase().includes(lowercasedQuery),
// //       )

// //       setFilteredFiles(filtered)
// //     }
// //   }, [searchQuery, files])

// //   const addCategory = async () => {
// //     if (newCategory.trim()) {
// //       try {
// //         const response = await fetch(`/api/department/${id}`, {
// //           method: "PUT",

// //           headers: {
// //             "Content-Type": "application/json",
// //           },

// //           body: JSON.stringify({ category: newCategory }),
// //         })

// //         if (response.ok) {
// //           const updatedCategories = await response.json()

// //           if (Array.isArray(updatedCategories)) {
// //             setCategories(["All", ...updatedCategories])
// //           }

// //           setNewCategory("")

// //           setShowInput(false)

// //           fetchCategories()
// //         } else {
// //           console.error("Failed to add category")
// //         }
// //       } catch (error) {
// //         console.error("Error adding category:", error)
// //       }
// //     }
// //   }

// //   const fetchFiles = async (department, category) => {
// //     setIsLoading(true)

// //     try {
// //       let url = `/api/scanupload?department=${department}`

// //       if (category && category !== "All") {
// //         url += `&category=${category}`
// //       }

// //       const response = await fetch(url)

// //       if (response.ok) {
// //         const data = await response.json()

// //         const files = data.documents || []

// //         setFiles(files)

// //         setFilteredFiles(files)
// //       } else {
// //         console.error("Failed to fetch files")

// //         alert("Failed to fetch files")
// //       }
// //     } catch (error) {
// //       console.error("Error fetching files:", error)

// //       alert("Error fetching files")
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const handlePreview = async (doc) => {
// //     try {
// //       setPreviewDoc(doc)

// //       setShowPreview(true)

// //       // Fetch the PDF data

// //       const response = await fetch(`/api/scanupload/${doc._id}?download=true`)

// //       if (response.ok) {
// //         const blob = await response.blob()

// //         const url = URL.createObjectURL(blob)

// //         setPdfUrl(url)
// //       } else {
// //         alert("Failed to load PDF preview")

// //         setShowPreview(false)
// //       }
// //     } catch (error) {
// //       console.error("Preview error:", error)

// //       alert("Failed to load PDF preview")

// //       setShowPreview(false)
// //     }
// //   }

// //   const closePreview = () => {
// //     setShowPreview(false)

// //     setPreviewDoc(null)

// //     if (pdfUrl) {
// //       URL.revokeObjectURL(pdfUrl)

// //       setPdfUrl(null)
// //     }
// //   }

// //   const handleEdit = (doc) => {
// //     try {
// //       // Simple detection: if filename contains scan patterns, it was scanned

// //       const isScanned =
// //         doc.fileName &&
// //         (doc.fileName.includes("a4_scan_") || doc.fileName.includes("scanned_") || doc.fileName.includes("scan_"))

// //       const originalMode = isScanned ? "Scan" : "Upload"

// //       // Prepare the file data for editing with proper structure

// //       const editData = {
// //         _id: doc._id,

// //         type: doc.type,

// //         department: doc.department,

// //         category: doc.category,

// //         subject: doc.subject,

// //         date: doc.date ? new Date(doc.date).toISOString().split("T")[0] : "",

// //         diaryNo: doc.diaryNo,

// //         from: doc.from,

// //         disposal: doc.disposal,

// //         status: doc.status,

// //         extractedText: doc.extractedText || "",

// //         fileName: doc.fileName || doc.subject || "document",

// //         isEditMode: true,
// //       }

// //       setEditingFile(editData)

// //       setAction(originalMode)

// //       setShowForm(true)
// //     } catch (error) {
// //       console.error("Error setting up edit:", error)

// //       alert("Error opening edit form")
// //     }
// //   }

// //   const handleDownload = async (doc) => {
// //     try {
// //       const response = await fetch(`/api/scanupload/${doc._id}?download=true`, {
// //         method: "GET",
// //       })

// //       if (!response.ok) {
// //         throw new Error(`Download failed: ${response.status}`)
// //       }

// //       const blob = await response.blob()

// //       if (!blob || blob.size === 0) {
// //         throw new Error("Downloaded file is empty")
// //       }

// //       downloadBlob(blob, doc)
// //     } catch (error) {
// //       console.error("Download failed:", error)

// //       alert(`Download failed: ${error.message}`)
// //     }
// //   }

// //   const downloadBlob = (blob, doc) => {
// //     try {
// //       if (!blob || blob.size === 0) {
// //         throw new Error("Downloaded file is empty")
// //       }

// //       const url = window.URL.createObjectURL(blob)

// //       const link = document.createElement("a")

// //       link.href = url

// //       link.style.display = "none"

// //       let fileName = doc.fileName || doc.subject || "document"

// //       fileName = fileName.replace(/[^a-z0-9.-]/gi, "_")

// //       if (!fileName.toLowerCase().endsWith(".pdf")) {
// //         fileName += ".pdf"
// //       }

// //       link.download = fileName

// //       document.body.appendChild(link)

// //       link.click()

// //       setTimeout(() => {
// //         if (document.body.contains(link)) {
// //           document.body.removeChild(link)
// //         }

// //         window.URL.revokeObjectURL(url)
// //       }, 100)
// //     } catch (error) {
// //       console.error("Error creating download:", error)

// //       alert("Failed to download file")
// //     }
// //   }

// //   const handleDelete = (doc) => {
// //     setDocToDelete(doc)
// //     setShowDeleteConfirm(true)
// //   }

// //   const confirmDelete = async () => {
// //     if (!docToDelete) return

// //     try {
// //       const response = await fetch(`/api/scanupload/${docToDelete._id}`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           action: "soft_delete",
// //           isDeleted: true,
// //           deletedAt: new Date().toISOString(),
// //         }),
// //       })

// //       if (!response.ok) {
// //         const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
// //         throw new Error(errorData.message || `Delete failed: ${response.status}`)
// //       }

// //       // Close delete confirmation dialog
// //       setShowDeleteConfirm(false)
// //       setDocToDelete(null)

// //       // Refresh the files list after deletion
// //       if (selectedCategory && id) {
// //         await fetchFiles(id, selectedCategory)
// //       }

// //       // Show success message
// //       setShowSuccessMessage(true)
// //     } catch (error) {
// //       console.error("Delete failed:", error)
// //       alert(`Delete failed: ${error.message}`)
// //       setShowDeleteConfirm(false)
// //       setDocToDelete(null)
// //     }
// //   }

// //   const cancelDelete = () => {
// //     setShowDeleteConfirm(false)
// //     setDocToDelete(null)
// //   }

// //   const closeSuccessMessage = () => {
// //     setShowSuccessMessage(false)
// //   }

// //   const handleFormClose = () => {
// //     setShowForm(false)

// //     setEditingFile(null)

// //     setAction("")

// //     // Refresh the files list after edit

// //     if (selectedCategory && id) {
// //       fetchFiles(id, selectedCategory)
// //     }
// //   }

// //   return (
// //     <>
// //       {/* Delete Confirmation Dialog */}
// //       {showDeleteConfirm && docToDelete && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
// //               <button onClick={cancelDelete} className="text-gray-400 hover:text-gray-600">
// //                 <X size={20} />
// //               </button>
// //             </div>
// //             <div className="mb-6">
// //               <p className="text-gray-600">Are you sure you want to delete "{docToDelete.subject}"?</p>
// //               <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
// //             </div>
// //             <div className="flex gap-3 justify-end">
// //               <button
// //                 onClick={cancelDelete}
// //                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={confirmDelete}
// //                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Success Message Dialog */}
// //       {showSuccessMessage && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-lg font-semibold text-green-600">Success</h3>
// //               <button onClick={closeSuccessMessage} className="text-gray-400 hover:text-gray-600">
// //                 <X size={20} />
// //               </button>
// //             </div>
// //             <div className="mb-6">
// //               <p className="text-gray-600">Document deleted successfully!</p>
// //             </div>
// //             <div className="flex justify-end">
// //               <button
// //                 onClick={closeSuccessMessage}
// //                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
// //               >
// //                 OK
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* PDF Preview Modal */}

// //       {showPreview && previewDoc && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg w-11/12 h-5/6 flex flex-col">
// //             <div className="flex justify-between items-center p-4 border-b">
// //               <h2 className="text-lg font-semibold text-gray-800">{previewDoc.subject}</h2>

// //               <button onClick={closePreview} className="text-gray-500 hover:text-gray-700">
// //                 <X size={24} />
// //               </button>
// //             </div>

// //             <div className="flex-1 p-4">
// //               {pdfUrl ? (
// //                 <iframe
// //                   src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
// //                   className="w-full h-full border-0"
// //                   title="PDF Preview"
// //                   style={{ pointerEvents: "auto" }}
// //                 />
// //               ) : (
// //                 <div className="w-full h-full flex items-center justify-center">
// //                   <p>Loading PDF...</p>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="p-4 border-t flex gap-2 justify-end">
// //               <button
// //                 onClick={() => handleDownload(previewDoc)}
// //                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
// //               >
// //                 Download
// //               </button>

// //               <button onClick={closePreview} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {showForm ? (
// //         <div className="mb-6">
// //           <ScanUpload fileData={editingFile} action={action} onClose={handleFormClose} />
// //         </div>
// //       ) : (
// //         <div className="p-6 bg-white">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center">
// //               <button
// //                 onClick={() => router.back()}
// //                 className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
// //                 aria-label="Go back"
// //               >
// //                 <ArrowLeft size={20} />
// //               </button>

// //               <h1 className="text-2xl font-semibold text-[#111827]">Department: {name}</h1>
// //             </div>

// //             <button
// //               onClick={() => setShowInput(!showInput)}
// //               className="flex items-center gap-2 px-4 py-2 bg-[#1e1b4b] text-white rounded-md hover:bg-[#2e2a5a] transition-colors"
// //             >
// //               Add Category
// //             </button>
// //           </div>

// //           {showInput && (
// //             <div className="mt-6 mb-8 p-6 rounded-lg shadow-lg border border-gray-200 bg-white">
// //               <div className="flex justify-between items-center mb-4">
// //                 <h3 className="text-lg font-medium text-[#111827] mb-4">Add New Category</h3>

// //                 <button
// //                   onClick={() => setShowInput(false)}
// //                   className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none"
// //                   title="Close"
// //                 >
// //                   ×
// //                 </button>
// //               </div>

// //               <div className="flex gap-4">
// //                 <input
// //                   type="text"
// //                   placeholder="Enter Category Name"
// //                   value={newCategory}
// //                   onChange={(e) => setNewCategory(e.target.value)}
// //                   className="px-2 py-2 w-full border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none"
// //                 />

// //                 <button
// //                   onClick={addCategory}
// //                   className="px-5 py-2.5 bg-black text-white rounded-md shadow-sm relative group text-center transition-transform transform hover:scale-110 duration-300"
// //                 >
// //                   Add
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           <div className="mt-6">
// //             <h3 className="text-lg font-medium mb-2 text-[#111827]">Categories:</h3>

// //             <div className="w-full">
// //               <select
// //                 value={selectedCategory}
// //                 onChange={(e) => setSelectedCategory(e.target.value)}
// //                 className="w-full px-2 py-1 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] cursor-pointer"
// //               >
// //                 {Array.isArray(categories) && categories.length > 0 ? (
// //                   categories.map((category, index) => (
// //                     <option key={index} value={category}>
// //                       {category}
// //                     </option>
// //                   ))
// //                 ) : (
// //                   <option className="w-full text-[#6B7280]">No categories available</option>
// //                 )}
// //               </select>
// //             </div>
// //           </div>

// //           <div className="mt-6">
// //             <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

// //             <div className="overflow-x-auto mt-4 rounded-lg border-2 border-gray-300">
// //               <table className="min-w-full bg-white">
// //                 <thead className="bg-[#F3F4F6]">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
// //                       Subject
// //                     </th>

// //                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
// //                       Date
// //                     </th>

// //                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
// //                       Diary No
// //                     </th>

// //                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
// //                       From
// //                     </th>

// //                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
// //                       Disposal
// //                     </th>

// //                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
// //                       Status
// //                     </th>

// //                     <th className="px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
// //                       Actions
// //                     </th>
// //                   </tr>
// //                 </thead>

// //                 <tbody className="divide-y divide-gray-300">
// //                   {isLoading ? (
// //                     <tr>
// //                       <td colSpan="7" className="px-6 py-4 text-center">
// //                         Loading files...
// //                       </td>
// //                     </tr>
// //                   ) : Array.isArray(filteredFiles) && filteredFiles.length > 0 ? (
// //                     filteredFiles.map((doc) => (
// //                       <tr key={doc._id}>
// //                         <td className="px-6 py-4">
// //                           <button
// //                             onClick={() => handlePreview(doc)}
// //                             className="text-light hover:text-mid hover:underline focus:outline-none cursor-pointer text-left"
// //                           >
// //                             {doc.subject}
// //                           </button>
// //                         </td>

// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
// //                           {doc.date ? new Date(doc.date).toLocaleDateString("en-GB") : "N/A"}
// //                         </td>

// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.diaryNo || "N/A"}</td>

// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.from || "N/A"}</td>

// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.disposal || "N/A"}</td>

// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.status || "N/A"}</td>

// //                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                           <div className="flex gap-2">
// //                             <button
// //                               onClick={() => handleEdit(doc)}
// //                               className="text-blue-600 hover:text-blue-800 cursor-pointer"
// //                               title="Edit document"
// //                             >
// //                               <Edit size={20} />
// //                             </button>

// //                             <button
// //                               onClick={() => handleDownload(doc)}
// //                               className="text-green-600 hover:text-green-800 cursor-pointer"
// //                               title="Download PDF"
// //                             >
// //                               <Download size={20} />
// //                             </button>

// //                             <button
// //                               onClick={() => handleDelete(doc)}
// //                               className="text-red-600 hover:text-red-800 cursor-pointer"
// //                               title="Delete document"
// //                             >
// //                               <Trash2 size={20} />
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>
// //                       <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
// //                         No files found...
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   )
// // }















































"use client"
import "@styles/globals.css"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import ScanUpload from "@components/ScanUpload"
import { Edit, Download, ArrowLeft, Trash2, X, CheckCircle, AlertTriangle } from "lucide-react"
import SearchBar from "@components/SearchBar"

export default function DepartmentPage() {
  const router = useRouter()
  const { id, name } = router.query
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState(["All"])
  const [newCategory, setNewCategory] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [files, setFiles] = useState([])
  const [editingFile, setEditingFile] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [action, setAction] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFiles, setFilteredFiles] = useState([])
  const [previewDoc, setPreviewDoc] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  // Delete confirmation dialog states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [docToDelete, setDocToDelete] = useState(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/department/${id}`, {
        method: "GET",
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(["All", ...data.categories])
      } else {
        console.error("Failed to fetch categories")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    if (!id) return
    fetchCategories()
  }, [id])

  useEffect(() => {
    if (!selectedCategory || !id) return
    fetchFiles(id, selectedCategory)
  }, [selectedCategory, id])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFiles(files)
    } else {
      const lowercasedQuery = searchQuery.toLowerCase()
      const filtered = files.filter(
        (file) =>
          file.subject?.toLowerCase().includes(lowercasedQuery) ||
          file.diaryNo?.toLowerCase().includes(lowercasedQuery) ||
          file.from?.toLowerCase().includes(lowercasedQuery),
      )
      setFilteredFiles(filtered)
    }
  }, [searchQuery, files])

  // Auto hide success toast after 3 seconds
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessToast])

  const addCategory = async () => {
    if (newCategory.trim()) {
      try {
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
      } catch (error) {
        console.error("Error adding category:", error)
      }
    }
  }

  const fetchFiles = async (department, category) => {
    setIsLoading(true)
    try {
      let url = `/api/scanupload?department=${department}`
      if (category && category !== "All") {
        url += `&category=${category}`
      }
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        const files = data.documents || []
        setFiles(files)
        setFilteredFiles(files)
      } else {
        console.error("Failed to fetch files")
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = async (doc) => {
    try {
      setPreviewDoc(doc)
      setShowPreview(true)
      // Fetch the PDF data
      const response = await fetch(`/api/scanupload/${doc._id}?download=true`)
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
      } else {
        console.error("Failed to load PDF preview")
        setShowPreview(false)
      }
    } catch (error) {
      console.error("Preview error:", error)
      setShowPreview(false)
    }
  }

  const closePreview = () => {
    setShowPreview(false)
    setPreviewDoc(null)
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
    }
  }

  const handleEdit = (doc) => {
    try {
      // Simple detection: if filename contains scan patterns, it was scanned
      const isScanned =
        doc.fileName &&
        (doc.fileName.includes("a4_scan_") || doc.fileName.includes("scanned_") || doc.fileName.includes("scan_"))
      const originalMode = isScanned ? "Scan" : "Upload"

      // Prepare the file data for editing with proper structure
      const editData = {
        _id: doc._id,
        type: doc.type,
        department: doc.department,
        category: doc.category,
        subject: doc.subject,
        date: doc.date ? new Date(doc.date).toISOString().split("T")[0] : "",
        diaryNo: doc.diaryNo,
        from: doc.from,
        disposal: doc.disposal,
        status: doc.status,
        extractedText: doc.extractedText || "",
        fileName: doc.fileName || doc.subject || "document",
        isEditMode: true,
      }

      setEditingFile(editData)
      setAction(originalMode)
      setShowForm(true)
    } catch (error) {
      console.error("Error setting up edit:", error)
    }
  }

  const handleDownload = async (doc) => {
    try {
      const response = await fetch(`/api/scanupload/${doc._id}?download=true`, {
        method: "GET",
      })
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`)
      }
      const blob = await response.blob()
      if (!blob || blob.size === 0) {
        throw new Error("Downloaded file is empty")
      }
      downloadBlob(blob, doc)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const downloadBlob = (blob, doc) => {
    try {
      if (!blob || blob.size === 0) {
        throw new Error("Downloaded file is empty")
      }
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.style.display = "none"

      let fileName = doc.fileName || doc.subject || "document"
      fileName = fileName.replace(/[^a-z0-9.-]/gi, "_")
      if (!fileName.toLowerCase().endsWith(".pdf")) {
        fileName += ".pdf"
      }
      link.download = fileName

      document.body.appendChild(link)
      link.click()

      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link)
        }
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error("Error creating download:", error)
    }
  }

  const handleDelete = (doc) => {
    setDocToDelete(doc)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!docToDelete) return

    try {
      const response = await fetch(`/api/scanupload/${docToDelete._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "soft_delete",
          isDeleted: true,
          deletedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        throw new Error(errorData.message || `Delete failed: ${response.status}`)
      }

      // Close delete confirmation dialog
      setShowDeleteConfirm(false)
      setDocToDelete(null)

      // Refresh the files list after deletion
      if (selectedCategory && id) {
        await fetchFiles(id, selectedCategory)
      }

      // Show success toast
      setShowSuccessToast(true)
    } catch (error) {
      console.error("Delete failed:", error)
      setShowDeleteConfirm(false)
      setDocToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setDocToDelete(null)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingFile(null)
    setAction("")
    // Refresh the files list after edit
    if (selectedCategory && id) {
      fetchFiles(id, selectedCategory)
    }
  }

  return (
    <>
      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-white border-l-4 border-green-500 rounded-r-2xl shadow-lg p-4 flex items-center space-x-3 min-w-80">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#111827]">Successfully Deleted!</p>
              <p className="text-xs text-[#6B7280]">Document has been removed from your files</p>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="flex-shrink-0 text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && docToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-[#111827] mb-3">Delete?</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Are you sure you want to delete "{docToDelete.subject}"?
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">This action cannot be undone</span>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 text-[#6B7280] bg-[#F3F4F6] rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPreview && previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">{previewDoc.subject}</h2>
              <button onClick={closePreview} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-4">
              {pdfUrl ? (
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                  style={{ pointerEvents: "auto" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p>Loading PDF...</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex gap-2 justify-end">
              <button
                onClick={() => handleDownload(previewDoc)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download
              </button>
              <button onClick={closePreview} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm ? (
        <div className="mb-6">
          <ScanUpload fileData={editingFile} action={action} onClose={handleFormClose} />
        </div>
      ) : (
        <div className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-semibold text-[#111827]">Department: {name}</h1>
            </div>
            <button
              onClick={() => setShowInput(!showInput)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e1b4b] text-white rounded-md hover:bg-[#2e2a5a] transition-colors"
            >
              Add Category
            </button>
          </div>

          {showInput && (
            <div className="mt-6 mb-8 p-6 rounded-lg shadow-lg border border-gray-200 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-[#111827] mb-4">Add New Category</h3>
                <button
                  onClick={() => setShowInput(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none"
                  title="Close"
                >
                  ×
                </button>
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter Category Name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="px-2 py-2 w-full border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none"
                />
                <button
                  onClick={addCategory}
                  className="px-5 py-2.5 bg-black text-white rounded-md shadow-sm relative group text-center transition-transform transform hover:scale-110 duration-300"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-[#111827]">Categories:</h3>
            <div className="w-full">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2 py-1 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] cursor-pointer"
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
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="overflow-x-auto mt-4 rounded-lg border-2 border-gray-300">
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
                <tbody className="divide-y divide-gray-300">
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center">
                        Loading files...
                      </td>
                    </tr>
                  ) : Array.isArray(filteredFiles) && filteredFiles.length > 0 ? (
                    filteredFiles.map((doc) => (
                      <tr key={doc._id}>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handlePreview(doc)}
                            className="text-light hover:text-mid hover:underline focus:outline-none cursor-pointer text-left"
                          >
                            {doc.subject}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                          {doc.date ? new Date(doc.date).toLocaleDateString("en-GB") : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.diaryNo || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.from || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.disposal || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.status || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(doc)}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              title="Edit document"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => handleDownload(doc)}
                              className="text-green-600 hover:text-green-800 cursor-pointer"
                              title="Download PDF"
                            >
                              <Download size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(doc)}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                              title="Delete document"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No files found...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  )
}



