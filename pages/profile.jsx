
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Mail, Briefcase, Pencil, Check, Camera, User } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState(null)

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("profileData")
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      setProfile(parsedProfile)
      setFormData(parsedProfile)
    } else {
      // If no saved data, use the default profile
      const defaultProfile = {
        name: "John Doe",
        email: "john.doe@example.com",
        job: "Software Developer",
        image: "/background.jpg?height=128&width=128",
      }
      setProfile(defaultProfile)
      setFormData(defaultProfile)
      localStorage.setItem("profileData", JSON.stringify(defaultProfile))
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    const updatedProfile = { ...formData }
    setProfile(updatedProfile)
    setIsEditing(false)
    // Save to localStorage
    localStorage.setItem("profileData", JSON.stringify(updatedProfile))
  }

  const handleClose = () => {
    router.back() // This will navigate to the previous page
  }

  if (!profile) {
    return <div>Loading...</div> // Or any loading indicator
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {/* Cross button in the top-right corner */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </button>

        {isEditing ? (
          /* Edit Mode */
          <>
            <div className="flex flex-col items-center space-y-6 mb-6">
              <div className="relative">
                <Image
                  src={profile.image || "/background.jpg"}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full"
                />
                <button className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                  />
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    type="email"
                  />
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">
                    <Briefcase className="h-5 w-5" />
                  </span>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    name="job"
                    value={formData.job}
                    onChange={handleInputChange}
                    placeholder="Job Title"
                  />
                </div>
              </div>
            </div>

            <button
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center"
              onClick={handleSave}
            >
              <Check className="mr-2 h-4 w-4" /> Save Changes
            </button>
          </>
        ) : (
          /* View Mode */
          <>
            <div className="flex flex-col items-center space-y-6 mb-6">
              <Image
                src={profile.image || "/background.jpg"}
                alt="Profile"
                width={128}
                height={128}
                className="rounded-full"
              />

              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">{profile.name}</h2>

                <div className="flex items-center justify-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{profile.email}</span>
                </div>

                <div className="flex items-center justify-center text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{profile.job}</span>
                </div>
              </div>
            </div>

            <button
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  )
}


