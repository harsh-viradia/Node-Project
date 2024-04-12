/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import { useEffect, useState } from "react"
import { DEFAULT_CURRENT_PAGE, DEFAULT_LIMIT } from "utils/constant"
import Toast from "utils/toast"
import { debounce } from "utils/util"

const useSyncProvince = ({ open, setOpen, getList, defaultValues, reset, pagination = {} }) => {
  const [loading, setLoading] = useState(false)
  const [countryOptions, setCountryOptions] = useState([])
  const [selectValue, setSelectValue] = useState()

  const onSubmit = async (values) => {
    const { id, ...other } = values
    const payload = {
      isActive: true,
      ...other,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "create",
        parameters: [id],
        module: "state",
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

  useEffect(() => {
    reset({ ...defaultValues })
  }, [open])

  const getAllCountries = debounce(async (inputValue, callback) => {
    const payload = {
      page: DEFAULT_CURRENT_PAGE,
      limit: DEFAULT_LIMIT,
      query: {},
    }
    if (inputValue) {
      payload.query.search = inputValue
      payload.query.searchColumns = ["name", "code", "ISOCode2"]
    }
    await commonApi({
      module: "country",
      action: "all",
      data: payload,
      common: true,
    }).then(([, { data = {} }]) => {
      const countryList = data?.data?.map(({ _id, name }) => ({
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

  const onSelectInputChange = () => {
    setSelectValue()
  }

  useEffect(() => {
    reset({ ...defaultValues })
    if (open) {
      getAllCountries()
    }
  }, [open])

  return {
    onSubmit,
    loading,
    getAllCountries,
    countryOptions,
    selectValue,
    setSelectValue,
    onSelectInputChange,
  }
}
export default useSyncProvince
