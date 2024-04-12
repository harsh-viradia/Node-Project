import React from "react"

const RightArrow = ({ size = "24px", className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path fill="#fff" d="M14 12l-4 4V8z" />
    </svg>
  )
}

export default RightArrow
