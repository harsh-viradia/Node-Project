import React from "react"

// common  toggle button for active de-active
const ToggleInputButton = ({ name, rest, ...others }) => {
  return (
    <div>
      <label htmlFor={name} className="switch">
        <input id={name} className="toggle" type="checkbox" {...rest} {...others} />
        <span className="slider round" />
      </label>
    </div>
  )
}

export default ToggleInputButton
