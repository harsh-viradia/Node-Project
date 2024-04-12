/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import CloseIcon from "icons/closeIcon"
import SearchIcon from "icons/searchIcon"
import React from "react"

const SearchInput = ({ type = "text", placeholder, className, ...other }) => {
  return (
    <div className="text-left">
      <div className="relative flex items-center">
        <div className="absolute left-3">
          <SearchIcon size="14.314" className="text-gray-300" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          {...other}
          className={`bg-white focus:outline-none px-3 h-9 text-xs leading-none rounded-md placeholder:text-gray-400 placeholder:font-normal font-medium w-full focus:ring-primary focus:ring-1 transition border border-light-gray pl-10 pr-10 ${className}`}
        />
        <div
          className="absolute right-3"
          onClick={(e) => {
            other.onChange(e)
          }}
        >
          {other.value ? <CloseIcon size="14.314" className="text-gray-400 cursor-pointer" /> : ""}
        </div>
      </div>
    </div>
  )
}

export default SearchInput
