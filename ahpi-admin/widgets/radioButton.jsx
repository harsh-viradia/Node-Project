import React from "react"

const RadioButton = ({ title, onChange, name, defaultChecked = false, defaultValue }) => {
  return (
    <div className="flex items-center gap-1">
      <input defaultChecked={defaultChecked} defaultValue={defaultValue} type="radio" name={name} onChange={onChange} />
      <label className="text-xs inline-block text-foreground">{title}</label>
    </div>
  )
}

export default RadioButton
