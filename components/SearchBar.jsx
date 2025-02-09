import { NextResponse } from "next/server";
import Loading from "@pages/loading";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState();
  const [loading, setLoading] = useState();

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/search-bar?query=${searchQuery}`);
      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      return NextResponse.json({ msg: "some error occurred" }, { status: 500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 mb-0 text-white">
      <form onSubmit={handlesubmit} className="sm:w-[550px] w-full mx-auto p-4 relative mb-1">
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type Here"
            className="w-full p-4 pl-6 rounded-full bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <AiOutlineSearch className="text-white text-3xl hover:text-blue-400 transition duration-200" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
