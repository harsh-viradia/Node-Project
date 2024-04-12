/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/no-null */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/newline-after-import */
/* eslint-disable react/jsx-fragments */
import commonApi from "api"
import { getCookie } from "cookies-next"
import SearchIcon from "icons/searchIcon"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import AsyncSelect from "react-select/async"
import usePaginate from "shared/hook/usePaginate"
import routes from "utils/routes"
import { debounce } from "utils/util"

const SearchSelectDropdown = ({
  name,
  onChangeSelect,
  className,
  id,
  value,
  placeholder = "Select",
  defaultOptions,
  loadOptions,
  error,
  isMulti,
  label,
  isSearch = true,
  ...other
}) => {
  const [options, setOptions] = useState()
  const [selectValue, setSelectValue] = useState()
  const [searchValue, setSearchValue] = useState()
  const [menuIsOpen, setMenuIsOpen] = useState()
  const router = useRouter()
  const StylesConfig = {
    control: (provided, { isFocused }) => ({
      ...provided,
      padding: isSearch ? "0 0 0 40px" : "0",
      borderRadius: "6px",
      boxShadow: "none",
      fontSize: "15px",
      height: "50px",
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
      fontSize: 15,
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 15,
      fontWeight: 500,
      color: "#000000",
    }),
    valueContainer: (provided, { isFocused }) => ({
      ...provided,
      fontSize: 15,
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
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#888",
      }
    },
    indicatorsContainer: (provided) => ({
      ...provided,
      display: "flex",
    }),
  }

  const getData = async (inputValue, callback) => {
    const payload = {
      options: {
        page: 1,
        limit: 10,
        sort: {
          createdAt: -1,
        },
      },
      query: {
        searchColumns: ["title", "briefDesc"],
        search: inputValue,
        isActive: true,
      },
    }
    await commonApi({
      action: "getCategoryDetail",
      parameters: [getCookie("deviceToken")],
      data: payload,
    }).then(([, { data = {} }]) => {
      // eslint-disable-next-line no-underscore-dangle
      const listData = data.data?.map((a) => ({ ...a, value: a._id, label: a?.title }))
      if (inputValue) {
        // eslint-disable-next-line promise/no-callback-in-promise
        callback?.(listData)
      } else {
        setOptions(listData)
      }
      return false
    })
  }

  const { getList } = usePaginate({ action: "getCategoryDetail", parameters: [getCookie("deviceToken")] })
  const loadMasterOptions = debounce(async (inputValue, callback) => {
    setMenuIsOpen(true)
    getData(inputValue, callback)
  })

  const onInputChange = (data) => {
    setSearchValue(data)
  }

  const onKeyDown = (e) => {
    if (e?.keyCode === 13 && searchValue) {
      e.preventDefault()
      setMenuIsOpen(false)
      const searchData = {
        value: searchValue,
        label: searchValue,
        isActive: true,
      }
      getList({
        query: {
          searchColumns: ["title", "briefDesc"],
          search: searchValue,
        },
        others: { saveSearch: true },
      })
      setSelectValue(searchData)
      localStorage.setItem("title", JSON.stringify(searchData))
      router.push(
        `${routes.category}/${encodeURIComponent(searchValue)}?name=${encodeURIComponent(
          searchValue
        )}&search=${encodeURIComponent(searchValue)}`
      )
    }
  }

  const onChange = (data) => {
    if (!data) {
      localStorage.removeItem("title")
      setSelectValue()
      setSearchValue()
      return
    }
    getList({
      query: {
        searchColumns: ["title", "briefDesc"],
        search: data?.label,
        isActive: true,
      },
      others: { saveSearch: true },
    })
    localStorage.setItem("title", JSON.stringify(data))
    router.push(
      `${routes.category}/${encodeURIComponent(data?.slug)}?name=${encodeURIComponent(
        data?.title
      )}&search=${encodeURIComponent(data?.title)}`
    )
    setSelectValue(data)
  }

  useEffect(() => {
    const title = localStorage.getItem("title")
    setSelectValue(title && JSON.parse(title))
  }, [])

  useEffect(() => {
    return () => {
      if (router.query.search) {
        setSelectValue("")
        setSearchValue()
      }
    }
  }, [router.query.slug])

  useEffect(() => {
    if (router.pathname === routes.home) {
      localStorage.removeItem("title")
      setSelectValue("")
      setSearchValue()
    }
  }, [])

  return (
    <div className="relative gap-4 w-full">
      {isSearch && (
        <div className="absolute top-2/4 -translate-y-2/4 left-3 z-10 text-gray-300">
          <SearchIcon size="24" className="text-gray-300" />
        </div>
      )}
      <AsyncSelect
        isSearchable
        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
        noOptionsMessage={() => null}
        className={`basic-single text-left ${className}`}
        placeholder={placeholder}
        classNamePrefix={name}
        name={name}
        styles={StylesConfig}
        id={id}
        value={selectValue}
        onInputChange={onInputChange}
        isClearable
        onChange={onChange}
        onKeyDown={onKeyDown}
        loadOptions={loadMasterOptions}
        defaultOptions={options}
        menuIsOpen={menuIsOpen}
        closeMenuOnSelect
        {...other}
      />
    </div>
  )
}

export default SearchSelectDropdown
