/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import { useState } from "react"
import Toast from "utils/toast"

const useSyncCountry = ({ setOpen, getList, defaultValues, reset, pagination = {} }) => {
  const [loading, setLoading] = useState(false)

  const onSubmit = async (values) => {
    const { id, ...other } = values
    const payload = {
      isActive: true,
      ...other,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "countryUpdate" : "create",
        parameters: [id],
        module: "country",
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

  return {
    onSubmit,
    loading,
  }
}
export default useSyncCountry
