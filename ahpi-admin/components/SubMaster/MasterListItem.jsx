import React from "react"

const MasterListItem = ({ row, onClick, masterCode }) => {
  return (
    <div
      role="button"
      tabIndex="0"
      onKeyDown={onClick}
      onClick={onClick}
      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-dark-gray transition-all ${
        row?.code === masterCode ? "bg-dark-gray" : "border"
      }`}
    >
      <div className="flex items-center justify-center w-10 h-10 uppercase bg-white rounded-lg shadow">
        {row?.name?.charAt(0)}
      </div>
      <div>
        <p className="text-sm text-gray-400">{row?.name}</p>
        <p className="text-xs text-gray-500">{row?.code}</p>
      </div>
    </div>
  )
}

export default MasterListItem
