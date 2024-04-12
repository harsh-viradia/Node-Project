/* eslint-disable react/destructuring-assignment */
// Component for common edit actions

import ChooseWidgets from "components/PageBuilder/ChooseWidgetsFrom"
import GenerateInvoiceIcon from "icons/generateInvoiceIcon"
import React, { useState } from "react"
import ReactTooltip from "react-tooltip"
/**
 *
 *
 * @param {*} properties
 * @return {*}
 */
const GenerateInvoiceAction = (properties) => {
  const [open, setOpen] = useState(false)
  const { components = {}, title = "Update" } = properties
  const { SelectWidgets } = components

  const onView = () => {
    setOpen(true)
  }

  return (
    <>
      <span data-tip="Generate Invoice" className="cursor-pointer">
        <GenerateInvoiceIcon size="16px" onClick={onView} />
      </span>
      <ReactTooltip effect="solid" />
      {SelectWidgets && <ChooseWidgets open={open} setOpen={setOpen} title={title} />}
    </>
  )
}

export default GenerateInvoiceAction
