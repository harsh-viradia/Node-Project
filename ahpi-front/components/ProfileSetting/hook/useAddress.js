import commonApi from "api/index"
import { useEffect } from "react"
import usePaginate from "shared/hook/usePaginate"
import { DEFAULT_LIMIT } from "utils/constant"
import Toast from "utils/toast"

const useAddress = ({ addressData = {} }) => {
  const { list, getList, loading, paginate, setList, setPaginate } = usePaginate({
    action: "addressList",
  })

  const onPaginationChange = (page = 1) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    window.history.pushState("", "", `?page=${page}`)
    return getList({
      options: {
        page,
        limit: DEFAULT_LIMIT,
      },
    })
  }
  useEffect(() => {
    setList(addressData?.data)
    setPaginate(addressData?.paginator)
  }, [])
  const setAsDefault = async (id) => {
    await commonApi({
      action: "makeDefaultAddress",
      parameters: [id],
      data: {
        isDefault: true,
      },
    }).then(([error, success]) => {
      if (error) return false
      Toast(success?.message)
      // eslint-disable-next-line no-underscore-dangle
      setList(list.map((a) => ({ ...a, isDefault: a._id === id })))
      return false
    })
  }
  const removeAddress = async (id) => {
    await commonApi({
      action: "deleteAddress",
      data: {
        ids: [id],
      },
    }).then(([error, success]) => {
      if (error) return false
      Toast(success?.message)
      // eslint-disable-next-line no-underscore-dangle
      setList(list.filter((a) => a._id !== id))
      return false
    })
  }
  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
    setAsDefault,
    removeAddress,
  }
}

export default useAddress
