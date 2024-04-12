/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import commonApi from "api"
import React, { useState } from "react"
import Toast from "utils/toast"
import isEmpty from "utils/util"

// common  toggle button for active de-active column in table
const ToggleButton = ({ original = {}, actionProps: actionProperties = {}, setList = () => {}, list = [] }) => {
  const { module = "", action = "partialUpdate", common = true, disabled = false, config } = actionProperties

  // State for displaying toggle value
  const [isActive, setIsActive] = useState(original.isActive)

  const handleToggle = async () => {
    const payload = {
      isActive: !isActive,
    }
    const id = original?.id || original?._id
    await commonApi({
      action,
      module,
      common,
      data: payload,
      parameters: [id],
      config,
    }).then(([error, { message = "" }]) => {
      if (error) return false
      setIsActive(!isActive)
      !isEmpty(message) && Toast(message, "success")
      setList(
        list?.map((a) => {
          // eslint-disable-next-line no-param-reassign
          if (a._id === id || a.id === id) return { ...a, isActive: !a.isActive }
          return a
        })
      )
      return false
    })
  }
  return (
    <div>
      <label className="switch">
        <input disabled={disabled} className="toggle" type="checkbox" checked={isActive} onChange={handleToggle} />
        <span className={`slider round ${disabled ? "!cursor-not-allowed" : ""}`} />
      </label>
    </div>
  )
}

export default ToggleButton
