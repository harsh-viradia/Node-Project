/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react"

const ToggleButton = ({ onChange, checked, disabled = false }) => {
  return (
    <div>
      <label className="switch">
        <input className="toggle" type="checkbox" onChange={onChange} checked={checked} disabled={disabled} />
        <span className={`slider round ${disabled ? "!cursor-not-allowed" : ""}`} />
      </label>
    </div>
  )
}

export default ToggleButton
