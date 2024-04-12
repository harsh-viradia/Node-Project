import React from "react"

const DashboardIcon = ({ size = "20px", className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 20 20">
      <path
        id="Path_30"
        data-name="Path 30"
        d="M12,2A10,10,0,1,1,2,12,10,10,0,0,1,12,2Zm0,2a8,8,0,1,0,8,8A8,8,0,0,0,12,4Zm3.833,3.337a.593.593,0,0,1,.826.827q-3.27,4.569-3.6,4.9a1.5,1.5,0,0,1-2.122-2.122q.561-.56,4.894-3.6ZM17.5,11a1,1,0,1,1-1,1A1,1,0,0,1,17.5,11Zm-11,0a1,1,0,1,1-1,1A1,1,0,0,1,6.5,11ZM8.818,7.4A1,1,0,1,1,7.4,7.4,1,1,0,0,1,8.818,7.4ZM12,5.5a1,1,0,1,1-1,1A1,1,0,0,1,12,5.5Z"
        transform="translate(-2 -2)"
        fill="currentColor"
      />
    </svg>
  )
}

export default DashboardIcon
