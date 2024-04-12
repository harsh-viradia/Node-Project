/* eslint-disable jsx-a11y/label-has-associated-control */
import cx from "classnames"
import React from "react"

const Input = ({
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
  authInput = false,
  isZipCode = false,
  rest,
}) => (
  <div className="w-full text-left">
    {/* <label className="inline-block mb-2 text-sm font-semibold "> */}
    <label
      className={`${
        authInput ? "relative block mb-2 text-sm font-medium text-black" : "inline-block mb-2 text-sm font-semibold"
      }`}
    >
      {label}
      {mandatory && <span className="text-red pl-0.5">*</span>}
    </label>
    <input
      placeholder={placeholder}
      // className={`bg-white focus:outline-none outline-none px-3 py-3 font-medium text-sm rounded-md placeholder:text-gray-400 placeholder:font-normal w-full focus:border focus:border-primary text-black transition border border-light-gray ${className} ${
      //   disabled && "bg-disabled-gray"
      // }`}
      className={cx(
        {
          // Conditionally apply classes based on authInput
          "bg-white focus:outline-none px-5 py-2.5 text-sm placeholder:text-mute w-full outline-none focus:border focus:border-primary transition border border-gray rounded-md":
            authInput,
          "bg-white focus:outline-none outline-none px-3 py-3 font-medium text-sm rounded-md placeholder:text-gray-400 placeholder-font-normal w-full focus:border focus:border-primary text-black transition border border-light-gray":
            !authInput,
        },
        className,
        {
          // Conditionally apply classes based on disabled
          "bg-disabled-gray": disabled,
        },
        {
          // Conditionally apply classes based on error
          "bg-red/10": error,
          "!border-red": error,
        }
      )}
      maxLength={maxLength}
      minLength={minLength}
      disabled={disabled}
      onInput={(event) => {
        if (isZipCode) {
          // eslint-disable-next-line no-param-reassign
          event.target.value = event.target.value.replaceAll(/\D/gi, "")
          if (event.target.value.length > 6) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = event.target.value.slice(0, 6)
          }
          return event.target.value
        }
        return false
      }}
      type={type}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      {...rest}
    />
    {error && <p className={`mt-1 text-sm text-red font-medium ${!authInput && "font-medium"}`}>{error}</p>}
  </div>
)

export default Input
