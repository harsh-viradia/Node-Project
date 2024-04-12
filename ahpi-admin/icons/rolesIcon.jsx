import React from "react"

const RolesIcon = ({ size = "20px", className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 20 18">
      <path
        id="rolesIcon"
        d="M12.414,5H21a1,1,0,0,1,1,1V20a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V4A1,1,0,0,1,3,3h7.414ZM4,5V19H20V7H11.586l-2-2Zm11,8h1v4H8V13H9V12a3,3,0,0,1,6,0Zm-2,0V12a1,1,0,0,0-2,0v1Z"
        transform="translate(-2 -3)"
        fill="#fff"
      />
    </svg>
  )
}

export default RolesIcon
