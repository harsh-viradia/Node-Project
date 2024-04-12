import commonApi from "api"
import Toast from "utils/toast"

const useSyncMaster = ({ reset, setOpen, defaultValues, getList, pagination = {}, setLoading2 }) => {
  const onSubmit = async (values) => {
    const { id, ...data } = values
    try {
      setLoading2(true)
      await commonApi({
        action: id ? "update" : "create",
        parameters: [id],
        module: "masters",
        common: true,
        data,
        errorToast: false,
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
        return false
      })
    } finally {
      setLoading2(false)
    }
  }
  return {
    onSubmit,
  }
}
export default useSyncMaster
