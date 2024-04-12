/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react"

const Select = ({ label, className, option = "ABC" }) => {
  return (
    <div className={className}>
      <label className="inline-block mb-2 text-xs font-medium text-foreground">{label}</label>
      <select
        className="bg-white focus:outline-none px-3 py-2 h-9 text-xs rounded-md placeholder:text-gray-400 w-full focus:border focus:border-primary transition border border-light-gray focus:shadow-none select select-bordered min-h-auto  font-normal text-black"
        name=""
        id=""
      >
        <option value="">{option}</option>
      </select>
    </div>
  )
}

export default Select
