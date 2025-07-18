"use client"

import "@styles/globals.css"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { X, Mail, Briefcase, Pencil, Check, Camera, User } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
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
        console.error("An error occurred reading the file")
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
                  className="absolute bottom-0 right-0 bg-gray-800 text-white p-3 rounded-full"
                  onClick={triggerFileInput}
                  type="button"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="w-full space-y-6">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-4">
                    <User className="h-6 w-6" />
                  </span>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-lg"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                  />
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 mr-4">
                    <Mail className="h-6 w-6" />
                  </span>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-lg"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    type="email"
                  />
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 mr-4">
                    <Briefcase className="h-6 w-6" />
                  </span>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-lg"
                    name="job"
                    value={formData.job}
                    onChange={handleInputChange}
                    placeholder="Job Title"
                  />
                </div>
              </div>
            </div>

            <button
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center text-lg"
              onClick={handleSave}
            >
              <Check className="mr-2 h-5 w-5" /> Save Changes
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-8 mb-8">
              <div className="relative w-40 h-40">
                {profile.image ? (
                  <Image
                    src={profile.image || "/placeholder.svg"}
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
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold">{profile.name}</h2>

                <div className="flex items-center justify-center text-gray-600 text-lg">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>{profile.email}</span>
                </div>

                <div className="flex items-center justify-center text-gray-600 text-lg">
                  <Briefcase className="h-5 w-5 mr-3" />
                  <span>{profile.job}</span>
                </div>
              </div>
            </div>

            <button
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center text-lg"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="mr-2 h-5 w-5" /> Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  )
}

