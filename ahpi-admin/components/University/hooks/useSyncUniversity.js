/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import { useEffect, useState } from "react"
import { DEFAULT_CURRENT_PAGE, DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"
import Toast from "utils/toast"
import { debounce } from "utils/util"

const useSyncUniversity = ({ open, setOpen, getList, defaultValues, reset, pagination = {}, permission }) => {
  const [loading, setLoading] = useState(false)
  const [countryOptions, setCountryOptions] = useState([])
  const [selectValue, setSelectValue] = useState()
  const [stateOptions, setStateOptions] = useState([])
  const [selectValue2, setSelectValue2] = useState()
  const [cityOptions, setCityOptions] = useState([])
  const [selectValue3, setSelectValue3] = useState()

  const onSelectInputChange = () => {
    setSelectValue()
  }

  const onSelectInputChange2 = () => {
    setSelectValue2()
  }

  const onSelectInputChange3 = () => {
    setSelectValue3()
  }

  const onSubmit = async (values) => {
    const { id, street, countryId, countryNm, stateId, stateNm, cityId, cityNm, zipCode, ...other } = values
    const payload = {
      isAffiliated: true,
      isActive: true,
      add: {
        street,
        countryId,
        countryNm,
        stateId,
        stateNm,
        cityId,
        cityNm,
        zipCode,
      },
      ...other,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "create",
        parameters: [id],
        module: "university",
        common: true,
        data: payload,
      }).then(async ([, { message = "" }]) => {
        Toast(message, "success")
        reset({ ...defaultValues })
        if (hasAccessTo(permission, MODULES.UNIVERSITY, MODULE_ACTIONS.GETALL)) {
          if (id) {
            getList({
              options: {
                offset: pagination.offset,
                limit: pagination.perPage,
              },
            })
          } else {
            getList()
          }
        }
        setOpen(false)
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  const getAllCountries = debounce(async (inputValue, callback) => {
    const payload = {
      page: DEFAULT_CURRENT_PAGE,
      limit: DEFAULT_LIMIT,
    }
    if (inputValue) {
      payload.search = inputValue
    }
    await commonApi({ action: "findAllCountry", data: payload }).then(([, response = {}]) => {
      const { data = {} } = response
      const countries = inputValue ? data?.data : data
      const countryList = countries?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(countryList)
      } else {
        setCountryOptions(countryList)
      }
      return false
    })
  }, 500)

  const getAllStates = debounce(async (inputValue, callback) => {
    const payload = {
      page: DEFAULT_CURRENT_PAGE,
      limit: DEFAULT_LIMIT,
    }
    if (inputValue) {
      payload.search = inputValue
    }
    await commonApi({ action: "findAllStates", data: payload }).then(([, response = {}]) => {
      const { data = {} } = response
      const stateList = data.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(stateList)
      } else {
        setStateOptions(stateList)
      }
      return false
    })
  }, 500)

  const getAllCities = debounce(async (inputValue, callback) => {
    const payload = {
      page: DEFAULT_CURRENT_PAGE,
      limit: DEFAULT_LIMIT,
    }
    if (inputValue) {
      payload.search = inputValue
    }
    await commonApi({ action: "findAllCities", data: payload }).then(([, response = {}]) => {
      const { data = {} } = response
      const citiesList = data.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(citiesList)
      } else {
        setCityOptions(citiesList)
      }
      return false
    })
  }, 500)

  useEffect(() => {
    reset({ ...defaultValues })
    if (open) {
      getAllCountries()
      getAllStates()
      getAllCities()
    }
  }, [open])

  return {
    onSubmit,
    loading,
    setSelectValue,
    setSelectValue2,
    setSelectValue3,
    selectValue,
    selectValue2,
    selectValue3,
    onSelectInputChange,
    onSelectInputChange2,
    onSelectInputChange3,
    getAllCountries,
    getAllStates,
    getAllCities,
    stateOptions,
    countryOptions,
    cityOptions,
  }
}
export default useSyncUniversity
