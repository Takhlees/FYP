import { useState, useEffect } from "react";
import { debounce } from "lodash";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce the search query update
  const debouncedSetSearchQuery = debounce(setSearchQuery, 300);

  useEffect(() => {
    debouncedSetSearchQuery(localQuery);
  }, [localQuery, debouncedSetSearchQuery]);

  return (
    <div className="mb-6 flex justify-center">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search files by subject, diary no, or from..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="w-full px-4 py-3 pl-10 text-sm text-gray-700 placeholder-gray-500 bg-white border-2 border-gray-200 rounded-full shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {/* Clear button */}
        {localQuery && (
          <button
            onClick={() => {
              setLocalQuery("");
              setSearchQuery("");
            }}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-200"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}