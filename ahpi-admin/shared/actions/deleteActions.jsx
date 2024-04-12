/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
// Component for common delete actions

import commonApi from "api"
import DeleteModal from "components/DeleteModal"
import DeleteIcon from "icons/deleteIcon"
import React, { useState } from "react"
import ReactTooltip from "react-tooltip"
import { DEFAULT_LIMIT } from "utils/constant"
import Toast from "utils/toast"
import { debounce } from "utils/util"

/**
 *
 *
 * @param {*} { data = {}, module }
 * @return {*}
 */
const DeleteActions = ({
  data = {},
  module = "",
  getList,
  pagination = {},
  softDelete = false,
  fieldToDisplay = "name",
  itemName,
  config,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { offset = 0, itemCount = 0, perPage = DEFAULT_LIMIT } = pagination
  const handleConfirmation = debounce(async () => {
    const { _id } = data
    if (!softDelete) {
      await commonApi({
        action: "delete",
        parameters: [_id],
        module,
        common: true,
      }).then(async ([, { message = "" }]) => {
        Toast(message, "success")
        getList(offset > 0 ? (itemCount % offset === 1 ? offset - perPage : offset) : 0, perPage)
        setOpen(false)
        setLoading(false)
        return false
      })
    } else {
      const softData = {
        ids: [_id],
      }
      await commonApi({
        action: "softDelete",
        module,
        data: softData,
        common: true,
        config,
      }).then(async ([error, { message = "" }]) => {
        if (error) {
          setOpen(false)
          return false
        }
        Toast(message, "success")
        getList({
          options: {
            offset: offset > 0 ? (itemCount % offset === 1 ? offset - perPage : offset) : 0,
            limit: perPage,
          },
        })
        setOpen(false)
        setLoading(false)
        return false
      })
    }
  }, 1000)
  return (
    <>
      <span data-tip="Click To Delete" className="cursor-pointer text-red">
        <DeleteIcon size="14px" onClick={() => setOpen(true)} />
      </span>
      <ReactTooltip effect="solid" />
      <DeleteModal
        deleteModal={open}
        setDeleteModal={setOpen}
        handleConfirmation={handleConfirmation}
        itemName={itemName || data?.[fieldToDisplay]}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  )
}

export default DeleteActions
