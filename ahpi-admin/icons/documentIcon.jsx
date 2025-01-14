import React from "react"

const DocumentIcon = ({ size = "24px", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      widths={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M21 4H7a2 2 0 1 0 0 4h14v13a1 1 0 0 1-1 1H7a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h13a1 1 0 0 1 1 1v1zM5 18a2 2 0 0 0 2 2h12V10H7a3.982 3.982 0 0 1-2-.535V18zM20 7H7a1 1 0 1 1 0-2h13v2z" />
    </svg>
  )
}

export default DocumentIcon
