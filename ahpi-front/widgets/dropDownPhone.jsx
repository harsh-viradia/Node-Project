/* eslint-disable prettier/prettier */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react"
import AsyncSelect from "react-select/async"

const DropdownPhone = ({
  label = "",
  className,
  id,
  value,
  placeholder,
  defaultOptions,
  onChange,
  loadOptions,
  onInputChange = () => {},
  error,
  isPhoneCode = false,
  isPhoneError,
  ...other
}) => {
  const customStyles = {
    control: (provided, { isFocused }) => ({
      ...provided,
      minHeight: 42,
      borderRadius: "6px 0 6px 0",
      border: isFocused ? "1px solid #40B5E8 !important" : "1px solid #dfdfdf !important",
      boxShadow: "none",
    }),
    option: (provided, { isFocused }) => ({
      ...provided,
      fontSize: 14,
      fontWeight: 500,
      background: isFocused ? "rgba(64, 181, 232, 0.15)" : "#ffffff",
      color: isFocused ? "rgba(64, 181, 232, 1)" : "rgba(0, 0, 0, 1)",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 14,
      fontWeight: 500,
      color: "#000000",
    }),
    valueContainer: (provided, { isFocused }) => ({
      ...provided,
      fontSize: 14,
      fontWeight: isFocused ? 500 : 400,
      color: "#000000",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "250px",
    }),
    indicatorSeparator: (styles) => {
      return {
        ...styles,
        display: "none",
      }
    },
  }

  const phoneStyles = {
    control: (provided, { isFocused }) => ({
      ...provided,
      minHeight: 42,
      width: "100px",
      borderRadius: "6px 0 0 6px",
      border: isFocused
        ? "1px solid #40B5E8 !important"
        : isPhoneError
        ? "1px solid rgb(250, 80, 80)"
        : "1px solid #dfdfdf !important",
      boxShadow: "none",
      backgroundColor: isPhoneError ? "rgba(250, 80, 80, 0.10)" : "#ffffff",
    }),
    option: (provided, { isFocused }) => ({
      ...provided,
      fontSize: 14,
      fontWeight: 500,
      background: isFocused ? "rgba(64, 181, 232, 0.15)" : "#ffffff",
      color: isFocused ? "rgba(64, 181, 232, 1)" : "rgba(0, 0, 0, 1)",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 14,
      fontWeight: 500,
      color: "#000000",
    }),
    valueContainer: (provided, { isFocused }) => ({
      ...provided,
      fontSize: 14,
      fontWeight: isFocused ? 500 : 400,
      color: "#000000",
    }),
    menu: (base) => ({
      ...base,
      width: "250px",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "250px",
    }),
    indicatorSeparator: (styles) => {
      return {
        ...styles,
        display: "none",
      }
    },
  }
  return (
    <>
      <div className={className}>
        {label?.length ? <label className="relative block mb-2 text-sm font-medium text-black">{label}</label> : ""}
        <AsyncSelect
          styles={isPhoneCode ? phoneStyles : customStyles}
          isSearchable
          id={id}
          placeholder={placeholder}
          value={value}
          onInputChange={onInputChange}
          onChange={onChange}
          loadOptions={loadOptions}
          defaultOptions={defaultOptions}
          {...other}
        />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red">{error}</p>}
    </>
  )
}

export default DropdownPhone
