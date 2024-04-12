import React from "react"

const HomeIcon = ({ size = "20px", className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 18 18">
      <path
        id="Path_2"
        data-name="Path 2"
        d="M19,19V9.8L12,4.277,5,9.8V19Zm2,1a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V9.314a1,1,0,0,1,.38-.785l8-6.311a1,1,0,0,1,1.24,0l8,6.31a1,1,0,0,1,.38.786V20ZM7,12H9a3,3,0,0,0,6,0h2A5,5,0,0,1,7,12Z"
        transform="translate(-3 -2.003)"
        fill="#fff"
      />
    </svg>
  )
}

export default HomeIcon
