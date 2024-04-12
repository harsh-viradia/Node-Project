import React from "react"

const Checkbox = ({ title, id, checked, onChange, ...other }) => {
  return (
    <div className="flex items-center gap-3">
      <input type="checkbox" id={id} name={title} checked={checked} onChange={onChange} {...other} />
      {title && (
        <label className="text-sm inline-block normal-case text-left" htmlFor={id}>
          {title}
        </label>
      )}
    </div>
  )
}

export default Checkbox
