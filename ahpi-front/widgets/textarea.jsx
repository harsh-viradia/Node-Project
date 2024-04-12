/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react"

const Textarea = ({
  type = "text",
  placeholder,
  label,
  error,
  className,
  value,
  mandatory = false,
  defaultValue = "",
  disabled = false,
  maxLength = "",
  minLength = "",
  onChange = () => false,
  onKeyDown = () => false,
  rest,
}) => (
  <div className="w-full text-left">
    <label className="inline-block mb-2 text-sm font-semibold ">
      {label}
      {mandatory && <span className="text-red pl-0.5">*</span>}
    </label>
    <textarea
      placeholder={placeholder}
      className={`h-28 bg-white focus:outline-none outline-none px-3 py-3 font-medium text-sm rounded-md placeholder:text-gray-400 placeholder:font-normal w-full focus:border focus:border-primary text-black transition border border-light-gray ${className} ${
        disabled && "bg-disabled-gray"
      }`}
      maxLength={maxLength}
      minLength={minLength}
      disabled={disabled}
      type={type}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      {...rest}
    />
    {error && <p className="mt-1 text-xs font-medium text-red">{error}</p>}
  </div>
)

export default Textarea
