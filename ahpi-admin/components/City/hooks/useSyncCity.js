/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import { useEffect, useState } from "react"
import { DEFAULT_CURRENT_PAGE, DEFAULT_LIMIT } from "utils/constant"
import Toast from "utils/toast"
import { debounce } from "utils/util"

const useSyncCity = ({ open, setOpen, getList, defaultValues, reset, pagination = {}, getValues }) => {
  const [loading, setLoading] = useState(false)
  const [selectValue, setSelectValue] = useState()
  const [stateOptions, setStateOptions] = useState([])
  const [SelectCountryValue, setSelectCountryValue] = useState()
  const [CountryOptions, setCountryOptions] = useState([])

  const onSelectInputChange = () => {
    setSelectValue()
  }

  const onSelectCountryInputChange = () => {
    setSelectCountryValue()
  }

  const onSubmit = async (values) => {
    const { id, name, code, stateId, stateNm } = values
    const payload = {
      isActive: true,
      name,
      code,
      stateId,
      stateNm,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "create",
        parameters: [id],
        module: "city",
        common: true,
        data: payload,
      }).then(async ([, { message = "" }]) => {
        Toast(message, "success")
        reset({ ...defaultValues })
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
        setOpen(false)
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  const getAllCountry = debounce(async (inputValue, callback) => {
    const payload = {
      page: DEFAULT_CURRENT_PAGE,
      limit: DEFAULT_LIMIT,
      query: {},
    }
    if (inputValue) {
      payload.query.search = inputValue
      payload.query.searchColumns = ["name", "code", "ISDCode"]
    }
    await commonApi({
      action: "all",
      module: "country",
      common: true,
      data: payload,
    }).then(([, response = {}]) => {
      const { data = {} } = response
      const countryList = data.data?.map(({ _id, name }) => ({
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
      query: {},
    }
    if (inputValue) {
      payload.query.search = inputValue
      payload.query.searchColumns = ["name", "code", "ISOCode2"]
    }
    if (getValues("country")) {
      payload.query.countryId = getValues("country")
    }
    await commonApi({
      action: "provinceList",
      module: "state",
      common: true,
      data: payload,
    }).then(([, response = {}]) => {
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

  useEffect(() => {
    reset({ ...defaultValues })
    if (open) {
      getAllCountry()
    }
  }, [open])

  useEffect(() => {
    if (open && getValues("country")) {
      getAllStates()
    }
  }, [getValues("country")])

  return {
    onSubmit,
    loading,
    selectValue,
    setSelectValue,
    SelectCountryValue,
    CountryOptions,
    setSelectCountryValue,
    onSelectCountryInputChange,
    stateOptions,
    getAllCountry,
    getAllStates,
    onSelectInputChange,
  }
}
export default useSyncCity
