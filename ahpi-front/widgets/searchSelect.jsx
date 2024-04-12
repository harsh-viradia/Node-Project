/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/newline-after-import */
/* eslint-disable react/jsx-fragments */
import * as amplitude from "@amplitude/analytics-browser"
import { getCookie } from "cookies-next"
import React, { useContext, useEffect, useState } from "react"
import Select from "react-select"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT } from "utils/constant"

const SingleSelect = ({
  data,
  name,
  onChangeSelect = () => false,
  isSearchable = false,
  topClass = false,
  className = false,
  label,
  // defaultValue,
  disabled,
  mandatory,
  ...rest
}) => {
  const [value, setValue] = useState("")
  const { userData } = useContext(AppContext)

  useEffect(() => {
    setValue(rest.value || "")
  }, [rest.value])

  const handleChange = (changedValue) => {
    setValue(changedValue)
    onChangeSelect(changedValue)
    if (getCookie("token")) {
      amplitude.track(ANALYTICS_EVENT.SORT_BY_COURSE, {
        userEmail: userData?.email,
        userId: userData?.id,
        sortBy: changedValue?.name,
      })
    }
  }

  // TODO:styling of this component is remaining
  const StylesConfig = {
    option: (styles, { isFocused }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? "#40B5E8" : "#fff",
        color: isFocused ? "#fff" : "#000",
      }
    },
    control: (provided, { isFocused }) => ({
      ...provided,
      borderRadius: "6px",
      padding: "0",
      boxShadow: "none",
      fontSize: "14px",
      height: "46px",
      fontWeight: "400",
      borderColor: isFocused ? "#40B5E8" : "#ddd",
      "&:hover": {
        borderColor: "#40B5E8",
      },
      color: "#888",
    }),
    indicatorSeparator: (styles) => {
      return {
        ...styles,
        display: "none",
        color: "#888",
      }
    },
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#888",
      }
    },
    menu: (styles) => {
      return {
        ...styles,
        width: "100%",
        minWidth: "200px",
      }
    },
  }

  return (
    <div className={topClass}>
      {label && (
        <label className="inline-block mb-2 text-sm font-semibold ">
          {label}
          {mandatory && <span className="text-red pl-0.5">*</span>}
        </label>
      )}
      <Select
        className={`text-left basic-single ${className}`}
        classNamePrefix={name}
        defaultValue={value}
        isSearchable={isSearchable}
        name={name}
        options={data}
        placeholder={name}
        styles={StylesConfig}
        {...rest}
        onChange={handleChange}
        value={value}
        isDisabled={disabled}
      />
    </div>
  )
}

export default SingleSelect
