import commonApi from "api"
import { useState } from "react"
import Toast from "utils/toast"

const useSyncSubMaster = ({ parentCode, parentId, reset, setOpen, defaultValues, getList, pagination = {} }) => {
  const [loading, setLoading] = useState(false)

  const onSubmit = async (values) => {
    const { id, ...other } = values
    const payload = {
      parentCode,
      parentId,
      ...other,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "create",
        parameters: [id],
        module: "masters",
        common: true,
        data: payload,
      }).then(async ([, { message = "" }]) => {
        Toast(message, "success")
        reset({ ...defaultValues })
        setOpen(false)
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
        // dt.getSubMasterList()
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
export default useSyncSubMaster
