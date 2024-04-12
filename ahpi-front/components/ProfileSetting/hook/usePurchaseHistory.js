import { useEffect } from "react"
import usePaginate from "shared/hook/usePaginate"
import { DEFAULT_LIMIT, POPULATE_PARAMS } from "utils/constant"

const usePurchaseHistory = ({ orderData = {} }) => {
  const { list, getList, loading, paginate, setList, setPaginate } = usePaginate({
    action: "purchaseHistory",
    populate: POPULATE_PARAMS.PURCHASE_HISTORY_PARAMS,
  })

  const onPaginationChange = (page = 1) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    window.history.pushState("", "", `?page=${page}`)
    return getList({
      options: {
        page,
        limit: DEFAULT_LIMIT,
      },
      filter: {
        sts: 1,
      },
    })
  }
  useEffect(() => {
    setList(orderData?.data)
    setPaginate(orderData?.paginator)
  }, [])

  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
  }
}

export default usePurchaseHistory
