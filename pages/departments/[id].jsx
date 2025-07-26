"use client"
import "@styles/globals.css"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import ScanUpload from "@components/ScanUpload"
import { Edit, Download, ArrowLeft, Trash2, X, CheckCircle, AlertTriangle, Save } from "lucide-react"
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
  const [showCategorySelect, setShowCategorySelect] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  // Add new state for category deletion dialog
  const [showCategoryDeleteDialog, setShowCategoryDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  // Add new state for category editing
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

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

  const closeSuccessMessage = () => {
    setShowSuccessMessage(false)
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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setShowCategorySelect(false)
  }

  // Handler to open delete dialog for a category
  const handleCategoryDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowCategoryDeleteDialog(true);
  };
  // Handler to confirm category deletion
  const confirmCategoryDelete = async () => {
    if (!categoryToDelete || !id) return;
    try {
      const params = new URLSearchParams({ departmentId: id, category: categoryToDelete });
      const response = await fetch(`/api/department/category?${params.toString()}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setShowCategoryDeleteDialog(false);
        setCategoryToDelete(null);
        setShowCategorySelect(false); // close modal
        await fetchCategories(); // refresh categories
        setShowCategorySelect(true); // reopen modal
      } else {
        // Optionally show error
        setShowCategoryDeleteDialog(false);
        setCategoryToDelete(null);
      }
    } catch (error) {
      setShowCategoryDeleteDialog(false);
      setCategoryToDelete(null);
    }
  };
  // Handler to cancel category deletion
  const cancelCategoryDelete = () => {
    setShowCategoryDeleteDialog(false);
    setCategoryToDelete(null);
  };

  // Handler to start editing a category
  const handleCategoryEditClick = (category) => {
    setEditingCategory(category);
    setEditedCategoryName(category);
  };

  // Handler to save category edit
  const saveCategoryEdit = async () => {
    if (!editingCategory || !editedCategoryName.trim() || !id) return;
    
    try {
      const params = new URLSearchParams({ 
        departmentId: id, 
        oldCategory: editingCategory, 
        newCategory: editedCategoryName.trim() 
      });
      const response = await fetch(`/api/department/category?${params.toString()}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        setEditingCategory(null);
        setEditedCategoryName("");
        await fetchCategories(); // refresh categories
        setShowCategorySelect(true); // reopen modal
      } else {
        const errorData = await response.json();
        console.error("Failed to update category:", errorData.error);
        // Optionally show error message to user
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Handler to cancel category editing
  const cancelCategoryEdit = () => {
    setEditingCategory(null);
    setEditedCategoryName("");
  };

  // Add useEffect to control body scroll when category selector is open
  useEffect(() => {
    if (showCategorySelect) {
      document.body.style.overflow = 'hidden';
      setCategorySearch("");
      setEditingCategory(null);
      setEditedCategoryName("");
    } else {
      document.body.style.overflow = 'unset';
    }    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCategorySelect]);

  // Filter categories based on search
  const filteredCategories = categories.filter(category => 
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  useEffect(() => {
    if (showForm) {
      // Lock body scroll and force to top
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      window.scrollTo(0, 0);
      
      // Force the form container to top
      const formContainer = document.querySelector('.overflow-y-auto');
      if (formContainer) {
        formContainer.scrollTop = 0;
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.height = '';
    }

    return () => {
      // Cleanup
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [showForm]);

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

      {/* PDF Preview Modal */}      {showPreview && previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">{previewDoc.subject}</h2>
              <button onClick={closePreview} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-4">              {pdfUrl ? (
                <embed
                  src={pdfUrl}
                  type="application/pdf"
                  className="w-full h-full border-0"
                  style={{ 
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p>Loading PDF...</p>
                </div>
              )}
            </div>            <div className="p-4 border-t flex gap-2 justify-end">
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
      )}      {showForm ? (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto overflow-x-hidden" style={{ top: 0 }}>
            <div className="w-full">
              <div className="w-full bg-white">
                <div className="-mx-6 sm:mx-0">
                  <ScanUpload fileData={editingFile} action={action} onClose={handleFormClose} />
                </div>
              </div>
            </div>
          </div>
      ) : (
        <div className="p-3 sm:p-6 bg-white">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-3 sm:mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#111827] truncate pr-2">
                Department: {name}
              </h1>
            </div>
            <button
              onClick={() => setShowInput(!showInput)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#1e1b4b] text-white rounded-md hover:bg-[#2e2a5a] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-none"
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
            <div className="w-full relative">
              <button
                onClick={() => setShowCategorySelect(true)}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] cursor-pointer flex items-center justify-between text-left"
              >
                <span className={selectedCategory === "All" ? "text-gray-500" : "text-gray-900"}>
                  {selectedCategory}
                </span>
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Category Selector Modal/Bottom Sheet */}
              {showCategorySelect && (
                <div className="fixed inset-0 z-50 md:flex md:items-center md:justify-center">
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" 
                    onClick={() => setShowCategorySelect(false)}
                  />
                  

                  <div className="fixed inset-x-0 bottom-0 transform md:relative md:inset-auto md:transform-none">
                    <div className="bg-white rounded-t-2xl md:rounded-xl shadow-xl max-h-[80vh] md:max-h-[600px] md:w-[400px] flex flex-col overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Select Category</h2>
                        <button 
                          onClick={() => setShowCategorySelect(false)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Search */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search categories..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] pl-10"
                          />
                          <svg 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>

                      {/* Category List */}
                      <div className="flex-1 overflow-y-auto">
                        {filteredCategories.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No categories found
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200">
                            {filteredCategories.map((category, index) => (
                              <div key={index} className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 ${selectedCategory === category ? 'bg-indigo-50' : ''}`}>
                                {editingCategory === category ? (
                                  // Edit mode
                                  <div className="flex-1 flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={editedCategoryName}
                                      onChange={(e) => setEditedCategoryName(e.target.value)}
                                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          saveCategoryEdit();
                                        } else if (e.key === 'Escape') {
                                          cancelCategoryEdit();
                                        }
                                      }}
                                      autoFocus
                                    />
                                    <button
                                      onClick={saveCategoryEdit}
                                      className="text-green-600 hover:text-green-700 focus:outline-none p-2 min-w-[40px] min-h-[40px]"
                                      title="Save category"
                                    >
                                      <Save size={18} />
                                    </button>
                                    <button
                                      onClick={cancelCategoryEdit}
                                      className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 min-w-[40px] min-h-[40px]"
                                      title="Cancel edit"
                                    >
                                      <X size={18} />
                                    </button>
                                  </div>
                                ) : (
                                  // View mode
                                  <>
                                    <button
                                      onClick={() => handleCategorySelect(category)}
                                      className={`flex-1 text-left focus:outline-none truncate ${selectedCategory === category ? 'text-indigo-600 font-medium' : 'text-gray-900'}`}
                                      style={{ maxWidth: '70vw' }}
                                    >
                                      {category}
                                    </button>
                                    {category !== 'All' && (
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => handleCategoryEditClick(category)}
                                          className="text-blue-600 hover:text-blue-700 focus:outline-none p-2 min-w-[40px] min-h-[40px]"
                                          title="Edit category"
                                        >
                                          <Edit size={18} />
                                        </button>
                                        <button
                                          onClick={() => handleCategoryDeleteClick(category)}
                                          className="text-red-500 hover:text-red-700 focus:outline-none p-2 min-w-[40px] min-h-[40px]"
                                          title="Delete category"
                                        >
                                          <Trash2 size={18} />
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom padding for mobile */}
                      <div className="h-safe-area-bottom md:hidden" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />            <div className="overflow-x-auto mt-4 rounded-lg border-2 border-gray-300">
              <table className="min-w-full bg-white">
                <thead className="bg-[#F3F4F6]">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Diary No
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      From
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Disposal
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-[#111827] uppercase tracking-wider">
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
                      <tr key={doc._id}>                        <td className="px-3 sm:px-6 py-4">
                          <button
                            onClick={() => handlePreview(doc)}
                            className="text-light hover:text-mid hover:underline focus:outline-none cursor-pointer text-left text-sm sm:text-base"
                          >
                            <span className="line-clamp-2 sm:line-clamp-1">{doc.subject}</span>
                            <span className="text-xs text-gray-500 block sm:hidden mt-1">
                              {doc.date ? new Date(doc.date).toLocaleDateString("en-GB") : "N/A"}
                            </span>
                          </button>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                          {doc.date ? new Date(doc.date).toLocaleDateString("en-GB") : "N/A"}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.diaryNo || "N/A"}</td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.from || "N/A"}</td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{doc.disposal || "N/A"}</td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-[#6B7280]">
                          <span className="px-2 py-1 rounded-full bg-gray-100">{doc.status || "N/A"}</span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2 justify-end sm:justify-start">
                            <button
                              onClick={() => handleEdit(doc)}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer p-1.5 sm:p-1"
                              title="Edit document"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDownload(doc)}
                              className="text-green-600 hover:text-green-800 cursor-pointer p-1.5 sm:p-1"
                              title="Download PDF"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(doc)}
                              className="text-red-600 hover:text-red-800 cursor-pointer p-1.5 sm:p-1"
                              title="Delete document"
                            >
                              <Trash2 size={18} />
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

      {/* Category Delete Confirmation Dialog */}
      {showCategoryDeleteDialog && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-[#111827] mb-3">Delete Category?</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Are you sure you want to delete category "{categoryToDelete}"?
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">This action cannot be undone</span>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={cancelCategoryDelete}
                className="flex-1 px-4 py-3 text-[#6B7280] bg-[#F3F4F6] rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmCategoryDelete}
                className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                Delete
              </button>
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
  );
}