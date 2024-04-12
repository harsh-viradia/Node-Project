/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import { useEffect, useState } from "react"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import Toast from "utils/toast"

const useSyncUser = ({ open, setOpen, getList, defaultValues, reset, pagination = {}, permission }) => {
  const [loading, setLoading] = useState(false)

  const onSubmit = async (values) => {
    const { id, roleId, ...other } = values
    const payload = {
      roles: [{ roleId }],
      ...other,
      roleNm: undefined,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "create",
        parameters: [id],
        module: "users",
        common: true,
        data: payload,
      }).then(async ([error, { message = "" }]) => {
        if (error) return false
        Toast(message, "success")
        reset({ ...defaultValues })
        if (hasAccessTo(permission, MODULES.USER, MODULE_ACTIONS.GETALL)) {
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
  useEffect(() => {
    reset({ ...defaultValues })
  }, [open])
  return {
    onSubmit,
    loading,
  }
}
export default useSyncUser
