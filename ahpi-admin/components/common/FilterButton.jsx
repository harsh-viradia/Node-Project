/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import CloseIcon from "icons/closeIcon"
import FilterIcon from "icons/filterIcon"
import React from "react"
import { removeNullAndUndefinedFromObj } from "utils/util"
import Button from "widgets/button"

const FilterButton = ({ onClick, removeFilter, filterCount = {} }) => {
  return (
    <div className="relative">
      <div className="group">
        {Object.keys(removeNullAndUndefinedFromObj(filterCount)).length > 0 && (
          <button
            type="button"
            href="#"
            className="h-5 w-5 rounded-full group-hover:bg-red bg-white border border-light-gray flex items-center justify-center text-xs absolute -top-2 -right-2"
          >
            <div className="group-hover:block hidden text-white" onClick={removeFilter}>
              <CloseIcon size="14px" />
            </div>
            <div className="group-hover:hidden block text-black">
              {Object.keys(removeNullAndUndefinedFromObj(filterCount)).length}
            </div>
          </button>
        )}
      </div>

      <Button onClick={onClick} kind="dark-gray" hoverKind="white" className="h-9" icon={<FilterIcon />} />
    </div>
  )
}

export default FilterButton
