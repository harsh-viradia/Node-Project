/* eslint-disable no-unused-vars */
import DeleteIcon from "icons/deleteIcon"
import React from "react"
import ReactTooltip from "react-tooltip"

const WidgetCard = ({ item = {}, remove, position, ...other }) => {
  const { label, value } = item
  return (
    <div
      className="flex items-start justify-between p-3 overflow-hidden bg-white border rounded-md cursor-grab border-gray hover:shadow hover:border-primary tansition-all"
      {...other}
    >
      <h3 className="text-base font-medium leading-6 text-black truncate">{label}</h3>
      <button type="button" data-tip="Click To Remove" className="text-xs self-center">
        <DeleteIcon className="text-red" size="14" onClick={() => remove(position)} />
        <ReactTooltip effect="solid" />
      </button>
    </div>
  )
}

export default WidgetCard
