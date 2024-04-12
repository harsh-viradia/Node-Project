/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/newline-after-import */
/* eslint-disable react/jsx-fragments */
import commonApi from "api"
import SearchIcon from "icons/searchIcon"
import React, { useEffect, useState } from "react"
import AsyncSelect from "react-select/async"
import { DEFAULT_LIMIT } from "utils/constant"
import { debounce } from "utils/util"

const MasterSelect = ({
  name,
  onChangeSelect,
  className,
  id,
  value,
  placeholder = "Select",
  defaultOptions,
  onChange = () => {},
  loadOptions,
  code,
  onInputChange = () => {},
  onKeyDown = () => false,
  error,
  isMulti,
  isDisabled = false,
  mandatory = false,
  label,
  isClearable = true,
  showCode = false,
  isSearch = true,
  extraParam: extraParameter = {},
  extraQuery = {},
  filterCode = {},
  showFilteredList = false,
  ...other
}) => {
  const [options, setOptions] = useState()
  const [selectValue, setSelectValue] = useState()

  const StylesConfig = {
    control: (provided, { isFocused }) => ({
      ...provided,
      minHeight: 36,
      padding: isSearch ? "0 0 0 30px" : "0",
      borderRadius: "6px",
      border: isFocused ? "1px solid #40B5E8 !important" : "1px solid #dfdfdf !important",
      boxShadow: "none",
    }),
    option: (provided, { isFocused }) => ({
      ...provided,
      fontSize: 12,
      fontWeight: 500,
      background: isFocused ? "rgba(64, 181, 232, 0.15)" : "#ffffff",
      color: isFocused ? "rgba(64, 181, 232, 1)" : "rgba(0, 0, 0, 1)",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 12,
      fontWeight: 500,
      color: "#000000",
    }),
    valueContainer: (provided, { isFocused }) => ({
      ...provided,
      fontSize: 12,
      fontWeight: isFocused ? 500 : 400,
      color: "#000000",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "250px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: "9999",
    }),
    indicatorSeparator: (styles) => {
      return {
        ...styles,
        display: "none",
      }
    },
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "5px 8px",
      display: isSearch ? "none" : "block",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: "5px",
    }),
  }

  const getMasters = async (inputValue, callback) => {
    const payload = {
      isActive: true,
      ...extraParameter,
      search: inputValue || undefined,
      query: {
        parentCode: code,
        ...extraQuery,
      },
      options: {
        page: 1,
        limit: DEFAULT_LIMIT,
        offset: 0,
        sort: { seq: 1 },
      },
    }

    await commonApi({ action: "list", common: "true", module: "masters", data: payload }).then(([, { data = {} }]) => {
      let optionList = data?.docs?.map((list = {}) => {
        return showCode
          ? {
              // eslint-disable-next-line no-underscore-dangle
              value: list._id,
              label: list.name,
              code: list.code,
            }
          : {
              value: list.id,
              label: list.name,
            }
      })
      if (showFilteredList && optionList?.length)
        optionList = optionList.filter((listFiltered) => {
          return filterCode?.(listFiltered)
        })
      if (inputValue) {
        callback?.(optionList)
      } else {
        setOptions(optionList)
      }
      return false
    })
  }

  const loadMasterOptions = debounce(async (inputValue, callback) => {
    getMasters(inputValue, callback)
  })

  const onSelectChange = (data) => {
    setSelectValue(data)
    onChange(data)
  }

  useEffect(() => {
    setSelectValue(value)
  }, [value])

  useEffect(() => {
    getMasters()
  }, [])

  return (
    <div>
      {label && (
        <label className="inline-block mb-2 text-xs font-medium text-foreground">
          {label}
          {mandatory && <span className="text-red pl-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {isSearch && (
          <div className="absolute top-2/4 -translate-y-2/4 left-3 z-10 text-gray-300">
            <SearchIcon size="14.314" />
          </div>
        )}
        <AsyncSelect
          isSearchable={isSearch}
          isDisabled={isDisabled}
          className={`basic-single text-left ${className}`}
          placeholder={placeholder}
          classNamePrefix={name}
          name={name}
          styles={StylesConfig}
          id={id}
          value={selectValue}
          onInputChange={onInputChange}
          onChange={onSelectChange}
          onKeyDown={onKeyDown}
          loadOptions={loadMasterOptions}
          defaultOptions={options}
          isMulti={isMulti}
          isClearable={isClearable}
          {...other}
        />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red">{error}</p>}
    </div>
  )
}

export default MasterSelect
