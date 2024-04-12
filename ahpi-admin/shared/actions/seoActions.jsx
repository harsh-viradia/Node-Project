/* eslint-disable react/destructuring-assignment */
// Component for common edit actions

import GlobalIcon from "icons/globalIcon"
import React from "react"
import ReactTooltip from "react-tooltip"
/**
 *
 *
 * @param {*} properties
 * @return {*}
 */
const SeoActions = () => {
  return (
    <>
      <span data-tip="SEO Management" className="cursor-pointer">
        <GlobalIcon size="16px" className="text-purple-600" />
      </span>
      <ReactTooltip effect="solid" />
    </>
  )
}

export default SeoActions
