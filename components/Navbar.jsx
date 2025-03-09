

 "use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import "@styles/globals.css"
import { getSession, signOut } from "next-auth/react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)

  const [session, setSession] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession()
      console.log("Session Data:", sessionData) // Check the session data in the console
      setSession(sessionData)
    }

    fetchSession()
  }, [])

  return (
    <div>
    <nav className="bg-[#003559] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side: Logo & Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="#" className="text-xl font-bold text-white">
                Doculus
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/home"
                className="text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#061A40]"
              >
                Home
              </Link>
              <Link
                href="/departments?type=uni"
                className="text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#006DAA]"
              >
                Department
              </Link>
              <Link
                href="/departments?type=admin"
                className="text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#006DAA]"
              >
                Admin
              </Link>
              <Link
                href="/tutorial"
                className="text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#006DAA]"
              >
                Tutorial
              </Link>
              <Link
                href="/about"
                className="text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#006DAA]"
              >
                About
              </Link>
            </div>
          </div>

          {/* Right Side: Toggle Button, Profile */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 mr-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? (
                <Moon className="w-6 h-6 text-gray-800 dark:text-white" />
              ) : (
                <Sun className="w-6 h-6 text-gray-800 dark:text-white" />
              )}
            </button>

            {/* Profile Dropdown (Desktop) */}
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-white dark:bg-gray-700 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </button>
              </div>
              {showDropdown && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[#061A40] ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#006DAA]"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/change-password"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#006DAA]"
                    role="menuitem"
                  >
                    Change Password
                  </Link>
                  {/* <Link
                    href="/forgot-password"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Forgot Password
                  </Link> */}
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#006DAA]"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Dark Mode Toggle Button (Mobile) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full mr-2 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? (
                <Moon className="w-6 h-6 text-gray-800 dark:text-white" />
              ) : (
                <Sun className="w-6 h-6 text-gray-800 dark:text-white" />
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-white dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
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
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-[#0353A4]" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/home"
              className="text-white hover:bg-[#006DAA] block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/departments?type=uni"
              className="text-white hover:bg-[#006DAA] block px-3 py-2 rounded-md text-base font-medium"
            >
              Department
            </Link>
            <Link
              href="/departments?type=admin"
              className="text-white hover:bg-[#006DAA] block px-3 py-2 rounded-md text-base font-medium"
            >
              Admin
            </Link>
            <Link
              href="/about"
              className="text-white hover:bg-[#006DAA] block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              href="/tutorial"
              className="text-white hover:bg-[#006DAA] block px-3 py-2 rounded-md text-base font-medium"
            >
              Tutorial
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{session?.user?.email}</div>
              </div>
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            </div>
            {mobileDropdownOpen && (
              <div className="mt-3 space-y-1">
                <Link href="/profile" className="block px-4 py-2 text-base font-medium text-white hover:bg-[#006DAA]">
                  Profile
                </Link>
                <Link
                  href="/change-password"
                  className="block px-4 py-2 text-base font-medium text-white hover:bg-[#006DAA]"
                >
                  Change Password
                </Link>
                {/* <Link
                  href="/forgot-password"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Forgot Password
                </Link> */}
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-white hover:bg-[#006DAA]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  </div>
  );
}



