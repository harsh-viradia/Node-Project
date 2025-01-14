import React from "react"

const PayOutIcon = ({ size = "24px", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-12.95L16.95 12 12 16.95 7.05 12 12 7.05zm0 2.829L9.879 12 12 14.121 14.121 12 12 9.879z"
        fill="currentColor"
      />
    </svg>
  )
}

export default PayOutIcon
