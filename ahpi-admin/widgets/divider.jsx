import React from "react"

const Divider = ({ title, className }) => {
  return (
    <div className={`relative py-1 ${className}`}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-2 text-sm font-medium text-black bg-white">{title}</span>
      </div>
    </div>
  )
}

export default Divider
