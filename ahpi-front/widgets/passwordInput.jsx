/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-associated-control */
import EyeCloseIcon from "icons/eyeCloseIcon"
import EyeIcon from "icons/eyeIcon"
import React, { useState } from "react"

const PasswordInput = ({
  placeholder,
  label,
  rest,
  error,
  className,
  onChange = () => false,
  onKeyDown = () => false,
  disabled = false,
  mandatory = false,
  onPaste = () => false,
  value,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="text-left">
      <label className="inline-block mb-2 text-sm font-semibold ">
        {label}
        {mandatory && <span className="text-red pl-0.5">*</span>}
      </label>
      <div className="relative flex items-center gap-3">
        <input
          value={value}
          className={`bg-white focus:outline-none outline-none px-3 py-3 font-medium text-sm rounded-md placeholder:text-gray-400 placeholder:font-normal w-full focus:border focus:border-primary text-black transition border border-light-gray ${className} 
          ${error && "bg-red/10 !border-red"}
          ${disabled && "bg-disabled-gray"}`}
          disabled={disabled}
          onPaste={onPaste}
          // value={value}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        />

        <a onClick={() => setShowPassword(!showPassword)} className="absolute right-4" href="#">
          {showPassword ? <EyeIcon fill="#888" /> : <EyeCloseIcon />}
        </a>
      </div>
      {error && <p className="mt-1 text-sm font-medium text-red">{error}</p>}
    </div>
  )
}

export default PasswordInput
