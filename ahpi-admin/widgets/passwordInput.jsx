/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-associated-control */
import EyeIcon from "icons/eye"
import EyeCloseIcon from "icons/eyeClose"
import React, { useState } from "react"

const PasswordInput = ({
  placeholder,
  label,
  rest,
  error,
  onChange = () => false,
  onKeyDown = () => false,
  disabled = false,
  mandatory = true,
  value,
  onPaste = () => false,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="text-left">
      <label className="inline-block mb-2 text-sm font-semibold ">
        {" "}
        {label} {mandatory ? <span className="text-red">*</span> : ""}
      </label>
      <div className="flex items-center gap-3 relative">
        <input
          className={`focus:outline-none px-3 py-2.5 text-xs font-medium rounded-md placeholder:text-gray-400 placeholder:font-normal text-black w-full focus:border focus:border-primary transition border border-light-gray pr-12 
          ${disabled && "!bg-disabled-gray"}
          ${error && "bg-red/10 !border-red"}
          `}
          disabled={disabled}
          value={value}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        />

        <a onClick={() => setShowPassword(!showPassword)} className="absolute right-4" href="#">
          {showPassword ? <EyeIcon fill="#888" /> : <EyeCloseIcon />}
        </a>
      </div>
      {error && <p className="text-xs font-medium mt-1 text-red">{error}</p>}
    </div>
  )
}

export default PasswordInput
