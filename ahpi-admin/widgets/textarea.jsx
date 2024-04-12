/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react"

const Textarea = ({
  type = "text",
  placeholder,
  label,
  id,
  rest,
  error,
  onChange = () => false,
  disabled = false,
  value,
  mandatory,
}) => {
  return (
    <div className="flex flex-col text-left">
      <label className="inline-block mb-2 text-xs font-medium text-foreground">
        {label} {mandatory ? <span className="text-red">*</span> : ""}
      </label>
      <textarea
        type={type}
        rows="4"
        placeholder={placeholder}
        id={id}
        onChange={onChange}
        value={value}
        {...rest}
        disabled={disabled}
        className={`bg-white focus:outline-none px-3 py-2.5 text-xs font-medium placeholder:font-normal rounded-md placeholder:text-gray-400 w-full focus:border focus:border-primary transition border border-light-gray 
        ${disabled && "!bg-disabled-gray"}`}
      />
      {error && <p className="mt-1 text-xs font-medium text-red">{error}</p>}
    </div>
  )
}

export default Textarea
