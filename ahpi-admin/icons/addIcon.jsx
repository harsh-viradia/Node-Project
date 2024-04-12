import React from "react"

const AddIcon = ({ size = "16", ...other }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 10 10" {...other}>
      <path
        id="AddIcon"
        d="M9.286,9.286V5h1.429V9.286H15v1.429H10.714V15H9.286V10.714H5V9.286Z"
        transform="translate(-5 -5)"
        fill="currentColor"
      />
    </svg>
  )
}

export default AddIcon
