/* eslint-disable react/destructuring-assignment */
// Component for common edit actions

import DownloadIcon from "icons/downloadIcon"
import React from "react"
import ReactTooltip from "react-tooltip"
/**
 *
 *
 * @param {*} properties
 * @return {*}
 */
const DownloadAction = ({ original, showDisabled }) => {
  const downloadUrl = () => {
    if (!showDisabled && original?.receiptId?.uri) window.open(original.receiptId.uri)
  }
  const showDis = !original?.receiptId?.uri || showDisabled
  return (
    <>
      <span
        data-tip={!showDis ? "Click To Download" : ""}
        className={!showDis ? "cursor-pointer" : "cursor-not-allowed"}
      >
        <DownloadIcon size="16px" fill={showDis ? "currentColor" : "#31af4a"} onClick={downloadUrl} />
      </span>
      <ReactTooltip effect="solid" />
    </>
  )
}

export default DownloadAction
