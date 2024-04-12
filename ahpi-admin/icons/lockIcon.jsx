import React from "react"

const LockIcon = ({ ...other }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      {...other}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zm-2 0V9A5 5 0 0 0 7 9v1h10zm-6 4v4h2v-4h-2z" />
    </svg>
  )
}

export default LockIcon
