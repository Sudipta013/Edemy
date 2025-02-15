import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';


const SearchBar = ({data}) => {


  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : '');

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate(`/course-list/${input}`);
  };

  return (
    <form onSubmit={onSearchHandler} className="relative flex items-center max-w-xl w-full md:h-14 h-12 rounded-full border border-gray-300 shadow-sm focus-within:shadow-md transition-all duration-300 bg-white overflow-hidden">
      <img
        src={assets.search_icon}
        alt="search"
        className="w-5 h-5 absolute left-4 text-gray-400"
      />
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search for courses"
        className="w-full h-full pl-12 pr-4 text-gray-700 placeholder-gray-400 outline-none bg-transparent"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95 transition-all duration-300 text-white font-medium rounded-full px-6 py-2 mx-2 shadow-md hover:shadow-lg 
        cursor-pointer"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;

