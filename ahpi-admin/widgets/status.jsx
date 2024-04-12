import React from "react"

const Status = ({ statusName, color = "dark-gray" }) => {
  return (
    <span
      className={`text-[10px] font-semibold text-${color} bg-light-${color} bg-opacity-20 py-1 px-1.5 rounded-md border border-${color}`}
    >
      {statusName}
    </span>
  )
}

export default Status
