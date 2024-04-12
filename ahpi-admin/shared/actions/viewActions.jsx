/* eslint-disable react/destructuring-assignment */
// Component for common edit actions

import EyeIcon from "icons/eye"
import React, { useState } from "react"
import ReactTooltip from "react-tooltip"
/**
 *
 *
 * @param {*} properties
 * @return {*}
 */
const ViewActions = (properties) => {
  const [open, setOpen] = useState(false)
  const { components = {}, original = {}, title = "Update" } = properties
  const { ViewFrom } = components
  const [editData, setEditData] = useState()

  const onView = () => {
    setOpen(true)
    setEditData(original)
  }

  return (
    <>
      <span data-tip="Click To View" className="cursor-pointer">
        <EyeIcon size="16px" onClick={onView} />
      </span>
      <ReactTooltip effect="solid" />
      {ViewFrom && (
        <ViewFrom open={open} setOpen={setOpen} title={title} data={editData} userDetails={properties?.original} />
      )}
    </>
  )
}

export default ViewActions
