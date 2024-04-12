import React from "react"

const SearchIcon = ({ size = "16.314", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      viewBox="0 0 16.314 16.314"
    >
      <path
        id="searchIcon"
        d="M14.874,13.739l3.44,3.439-1.136,1.136-3.439-3.44a7.229,7.229,0,1,1,1.136-1.136Zm-1.611-.6a5.619,5.619,0,1,0-.12.12l.12-.12Z"
        transform="translate(-2 -2)"
        fill="currentColor"
      />
    </svg>
  )
}

export default SearchIcon