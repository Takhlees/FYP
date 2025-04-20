
// // "use client"

// // import { useState, useEffect } from "react"
// // import { useRouter } from "next/navigation"
// // import { X, Mail, Briefcase, Pencil, Check, Camera, User } from "lucide-react"
// // import Image from "next/image"

// // export default function ProfilePage() {
// //   const router = useRouter()
// //   const [isEditing, setIsEditing] = useState(false)
// //   const [profile, setProfile] = useState(null)
// //   const [formData, setFormData] = useState(null)

// //   // Load profile data from localStorage on component mount
// //   useEffect(() => {
// //     const savedProfile = localStorage.getItem("profileData")
// //     if (savedProfile) {
// //       const parsedProfile = JSON.parse(savedProfile)
// //       setProfile(parsedProfile)
// //       setFormData(parsedProfile)
// //     } else {
// //       // If no saved data, use the default profile
// //       const defaultProfile = {
// //         name: "John Doe",
// //         email: "john.doe@example.com",
// //         job: "Software Developer",
// //         image: "/background.jpg?height=128&width=128",
// //       }
// //       setProfile(defaultProfile)
// //       setFormData(defaultProfile)
// //       localStorage.setItem("profileData", JSON.stringify(defaultProfile))
// //     }
// //   }, [])

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target
// //     setFormData((prev) => ({ ...prev, [name]: value }))
// //   }

// //   const handleSave = () => {
// //     const updatedProfile = { ...formData }
// //     setProfile(updatedProfile)
// //     setIsEditing(false)
// //     // Save to localStorage
// //     localStorage.setItem("profileData", JSON.stringify(updatedProfile))
// //   }

// //   const handleClose = () => {
// //     router.back() // This will navigate to the previous page
// //   }

// //   if (!profile) {
// //     return <div>Loading...</div> // Or any loading indicator
// //   }

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <div className="relative w-full max-w-md bg-white rounded-lg shadow-md p-8">
// //         {/* Cross button in the top-right corner */}
// //         <button
// //           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
// //           onClick={handleClose}
// //         >
// //           <X className="h-5 w-5" />
// //         </button>

// //         {isEditing ? (
// //           /* Edit Mode */
// //           <>
// //             <div className="flex flex-col items-center space-y-6 mb-6">
// //               <div className="relative">
// //                 <Image
// //                   src={profile.image || "/background.jpg"}
// //                   alt="Profile"
// //                   width={128}
// //                   height={128}
// //                   className="rounded-full"
// //                 />
// //                 <button className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full">
// //                   <Camera className="h-4 w-4" />
// //                 </button>
// //               </div>

// //               <div className="w-full space-y-4">
// //                 <div className="flex items-center">
// //                   <span className="text-gray-500 mr-3">
// //                     <User className="h-5 w-5" />
// //                   </span>
// //                   <input
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
// //                     name="name"
// //                     value={formData.name}
// //                     onChange={handleInputChange}
// //                     placeholder="Name"
// //                   />
// //                 </div>

// //                 <div className="flex items-center">
// //                   <span className="text-gray-500 mr-3">
// //                     <Mail className="h-5 w-5" />
// //                   </span>
// //                   <input
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
// //                     name="email"
// //                     value={formData.email}
// //                     onChange={handleInputChange}
// //                     placeholder="Email"
// //                     type="email"
// //                   />
// //                 </div>

// //                 <div className="flex items-center">
// //                   <span className="text-gray-500 mr-3">
// //                     <Briefcase className="h-5 w-5" />
// //                   </span>
// //                   <input
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
// //                     name="job"
// //                     value={formData.job}
// //                     onChange={handleInputChange}
// //                     placeholder="Job Title"
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             <button
// //               className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center"
// //               onClick={handleSave}
// //             >
// //               <Check className="mr-2 h-4 w-4" /> Save Changes
// //             </button>
// //           </>
// //         ) : (
// //           /* View Mode */
// //           <>
// //             <div className="flex flex-col items-center space-y-6 mb-6">
// //               <Image
// //                 src={profile.image || "/background.jpg"}
// //                 alt="Profile"
// //                 width={128}
// //                 height={128}
// //                 className="rounded-full"
// //               />

