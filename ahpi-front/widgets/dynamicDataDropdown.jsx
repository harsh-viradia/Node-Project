/* eslint-disable react-hooks/exhaustive-deps */
import commonApi from "api/index"
import SearchIcon from "icons/searchIcon"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"
import AsyncSelect from "react-select/async"
import { DEFAULT_LIMIT } from "utils/constant"
import { debounce } from "utils/util"

const FilterSelectDropdown = ({
  name,
  mount,
  onChangeSelect,
  className,
  id,
  value,
  placeholder = "Select",
  defaultOptions,
  onChange = () => {},
  loadOptions,
  parameters,
  action = "",
  onInputChange = () => {},
  onKeyDown = () => false,
  error,
  isMulti,
  mandatory = false,
  label,
  isClearable = true,
  isSearch = true,
  searchColumns = ["name"],
  labelColumn = "name",
  isRegister = false,
  state,
  watch,
  ...other
}) => {
  const { t } = useTranslation("common")
  const [options, setOptions] = useState()
  const [selectValue, setSelectValue] = useState()

  const StylesConfig = {
    control: (provided, { isFocused }) => ({
      ...provided,
      padding: isSearch ? "0 0 0 30px" : "0",
      borderRadius: "6px",
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
    option: (provided, { isFocused }) => ({
      ...provided,
      backgroundColor: isFocused ? "#40B5E8" : "#fff",
      color: isFocused ? "#fff" : "#000",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 14,
      fontWeight: 500,
      color: "#000000",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: 14,
      fontWeight: 500,
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
    menu: (provided) => ({
      ...provided,
      zIndex: "9999",
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
        color: "#a0a7b1",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      }
    },
    indicatorsContainer: (provided) => ({
      ...provided,
      display: "flex",
    }),
  }

  const onSelectChange = (data) => {
    setSelectValue(data)
    onChange(data)
  }

  useEffect(() => {
    setSelectValue(value)
  }, [value, mount])
  const getData = async (inputValue, callback) => {
    const payload = isRegister
      ? {
          isActive: true,
          query: { parentCode: "DESIGNATION_TYPE" },
          options: { page: 1, offset: 0, limit: DEFAULT_LIMIT, sort: { seq: 1 } },
        }
      : {
          query: { searchColumns, search: inputValue || undefined },
          options: { page: 1, offset: 0, limit: DEFAULT_LIMIT, sort: { isDefault: -1, name: 1 } },
        }

    if (mount && state === "countryId") {
      payload.query.countryId = watch
    }
    if (mount && state === "stateId") {
      payload.query.stateId = watch
    }

    await commonApi({ action, parameters, data: payload }).then(([, { data = {} }]) => {
      // eslint-disable-next-line no-underscore-dangle
      let listData
      if (data?.data) {
        // eslint-disable-next-line no-underscore-dangle
        listData = data.data?.map((a) => ({ ...a, value: a._id, label: a?.[labelColumn] }))
        if (!value) {
          const setObj = listData.find((a) => a.isDefault)
          if (setObj) onSelectChange(setObj)
        }
      } else {
        // eslint-disable-next-line no-underscore-dangle
        listData = data.docs?.map((a) => ({ ...a, value: a._id, label: a.name }))
      }
      if (inputValue) {
        // eslint-disable-next-line promise/no-callback-in-promise
        callback?.(listData)
      } else {
        setOptions(listData)
      }
      return false
    })
  }

  const loadMasterOptions = debounce(async (inputValue, callback) => {
    if (mount) getData(inputValue, callback)
  })

  useEffect(() => {
    if (mount) {
      getData()
    }
  }, [mount, watch])

  return (
    <div>
      {label && (
        <label htmlFor={id} className="inline-block mb-2 text-sm font-semibold ">
          {label}
          {mandatory && <span className="text-red pl-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {isSearch && (
          <div className="absolute z-10 text-gray-300 top-2/4 -translate-y-2/4 left-3">
            <SearchIcon size="14.314" />
          </div>
        )}
        <AsyncSelect
          isSearchable
          noOptionsMessage={() => t("noOption")}
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
          defaultOptions={mount ? options : undefined}
          isMulti={isMulti}
          isClearable={isClearable}
          {...other}
        />
      </div>
      {error && <p className="mt-1 text-sm font-medium text-red">{error}</p>}
    </div>
  )
}

export default FilterSelectDropdown
