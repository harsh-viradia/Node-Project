import commonApi from "api"
import { useEffect, useState } from "react"
import { DEFAULT_CURRENT_PAGE, DEFAULT_LIMIT } from "utils/constant"
import Toast from "utils/toast"
import { debounce } from "utils/util"

const useSyncZipCode = ({ open, setOpen, getList, defaultValues, reset, pagination = {}, getValues }) => {
  const [loading, setLoading] = useState(false)
  const [selectValue, setSelectValue] = useState()
  const [cityOptions, setCityOptions] = useState([])
  const [stateOptions, setStateOptions] = useState([])
  const [CountryOptions, setCountryOptions] = useState([])
  const [selectStateValue, setSelectStateValue] = useState()
  const [SelectCountryValue, setSelectCountryValue] = useState()

  const onSelectInputChange = () => {
    setSelectValue()
  }

  const onSelectStateInputChange = () => {
    setSelectStateValue()
  }

  const onSelectCountryInputChange = () => {
    setSelectCountryValue()
  }

  const onSubmit = async (values) => {
    const { id, zipCode, city, country, stateId } = values
    const payload = {
      zipcode: zipCode,
      city,
      country,
      state: stateId,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "create",
        parameters: [id],
        module: "zip-code",
        common: true,
        data: payload,
      }).then(async ([error, { message = "" }]) => {
        if (error) return false
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
    }).then(([error, response = {}]) => {
      if (error) return false
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
    }).then(([error, response = {}]) => {
      if (error) return false
      const { data = {} } = response
      const stateList = data.data?.map(({ _id, name, countryNm }) => ({
        value: _id,
        label: `${name} (${countryNm})`,
      }))
      if (inputValue) {
        callback?.(stateList)
      } else {
        setStateOptions(stateList)
      }
      return false
    })
  }, 500)

  const getAllCity = debounce(async (inputValue, callback) => {
    const payload = {
      page: DEFAULT_CURRENT_PAGE,
      limit: DEFAULT_LIMIT,
      stateId: "",
      query: {},
    }
    if (inputValue) {
      payload.query.search = inputValue
      payload.query.searchColumns = ["name", "code"]
    }
    if (getValues("stateId")) {
      payload.query.stateId = getValues("stateId")
    }
    await commonApi({
      action: "cityList",
      module: "city",
      common: true,
      data: payload,
    }).then(([, response = {}]) => {
      const { data = {} } = response
      const cityList = data.data?.map(({ _id, name, stateNm }) => ({
        value: _id,
        label: `${name} (${stateNm})`,
      }))
      if (inputValue) {
        callback?.(cityList)
      } else {
        setCityOptions(cityList)
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

  useEffect(() => {
    if (open && getValues("stateId")) {
      getAllCity()
    }
  }, [getValues("stateId")])

  return {
    onSubmit,
    loading,
    selectValue,
    selectStateValue,
    SelectCountryValue,
    setSelectValue,
    setSelectStateValue,
    setSelectCountryValue,
    cityOptions,
    stateOptions,
    CountryOptions,
    getAllCountry,
    getAllCity,
    getAllStates,
    onSelectInputChange,
    onSelectStateInputChange,
    onSelectCountryInputChange,
  }
}
export default useSyncZipCode
