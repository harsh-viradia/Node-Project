/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
// Component for common edit actions

import ChooseWidgets from "components/PageBuilder/ChooseWidgetsFrom"
import BuilderIcon from "icons/builderIcon"
import React, { useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"
/**
 *
 *
 * @param {*} properties
 * @return {*}
 */
const PageBuilderActions = (properties) => {
  const [open, setOpen] = useState(false)
  const { components = {}, original = {}, title = "Update", getList } = properties
  const { SelectWidgets } = components

  const onView = () => {
    setOpen(true)
  }

  return (
    <>
      <span data-tip="Click To Add Widgets" className="cursor-pointer">
        <BuilderIcon size="16px" onClick={onView} />
      </span>
      <ReactTooltip effect="solid" />
      {SelectWidgets && <ChooseWidgets data={original} open={open} setOpen={setOpen} title={title} getList={getList} />}
    </>
  )
}

export default PageBuilderActions
