import React from "react"

const RadioButton = ({
  title,
  id,
  For,
  onChange,
  name,
  checked,
  defaultChecked = false,
  defaultValue,
  className,
  topClass,
}) => {
  return (
    <div className={`flex items-center gap-3 ${topClass}`}>
      <input
        defaultChecked={defaultChecked}
        defaultValue={defaultValue}
        type="radio"
        name={name}
        onChange={onChange}
        id={id}
        checked={checked}
        className={className}
      />
      <label className="font-semibold inline-block " htmlFor={For}>
        {title}
      </label>
    </div>
  )
}

export default RadioButton
