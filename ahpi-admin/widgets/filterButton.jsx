import CloseIcon from "icons/closeIcon"
import FilterIcon from "icons/filterIcon"
import React from "react"
import Button from "widgets/button"

const FilterButton = ({ onClick = () => {}, removeFilter = () => {}, filterCount = false }) => {
  return (
    <div className="relative">
      {filterCount ? (
        <div className="group">
          <button
            type="button"
            href="#"
            className="absolute flex items-center justify-center w-5 h-5 text-xs bg-white border rounded-full group-hover:bg-red border-light-gray -top-2 -right-2"
          >
            <button type="button" onClick={removeFilter} className="hidden text-white group-hover:block">
              <CloseIcon size="14px" className="p-0.5 text-white" />
            </button>
            <div className="block text-black group-hover:hidden">{filterCount}</div>
          </button>
        </div>
      ) : (
        ""
      )}
      <Button onClick={onClick} kind="dark-gray" hoverKind="white" className="h-9" icon={<FilterIcon />} />
    </div>
  )
}

export default FilterButton
