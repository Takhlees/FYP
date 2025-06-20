
"use client"

import "@styles/globals.css"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import ScanUpload from "@components/ScanUpload"
import { Edit, Download, ArrowLeft } from "lucide-react"
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
          <div className="flex items-center justify-between ">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-semibold  text-[#111827]">Department: {name}</h1>
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
      </div >
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
            {/* Search bar */}
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* Files table */}
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
                  {filteredFiles.map((doc) => (
                    <tr key={doc._id}>
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
                        <a onClick={() => handleEdit(doc)} className="text-light hover:text-mid cursor-pointer mr-4">
                          <Edit size={20} />
                        </a>

                        <a onClick={() => handleDownload(doc)} className="text-light hover:text-mid cursor-pointer">
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
