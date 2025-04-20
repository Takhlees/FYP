
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import SignInForm from '../../components/sign-in-form'
import Loading from '../loading';

const Page=()=> {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false)

  const handleSignInSuccess = () => {
    setIsSignedIn(true)
  }

  useEffect(() => {
    if (isSignedIn) {
      router.push('/home');
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex flex-col min-h-screen">
    
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!isSignedIn ? (
            <SignInForm onSignInSuccess={handleSignInSuccess} />
          ) : (
           
            // <p>Redirecting to home...</p> 
              <Loading/>
            
          )}
        </div>
      </main>
      
    </div>
  )
}
export default Page;


