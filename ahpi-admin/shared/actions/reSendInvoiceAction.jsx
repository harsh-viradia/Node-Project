/* eslint-disable react/destructuring-assignment */
// Component for common edit actions

import commonApi from "api"
import ResendIcon from "icons/resendIcon"
import React from "react"
import ReactTooltip from "react-tooltip"
import Toast from "utils/toast"
/**
 *
 *
 * @param {*} properties
 * @return {*}
 */
const ReSendInvoiceAction = (properties) => {
  const { original = {}, showDisabled } = properties
  const onView = async () => {
    if (showDisabled) return false
    const { _id } = original
    if (!_id) return false
    await commonApi({
      action: "resendInvoice",
      parameters: [_id],
    }).then(async ([error, { message = "" }]) => {
      if (error) return
      Toast(message, "success")
      // eslint-disable-next-line consistent-return
      return false
    })
    return false
  }
  return (
    <>
      <span
        data-tip={showDisabled ? "" : "Click to Resend Invoice"}
        className={showDisabled ? "cursor-not-allowed" : "cursor-pointer"}
      >
        <ResendIcon size="16px" className={showDisabled ? "text-gray" : "text-primary"} onClick={onView} />
      </span>
      <ReactTooltip effect="solid" />
    </>
  )
}

export default ReSendInvoiceAction
