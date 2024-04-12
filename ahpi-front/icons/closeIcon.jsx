import React from "react"

const CloseIcon = ({ size = "12", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M7 5.44469L12.4447 0L14 1.55531L8.55531 7L14 12.4447L12.4447 14L7 8.55531L1.55531 14L0 12.4447L5.44469 7L0 1.55531L1.55531 0L7 5.44469Z"
        fill="#333333"
      />
    </svg>
  )
}

export default CloseIcon
