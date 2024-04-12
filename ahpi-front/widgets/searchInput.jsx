import React from "react"

import SearchIcon from "../icons/searchIcon"

const SearchInput = ({ type = "text", placeholder, className, ...other }) => {
  return (
    <div className="w-full text-left">
      <div className="relative flex items-center">
        <div className="absolute right-5">
          <SearchIcon size="24" className="text-gray-300" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          {...other}
          className={`bg-white outline-none px-3 py-3 text-sm leading-none rounded-md placeholder:text-gray-400 placeholder:font-normal font-medium w-full focus:ring-primary focus:ring-1 transition border border-light-gray pr-10 ${className}`}
        />
      </div>
    </div>
  )
}

export default SearchInput
