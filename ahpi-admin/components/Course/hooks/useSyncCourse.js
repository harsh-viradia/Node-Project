/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import { useState } from "react"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import Toast from "utils/toast"

const useSyncCourse = ({ setOpen, getList, defaultValues, reset, pagination = {}, permission }) => {
  const [loading, setLoading] = useState(false)

  const onSubmit = async (values) => {
    const { id, ...other } = values
    const newData = {
      isActive: true,
      ...other,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "create",
        parameters: [id],
        module: "course",
        common: true,
        data: newData,
      }).then(async ([, { message = "" }]) => {
        Toast(message, "success")
        reset(defaultValues)
        if (hasAccessTo(permission, MODULES.COURSE, MODULE_ACTIONS.GETALL)) {
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

  return {
    onSubmit,
    loading,
  }
}
export default useSyncCourse
