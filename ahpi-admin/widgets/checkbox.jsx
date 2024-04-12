import React from "react"

const Checkbox = ({ title, For, id, className, rest, ...other }) => {
  return (
    <div className={`mainCheck flex items-center gap-2 ${className}`}>
      <input type="checkbox" id={id} name="mcq" {...rest} {...other} />
      {title && (
        <label className="self-center inline-block pt-1 text-xs capitalize text-foreground" htmlFor={id}>
          {title}
        </label>
      )}
    </div>
  )
}

export default Checkbox
