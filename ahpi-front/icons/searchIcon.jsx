import React from "react"

const SearchIcon = ({ size = "24", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <g id="Iconly/Light/Search">
        <g id="Search">
          <circle
            id="Ellipse_739"
            cx="11.7666"
            cy="11.7666"
            r="8.98856"
            stroke="#130F26"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Line_181"
            d="M18.0183 18.4851L21.5423 22"
            stroke="#130F26"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  )
}

export default SearchIcon
