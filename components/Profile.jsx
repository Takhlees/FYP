"use client"

import "@styles/globals.css"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { X, Mail, Briefcase, Pencil, Check, Camera, User } from "lucide-react"
import Image from "next/image"

export default function Profile() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState(null)


  useEffect(() => {
    const savedProfile = localStorage.getItem("profileData")
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      setProfile(parsedProfile)
      setFormData(parsedProfile)
    } else {
      const defaultProfile = {
        name: "IRFAN HASHMI",
        email: "IRFAN@example.com",
        job: "VC OFFICE",
        image: null,
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
    localStorage.setItem("profileData", JSON.stringify(updatedProfile))
  }

  const handleClose = () => {
    router.back() 
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }))
      }
      reader.onerror = () => {
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  if (!profile) {
    return <div>Loading...</div> 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-md p-8 md:p-12 lg:p-16">
        
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </button>

        {isEditing ? (
          <>
            <div className="flex flex-col items-center space-y-8 mb-8">
              <div className="relative w-40 h-40">
                {formData.image ? (
                  <Image
                    src={formData.image || "/placeholder.svg"}
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-20 w-20 text-gray-400" />
                  </div>
                )}
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="job"
                    value={formData.job}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-6 mb-8">
              <div className="relative w-40 h-40">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-20 w-20 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                <p className="text-gray-600 mb-1">{profile.job}</p>
                <div className="flex items-center justify-center space-x-2 text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