// //               <div className="text-center space-y-4">
// //                 <h2 className="text-2xl font-bold">{profile.name}</h2>

// //                 <div className="flex items-center justify-center text-gray-600">
// //                   <Mail className="h-4 w-4 mr-2" />
// //                   <span>{profile.email}</span>
// //                 </div>

// //                 <div className="flex items-center justify-center text-gray-600">
// //                   <Briefcase className="h-4 w-4 mr-2" />
// //                   <span>{profile.job}</span>
// //                 </div>
// //               </div>
// //             </div>

// //             <button
// //               className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center"
// //               onClick={() => setIsEditing(true)}
// //             >
// //               <Pencil className="mr-2 h-4 w-4" /> Edit Profile
// //             </button>
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }



// "use client"

// import { useState, useRef } from "react"
// import { Camera } from "lucide-react"

// function ProfilePage() {
//   const [isEditMode, setIsEditMode] = useState(false)
//   const defaultProfile = {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     job: "Software Developer",
//     image: "/placeholder.svg?height=128&width=128",
//   }
//   const [formData, setFormData] = useState({
//     name: "John Doe",
//     bio: "Software Engineer",
//     image: null,
//   })

//   const fileInputRef = useRef(null)

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (event) => {
//         const imageDataUrl = event.target.result
//         setFormData((prev) => ({ ...prev, image: imageDataUrl }))
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     setIsEditMode(false)
//     // Here you would typically send the form data to your backend
//     console.log("Form Data Submitted:", formData)
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="relative">
//         <img
//           src={formData.image || "/placeholder.svg?height=128&width=128"}
//           alt="Profile"
//           className="rounded-full h-32 w-32 object-cover"
//         />
//         {isEditMode && (
//           <>
//             <button
//               className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full"
//               onClick={() => fileInputRef.current.click()}
//             >
//               <Camera className="h-4 w-4" />
//             </button>
//             <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
//           </>
//         )}
//       </div>

//       {isEditMode ? (
//         <form onSubmit={handleSubmit} className="mt-4">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//               Name:
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>
//           <div className="mt-2">
//             <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
//               Bio:
//             </label>
//             <textarea
//               id="bio"
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>
//           <div className="mt-4">
//             <button
//               type="submit"
//               className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsEditMode(false)}
//               className="ml-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       ) : (
//         <div className="mt-4">
//           <h2 className="text-xl font-semibold">{formData.name}</h2>
//           <p className="text-gray-600">{formData.bio}</p>
//           <button
//             onClick={() => setIsEditMode(true)}
//             className="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//           >
//             Edit Profile
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ProfilePage

"use client"

import "@styles/globals.css";
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
    // Save to localStorage
    localStorage.setItem("profileData", JSON.stringify(updatedProfile))
  }

  const handleClose = () => {
    router.back() // This will navigate to the previous page
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
    return <div>Loading...</div> // Or any loading indicator
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-md p-20">
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
              <div className="relative w-32 h-32">
                {formData.image ? (
                  <Image
                    src={formData.image || "/placeholder.svg"}
                    alt="Profile"
                    layout="fill" // Ensures the image fills the container
    objectFit="cover" // Ensures the image doesn't stretch
    className="rounded-full"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <button
                  className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full"
                  onClick={triggerFileInput}
                  type="button"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
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
            <div className="relative w-32 h-32">
                {formData.image ? (
                  <Image
                    src={formData.image || "/placeholder.svg"}
                    alt="Profile"
                    layout="fill" // Ensures the image fills the container
    objectFit="cover" // Ensures the image doesn't stretch
    className="rounded-full"
                  />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
</div>
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

