import React from "react"

const StatusPrice = ({ statusName, priceLabel = false, price, color = "dark-gray" }) => {
  return (
    <div
      className={`flex items-center justify-between bg-light-${color} bg-opacity-20 py-1 px-1.5 rounded-md border border-${color} w-full`}
    >
      <span className={`text-sm font-semibold text-${color} w-[80%] truncate word-break`}>{statusName}</span>
      {priceLabel && <div className="ml-2 font-bold text-black">{price}</div>}
    </div>
  )
}

export default StatusPrice
