import React, { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  
  return (
    <div className="lg:col-span-1">
      <div className="mx-2 my-2">
        <div className="relative text-white">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <ion-icon name="search-outline"></ion-icon>
          </span>
          <input
            type="search"
            className="block w-full py-2 pl-10 pr-4 bg-gray-700 rounded-full placeholder-gray-400 focus:outline-none border-gray-700"
            name="search"
            placeholder="Search chat"
            value={searchTerm}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
