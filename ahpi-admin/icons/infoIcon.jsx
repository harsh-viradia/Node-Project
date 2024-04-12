import React from "react"

const InfoIcon = ({ size = "24px", className }) => {
  return (
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   height={size}
    //   width={size}
    //   className={className}
    //   viewBox="0 0 20 20"
    //   fill="currentColor"
    // >
    //   <path
    //     fillRule="evenodd"
    //     d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
    //     clipRule="evenodd"
    //   />
    // </svg>
    <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} className={className} viewBox="0 0 12 12">
      <path
        id="info"
        d="M8,14a6,6,0,1,1,6-6A6,6,0,0,1,8,14Zm0-1.2A4.8,4.8,0,1,0,3.2,8,4.8,4.8,0,0,0,8,12.8ZM7.4,5H8.6V6.2H7.4Zm0,2.4H8.6V11H7.4Z"
        transform="translate(-2 -2)"
        fill="currentColor"
      />
    </svg>
  )
}

export default InfoIcon
