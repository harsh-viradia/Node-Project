/* eslint-disable jsx-a11y/label-has-associated-control */
import commonApi from "api"
import React, { useState } from "react"
import { DEFAULT_LIMIT } from "utils/constant"
import Toast from "utils/toast"

const AffiliatedButton = ({ original = {}, disabled = false, getList, pagination = {} }) => {
  // State for displaying toggle value
  const [isAffiliated, setIsAffiliated] = useState(original.isAffiliated)

  const handleToggle = async () => {
    const payload = {
      isAffiliated: !isAffiliated,
    }
    await commonApi({
      action: "affiliateUniversity",
      data: payload,
      parameters: [original.id],
    }).then(([, { message = "" }]) => {
      Toast(message, "success")
      getList({
        options: {
          offset: pagination?.offset || 0,
          limit: pagination?.perPage || DEFAULT_LIMIT,
        },
      })
      return false
    })
    setIsAffiliated(!isAffiliated)
  }

  return (
    <div>
      <label className="switch">
        <input className="toggle" type="checkbox" checked={isAffiliated} onClick={handleToggle} disabled={disabled} />
        <span className="slider round" />
      </label>
    </div>
  )
}

export default AffiliatedButton
