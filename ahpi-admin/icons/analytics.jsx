import React from "react"

const AnalyticsIcon = ({ size = "16", ...other }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...other}>
      <path fill="none" d="M0 0H24V24H0z" />
      <path
        d="M5 3v16h16v2H3V3h2zm15.293 3.293l1.414 1.414L16 13.414l-3-2.999-4.293 4.292-1.414-1.414L13 7.586l3 2.999 4.293-4.292z"
        fill="currentColor"
      />
    </svg>
  )
}

export default AnalyticsIcon
