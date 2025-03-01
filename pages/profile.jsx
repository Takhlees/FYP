
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const Profile = () => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Huba",
    cnic: "3510362259362",
    phone: "0325 8783249",
    email: "hubaijaz356@gmail.com",
    address: "cantt",
  })

  const [editedData, setEditedData] = useState({ ...profileData })

  useEffect(() => {
    // Load profile data from localStorage on component mount
    const storedProfile = localStorage.getItem("profileData")
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile))
      setEditedData(JSON.parse(storedProfile))
    }
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedData({ ...profileData })
  }

  const handleSave = () => {
    setProfileData({ ...editedData })
    // Save to localStorage
    localStorage.setItem("profileData", JSON.stringify(editedData))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedData({ ...profileData })
  }

  const handleChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleClose = () => {
    router.push("/home")
  }

  return (
    <div className="min-h-screen relative">
      {/* Blurred background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.jpg?height=1080&width=1920')",
          filter: "blur(8px)",
          transform: "scale(1.1)",
          zIndex: -1,
        }}
      ></div>

      {/* Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-3xl w-full mx-auto p-6 bg-white rounded-lg shadow-xl relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            {/* Close button */}
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors text-2xl font-bold"
              aria-label="Close profile"
            >
              &#x2715;
            </button>
          </div>
          <div className="border rounded-lg overflow-hidden mb-4">
            <table className="w-full">
              <tbody>
                {Object.entries(profileData).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="p-3 bg-gray-50 w-36 text-gray-700 capitalize">{key}</td>
                    <td className="p-3 w-4 text-gray-600">:</td>
                    <td className="p-3 text-gray-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-full max-w-md px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

