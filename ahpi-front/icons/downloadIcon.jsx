import React from "react"

const DownloadIcon = ({ size = "18px", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 15"
      fill="none"
    >
      <path
        d="M0.25 13.25H13.75V14.75H0.25V13.25ZM7.75 8.879L12.3032 4.325L13.3638 5.3855L7 11.75L0.63625 5.38625L1.69675 4.325L6.25 8.8775V0.5H7.75V8.879Z"
        fill="#999999"
      />
    </svg>
  )
}

export default DownloadIcon
