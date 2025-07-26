"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import "@styles/globals.css"
import { getSession, signOut } from "next-auth/react"
import Image from "next/image"
import DirectThemeToggle from "./ThemeToggel"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const [session, setSession] = useState(null)
  const [profileImage, setProfileImage] = useState(null)

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession()
      setSession(sessionData)
    }
    fetchSession()
  }, [])

  // Load profile image from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("profileData")
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      if (parsedProfile.image) {
        setProfileImage(parsedProfile.image)
      }
    }
  }, [])

  return (
    <nav className="bg-gray-200 dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="#"
                className="text-2xl bg-gradient-to-r from-black via-mid to-light dark:from-white dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent font-bold transition-all duration-300"
              >
                Doculus
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/home"
                className="text-black dark:text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                href="/departments?type=uni"
                className="text-black dark:text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-300"
              >
                University
              </Link>
              <Link
                href="/departments?type=admin"
                className="text-black dark:text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-300"
              >
                Admin
              </Link>
              <Link
                href="/about"
                className="text-black dark:text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-300"
              >
                About
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Direct Theme Toggle */}
            <DirectThemeToggle />
            
            {/* Profile Dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-primary flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-300"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {profileImage ? (
                      <div className="relative h-10 w-10">
                        <Image
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                        />
                      </div>
                    ) : (
                      <svg className="h-full w-full text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </span>
                </button>
              </div>
              {showDropdown && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 focus:outline-none transition-colors duration-300"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/change-password"
                    className="block px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    role="menuitem"
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden space-x-2">
            {/* Mobile Direct Theme Toggle */}
            <DirectThemeToggle />
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-white dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-300"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-800 transition-colors duration-300" id="mobile-menu">          <div className="pt-3 pb-2 flex flex-col">
            <Link
              href="/home"
              className="px-4 py-2 rounded-md text-base font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/departments?type=uni"
              className="px-4 py-2 rounded-md text-base font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              University
            </Link>
            <Link
              href="/departments?type=admin"
              className="px-4 py-2 rounded-md text-base font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Admin
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 rounded-md text-base font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              About
            </Link>
          </div>
            {/* Mobile profile section */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {profileImage ? (
                    <div className="relative h-12 w-12">
                      <Image
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                  ) : (
                    <svg className="h-full w-full text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-black dark:text-white">{session?.user?.email}</div>
              </div>
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="ml-auto bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
              >
                <span className="sr-only">Open user menu</span>
                <svg
                  className={`h-6 w-6 transition-transform ${mobileDropdownOpen ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>            {mobileDropdownOpen && (
              <div className="mt-3 px-4 bg-gray-100 dark:bg-gray-800">
                <Link 
                  href="/profile" 
                  className="block w-full px-4 py-2 text-base font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-300"
                >
                  Profile
                </Link>
                <Link
                  href="/change-password"
                  className="block w-full px-4 py-2 text-base font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-300"
                >
                  Change Password
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-black dark:text-white hover:bg-red-100 dark:hover:bg-red-600 hover:text-red-600 dark:hover:text-white rounded-md transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}