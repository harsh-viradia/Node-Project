// Component for common edit actions

import EditIcon from "icons/editIcon"
import React, { useState } from "react"
import ReactTooltip from "react-tooltip"
/**
 *
 *
 * @param {*} properties
 * @return {*}
 */
const EditActions = (properties) => {
  const [open, setOpen] = useState(false)
  const { components = {}, original = {}, title = "Update" } = properties
  const SyncForm = components.SyncFrom
  const [editData, setEditData] = useState()

  const onEdit = () => {
    setOpen(true)
    setEditData(original)
  }

  return (
    <>
      <span data-tip="Click To Edit" className="cursor-pointer">
        <EditIcon size="13px" fill="#fff" onClick={onEdit} />
      </span>
      <ReactTooltip effect="solid" />
      {SyncForm && <SyncForm open={open} setOpen={setOpen} title={title} data={editData} />}
    </>
  )
}

export default EditActions
