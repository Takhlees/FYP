"use client"

import "@styles/globals.css"
import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Edit, Trash, Folder, Building, BookOpen, FileText, Users } from "lucide-react"
import { PulseLoader } from "react-spinners"
import { showLoadingToast, updateToast } from "@/utils/toast"
import Navbar from "@components/Navbar"
import Footer from "@components/Footer"

function DepartmentsPageContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const [departments, setDepartments] = useState([])
  const [newDepartment, setNewDepartment] = useState("")
  const [departmentType, setDepartmentType] = useState("uni")
  const [showInput, setShowInput] = useState(false)
  const [editingDepartmentId, setEditingDepartmentId] = useState(null)
  const [editedDepartmentName, setEditedDepartmentName] = useState("")
  const [editedType, setEditedType] = useState(type)
  const [isLoading, setIsLoading] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState(null)

  const router = useRouter()

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/department?type=${type}`, {
          method: "GET",
        })
        const data = await response.json()
        setDepartments(data)
      } catch (error) {
        console.error("Failed to fetch departments:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDepartments()
  }, [type])

  const addDepartment = async () => {
    if (newDepartment.trim()) {
      setIsLoading(true)
      const loadingToast = showLoadingToast("Adding Department")

      try {
        const response = await fetch("/api/department", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newDepartment, type: departmentType }),
        })

        if (response.ok) {
          const newDept = await response.json()
          setDepartments([...departments, newDept])
          setNewDepartment("")
          setDepartmentType("uni")
          setShowInput(false)
          updateToast(loadingToast, 'success', "Department Added!", "Department has been added successfully.")
        } else {
          updateToast(loadingToast, 'error', "Failed to Add", "Failed to add department. Please try again.")
        }
      } catch (error) {
        updateToast(loadingToast, 'error', "Error Occurred", "An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    setDepartmentType(type === "uni" ? "uni" : "admin")
  }, [type])

  // Control body scroll when edit modal is open
  useEffect(() => {
    if (editingDepartmentId) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [editingDepartmentId])

  // Reset navigation state after navigation
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isNavigating])

  const goToDepartment = (department) => {
    setIsNavigating(true)
    router.push(`/departments/${department._id}?name=${encodeURIComponent(department.name)}`)
  }

  const startEditing = (department, e) => {
    e.stopPropagation()
    setEditingDepartmentId(department._id)
    setEditedDepartmentName(department.name)
    setEditedType(department.type)
  }

  const saveEdit = async () => {
    if (editedDepartmentName.trim() && editedType.trim()) {
      setIsLoading(true)
      const loadingToast = showLoadingToast("Updating Department")

      try {
        const response = await fetch(`/api/department/${editingDepartmentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editedDepartmentName,
            type: editedType,
          }),
        })

        if (response.ok) {
          const updatedDept = await response.json()
        if (updatedDept.type !== type) {
          setDepartments(departments.filter((dept) => dept._id !== updatedDept._id))
        } else {
          setDepartments(departments.map((dept) => (dept._id === updatedDept._id ? updatedDept : dept)))
        }
          setEditingDepartmentId(null)
          setEditedDepartmentName("")
          setEditedType("")
          updateToast(loadingToast, 'success', "Department Updated!", "Department has been updated successfully.")
        } else {
          updateToast(loadingToast, 'error', "Update Failed", "Failed to update department. Please try again.")
        }
      } catch (error) {
        updateToast(loadingToast, 'error', "Error Occurred", "An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDeleteClick = (id) => {
    setDepartmentToDelete(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!departmentToDelete) return

    setDeletingId(departmentToDelete)
    const loadingToast = showLoadingToast("Deleting Department")

    try {
      const response = await fetch(`/api/department?id=${departmentToDelete}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDepartments(departments.filter((dept) => dept._id !== departmentToDelete))
        updateToast(loadingToast, 'success', "Department Deleted!", "Department has been deleted successfully.")
      } else {
        updateToast(loadingToast, 'error', "Delete Failed", "Failed to delete department. Please try again.")
      }
    } catch (error) {
      updateToast(loadingToast, 'error', "Error Occurred", "An unexpected error occurred. Please try again.")
    } finally {
      setDeletingId(null)
      setShowDeleteDialog(false)
      setDepartmentToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteDialog(false)
    setDepartmentToDelete(null)
  }

  // Function to get a random background pattern class
  const getPatternClass = (index) => {
    const patterns = [
      "bg-gradient-to-br from-[#3B5FE3]/5 to-[#1E213A]/5",
      "bg-gradient-to-tr from-[#3B5FE3]/5 to-[#1E213A]/5",
      "bg-gradient-to-r from-[#3B5FE3]/5 to-[#1E213A]/5",
    ]
    return patterns[index % patterns.length]
  }

  // Function to get a random icon
  const getDepartmentIcon = (type, index) => {
    if (type === "uni") {
      const icons = [<BookOpen key={1} />, <FileText key={2} />]
      return icons[index % icons.length]
    } else {
      const icons = [<Building key={1} />, <Users key={2} />]
      return icons[index % icons.length]
    }
  }

    return (
    <>
      <Navbar />
      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <PulseLoader size={17} color="#d2d4d6" speedMultiplier={0.7} />
          </div>
        </div>
      )}
      
      <div className="min-h-screen flex flex-col m-4 sm:m-4">
        <div className="flex-1 p-3 sm:p-5 bg-white relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-black">
              {type === "uni" ? "University Departments" : "Admin Departments"}
            </h1>
            <p className="text-[#6B7280] mt-1 text-sm sm:text-base">Manage and access your departments</p>
          </div>
          <button
            onClick={() => setShowInput(!showInput)}
            className="max-w-[200px] w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-[#1E213A] text-white rounded-md relative group text-center transition-transform sm:hover:scale-105 duration-300 flex items-center justify-center sm:justify-start gap-2 shadow-sm text-sm sm:text-base touch-none"
            disabled={isLoading || isNavigating}
          >
            <Folder size={18} />
            Add Department
          </button>
        </div>

        {showInput && (
          <div className="mt-1 mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-medium text-[#111827]">Add New Department</h3>
              <button
                onClick={() => setShowInput(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Enter Department Name"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="px-3 py-2.5 w-full border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none text-sm sm:text-base"
                disabled={isLoading || isNavigating}
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <select
                  value={departmentType}
                  onChange={(e) => setDepartmentType(e.target.value)}
                  className="px-3 py-2.5 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none cursor-pointer w-full sm:w-40 text-sm sm:text-base"
                >
                  <option value="uni">University</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={addDepartment}
                  className="w-full sm:w-auto px-5 py-2.5 bg-black text-white rounded-md shadow-sm relative group text-center transition-transform transform sm:hover:scale-105 duration-300 text-sm sm:text-base touch-none"
                  disabled={isLoading || isNavigating}
                >
                  {isLoading ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && departments.length === 0 ? (
          <div className="mt-10 flex justify-center">
            <PulseLoader size={17} color="#d2d4d6" speedMultiplier={0.7} />
          </div>
        ) : departments.length === 0 ? (
          <div className="mt-8 p-8 text-center border-dashed border-[#F3F4F6] rounded-lg">
            <div className="inline-flex p-4 rounded-full bg-[#F3F4F6] mb-4">
              <Folder size={32} className="text-[#6B7280]" />
            </div>
            <p className="text-[#6B7280] text-lg">No departments available</p>
            <p className="text-[#6B7280] text-sm mt-2">Click "Add Department" to create your first department</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6">
            {departments.map((dept, index) => (
              <div
                key={dept._id}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-2 border-gray-300"
                onClick={() => goToDepartment(dept)}
              >
                {/* Card background with pattern */}
                <div className={`absolute inset-0 ${getPatternClass(index)}`}></div>

                {/* Card content */}
                <div className="relative p-4 sm:p-6 h-full flex flex-col">
                  {/* Department icon and name */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="p-2.5 sm:p-3 rounded-lg bg-white shadow-md text-[#3B5FE3] group-hover:text-white group-hover:bg-[#3B5FE3] transition-colors border border-gray-300">
                      {getDepartmentIcon(dept.type, index)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-semibold text-[#111827] group-hover:text-[#3B5FE3] transition-colors truncate">
                        {dept.name}
                      </h2>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end items-center w-full">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => startEditing(dept, e)}
                        className="p-2 rounded-md bg-white shadow-sm text-[#6B7280] hover:text-[#3B5FE3] transition-colors border border-gray-300"
                        disabled={isLoading || isNavigating}
                      >
                        <Edit size={18} className="sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(dept._id)
                        }}
                        className="p-2 rounded-md bg-white shadow-sm text-[#6B7280] hover:text-red-600 transition-colors border border-gray-300"
                        disabled={isLoading || isNavigating}
                      >
                        <Trash size={18} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editingDepartmentId && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setEditingDepartmentId(null)}></div>
            <div className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-50 touch-none">
              <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
                <div className="w-12 h-1 rounded-full bg-gray-300 mx-auto mb-4 mt-2 sm:hidden"></div>
                <div className="px-4 sm:px-6 pb-6 pt-2 sm:pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#111827]">Edit Department</h3>
                    <button
                      onClick={() => setEditingDepartmentId(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none -mt-2"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#6B7280]">Department Name</label>
                      <input
                        className="px-3 py-2.5 border-2 border-gray-300 rounded-md w-full focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none text-base"
                        type="text"
                        value={editedDepartmentName}
                        onChange={(e) => setEditedDepartmentName(e.target.value)}
                        disabled={isLoading || isNavigating}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#6B7280]">Department Type</label>
                      <select
                        className="px-3 py-2.5 border-2 border-gray-300 rounded-md w-full focus:ring-2 focus:ring-[#3B5FE3] focus:border-[#3B5FE3] outline-none text-base mb-4"
                        value={editedType}
                        onChange={(e) => setEditedType(e.target.value)}
                        disabled={isLoading || isNavigating}
                      >
                        <option value="uni">University</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={() => setEditingDepartmentId(null)}
                        className="w-full sm:w-1/2 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-md text-base font-medium order-2 sm:order-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="w-full sm:w-1/2 px-5 py-3 bg-[#3B5FE3] text-white rounded-md text-base font-medium order-1 sm:order-2"
                        disabled={isLoading || isNavigating}
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={cancelDelete}></div>
            <div className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-50 touch-none">
              <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
                <div className="w-12 h-1 rounded-full bg-gray-300 mx-auto mb-4 mt-2 sm:hidden"></div>
                <div className="px-4 sm:px-6 pb-6 pt-2 sm:pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#111827]">Delete Department</h3>
                    <button
                      onClick={cancelDelete}
                      className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none -mt-2"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <Trash className="h-6 w-6 text-red-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Department</h3>
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this department? This action cannot be undone.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={cancelDelete}
                        className="w-full sm:w-1/2 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-md text-base font-medium order-2 sm:order-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="w-full sm:w-1/2 px-5 py-3 bg-black text-white rounded-md text-base font-medium order-1 sm:order-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={deletingId}
                      >
                        {deletingId ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                  </>
      )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function DepartmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DepartmentsPageContent />
    </Suspense>
  )
} 