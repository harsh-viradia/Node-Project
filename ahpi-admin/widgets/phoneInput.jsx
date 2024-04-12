/* eslint-disable jsx-a11y/label-has-associated-control */
import commonApi from "api"
import React, { useEffect, useState } from "react"

import Dropdown from "./dropdown"

const PhoneInput = ({
  type = "text",
  placeholder = "Enter Phone Number",
  label = "Phone Number",
  error,
  className,
  value,
  defaultValue = "",
  maxLength = "",
  minLength = "",
  mandatory = true,
  disabled = false,
  capitalise = false,
  onChange = () => false,
  onKeyDown = () => false,
  countryCode,
  setValue = () => {},
  rest,
}) => {
  const [phoneCodes, setPhoneCodes] = useState()
  useEffect(() => {
    commonApi({ module: "country", action: "all", common: true, data: { options: { pagination: false } } })
      .then(([, response]) => {
        const data = response?.data?.data?.map((a) => {
          if (!countryCode && a.isDefault) setValue("countryCode", a.ISDCode)
          return { value: a.ISDCode, label: a.ISDCode }
        })
        setPhoneCodes(data)
        return false
      })
      .catch(() => {})
  }, [])
  return (
    <div className="text-left w-full">
      {label && (
        <label className="text-xs font-medium mb-2 inline-block text-foreground">
          {label} {mandatory ? <span className="text-red">*</span> : ""}
        </label>
      )}
      <div className="relative flex items-center">
        <Dropdown
          isDisabled={disabled}
          isSearch={false}
          shouldSearch
          className="absolute inset-y-0 left-0 z-[11] flex items-center countryCode"
          isCountryCode
          value={countryCode ? { value: countryCode, label: countryCode } : ""}
          defaultOptions={phoneCodes}
          loadOptions={(input, callback) => callback(phoneCodes.filter((a) => a.value.includes(input)))}
          onChange={(opt) => {
            setValue("countryCode", opt?.value)
          }}
          placeholder=""
        />
        <input
          placeholder={placeholder}
          className={`bg-white focus:outline-none pl-28 px-3 font-medium h-9 text-xs rounded-md placeholder:text-gray-400 placeholder:font-normal w-full focus:border focus:border-primary text-black transition border border-light-gray ${className} ${
            disabled && "!bg-disabled-gray"
          } ${capitalise && "capitalize"}`}
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
      </div>
      {error && <p className="text-xs font-medium mt-1 text-red">{error}</p>}
    </div>
  )
}

export default PhoneInput
