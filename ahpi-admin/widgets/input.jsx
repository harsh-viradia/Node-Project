/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import InfoIcon from "icons/infoIcon"
import React from "react"
import ReactTooltip from "react-tooltip"

const Input = ({
  type = "text",
  placeholder = "",
  label,
  error,
  className,
  value,
  mandatory = false,
  // defaultValue = "",
  disabled = false,
  maxLength = "",
  minLength = "",
  min = "",
  max = "",
  onChange = () => false,
  onKeyDown = () => false,
  info,
  rest,
  lowerCasePlaceholder,
}) => (
  <div className="w-full text-left">
    {label && (
      <label className="relative block mb-2 text-sm font-medium text-black">
        {label}
        {mandatory && <span className="text-red pl-0.5">*</span>}
      </label>
    )}
    <div className="relative">
      {info && (
        <>
          <div data-tip={info} className="absolute top-2/4 -translate-y-2/4 z-10 text-gray-300 right-3">
            <InfoIcon size="14.314" />
          </div>
          <ReactTooltip effect="solid" className="w-64" />
        </>
      )}
      <input
        placeholder={placeholder}
        className={`bg-white focus:outline-none px-3 font-medium h-9 text-xs rounded-md ${
          !lowerCasePlaceholder === "placeholder:capitalize"
        } placeholder:text-gray-400 placeholder:font-normal w-full focus:border focus:border-primary text-black transition border border-light-gray ${className} ${
          disabled && "!bg-disabled-gray"
        } ${type === "email" && "lowercase"}
          ${error && "bg-red/10 !border-red"}
        `}
        maxLength={maxLength}
        minLength={minLength}
        min={min}
        max={max}
        disabled={disabled}
        type={type}
        value={value}
        // defaultValue={defaultValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onInput={(event) => {
          if (event.target.value.trim() === "") event.target.value = ""
        }}
        {...rest}
      />
    </div>
    {error && <p className="mt-1 text-xs font-medium text-red">{error}</p>}
  </div>
)

export default Input
