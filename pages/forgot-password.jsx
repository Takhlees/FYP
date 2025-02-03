// import { useState } from 'react'
// export default function ForgotPassword() {
//   const [email, setEmail] = useState('')
//   const [error, setError] = useState('')
//   // const [message, setMessage] = useState('')

//   const isValidEmail = () => {
//     const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
//     return emailRegex.test(email);
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const email = e.target[0].value;

//     if(!isValidEmail(email)){
//       setError("email is not valid")
//       return;
//     }

//     try {
//           const res = await fetch("/api/forget-password",{
//             method:"POST",
//             headers:{
//               "Content-Type": "application/json"
//             },
//             redirect:false,
//             body: JSON.stringify({
//               email
//             })
//           });
    
    
//           if(res.error){
//             setError((prev) => ({ ...prev, global: res.error }))
//             return
//           }
//             router.push("/home")
          
          
//           if (!isValidEmail(formData.email)) {
//           newErrors.email = 'Please enter a valid email address'
//         }
        
//         setError(newErrors)
        
//       }catch(error){
//         console.log('Forgot password submitted for:', email)
//               setError((prev) => ({
//             ...prev,
//             global: 'An unexpected error occurred. Please try again later.',
//           }))
//       }
//   }

//   return (  
//     <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>

//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email Address
//           </label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           />
//         </div>
//         <div>
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//         </div>
//         <div>
//           <button
//             type="submit"
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Reset Password
//           </button>
        
//         </div>
//       </form>
      
//     </div>
//   )
// }



import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('') // Clear previous errors

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      
      if (!res.ok) {
        const data = await res.json() // Extract response data
        setError(data.error || 'user with this email dont exists.')
        return
      }

      router.push("/") // Redirect if successful
    } catch (error) {
      console.error("Forgot password error:", error)
      setError('An unexpected error occurred. Please try again later.')
    }
  }

  return (  
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Show error below input */}
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  )
}
