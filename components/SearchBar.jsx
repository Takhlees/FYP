import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { Calendar, X } from "lucide-react";

export default function SearchBar({ searchQuery, setSearchQuery, searchDate = "", setSearchDate = null }) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [localDate, setLocalDate] = useState(searchDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Debounce the search query update
  const debouncedSetSearchQuery = debounce(setSearchQuery, 300);

  useEffect(() => {
    debouncedSetSearchQuery(localQuery);
  }, [localQuery, debouncedSetSearchQuery]);

  useEffect(() => {
    if (setSearchDate) {
      setSearchDate(localDate);
    }
  }, [localDate, setSearchDate]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setLocalDate(newDate);
    setShowDatePicker(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div className="mb-6 flex justify-center">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search files by subject, diary no, or from..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="w-full px-4 py-3 pl-10 pr-16 text-sm text-gray-700 placeholder-gray-500 bg-white border-2 border-gray-200 rounded-full shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
        />
        {/* Search icon */}
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
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
        
        {/* Calendar icon and date picker */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Calendar icon button */}
          <button
            onClick={toggleDatePicker}
            className={`p-1.5 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 ${
              localDate ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
            }`}
            title="Select date"
          >
            <Calendar className="h-5 w-5" />
          </button>
          
          {/* Clear button for both text and date */}
          {(localQuery || localDate) && (
            <button
              onClick={() => {
                setLocalQuery("");
                setSearchQuery("");
                setLocalDate("");
                if (setSearchDate) {
                  setSearchDate("");
                }
              }}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-200 dark:text-gray-500 dark:hover:text-gray-400 p-1"
              title="Clear all filters"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* Date picker dropdown */}
        {showDatePicker && (
          <div className="absolute right-0 top-full mt-2 z-10">
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3">
              <input
                type="date"
                value={localDate}
                onChange={handleDateChange}
                className="px-3 py-2 text-sm text-gray-700 bg-white dark:bg-gray-600 dark:text-white border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 cursor-pointer"
                autoFocus
              />
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}