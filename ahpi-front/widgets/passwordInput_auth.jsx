/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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
  value,
  disabled = false,
  onChange = () => false,
  onKeyDown = () => false,
  mandatory = false,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="text-left">
      <label className="relative block mb-2 text-sm text-black font-medium ">
        {label} {mandatory ? <span className="text-red">*</span> : ""}
      </label>
      <div className="relative flex items-center gap-3">
        <input
          className={` bg-white focus:outline-none px-5 py-2.5 pr-14 text-sm placeholder:text-mute w-full outline-none focus:border focus:border-primary transition border border-gray rounded-md ${
            (disabled && "bg-disabled-gray", error && "bg-red/10 !border-red")
          }`}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          // autoFocus
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        />

        <div onClick={() => setShowPassword(!showPassword)} className="absolute cursor-pointer right-4">
          {showPassword ? <EyeIcon fill="#888" /> : <EyeCloseIcon />}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red">{error}</p>}
    </div>
  )
}

export default PasswordInput
