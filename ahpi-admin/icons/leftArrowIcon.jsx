import React from "react"

const LeftArrowIcon = ({ size = "24px", className }) => {
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

export default LeftArrowIcon
