/* eslint-disable no-unused-vars */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import { useState } from "react"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import Toast from "utils/toast"
import { capitalizeFirstLetter, joinString } from "utils/util"

const useSyncRole = ({ reset, setOpen, defaultValues, getList, pagination = {}, permission }) => {
  const [loading, setLoading] = useState(false)

  const onSubmit = async ({ _id, name }) => {
    const payload = {
      // weight: "1",
      name: capitalizeFirstLetter(name),
      // code: joinString(name).toUpperCase(),
    }
    try {
      setLoading(true)
      await commonApi({
        action: _id ? "update" : "create",
        parameters: [_id],
        module: "role",
        common: true,
        data: payload,
      }).then(async ([error, response]) => {
        if (error) {
          return
        }
        const { message = "" } = response
        Toast(message, "success")
        reset(defaultValues)
        setOpen(false)
        // if (hasAccessTo(permission, MODULES.ROLE, MODULE_ACTIONS.GETALL)) {
        if (_id) {
          getList({
            options: {
              offset: pagination.offset,
              limit: pagination.perPage,
            },
          })
        } else {
          getList()
        }
        // }
        // eslint-disable-next-line consistent-return
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
export default useSyncRole
