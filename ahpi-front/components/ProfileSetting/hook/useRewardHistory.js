import { useEffect } from "react"
import usePaginate from "shared/hook/usePaginate"
import { DEFAULT_LIMIT } from "utils/constant"

const useRewardHistory = ({ listData = {} }) => {
  const { list, getList, loading, paginate, setList, setPaginate } = usePaginate({
    action: "purchaseHistory",
    fixedQuery: { $or: [{ usedRewardsForOrder: { $gt: 0 } }, { earnedRewardsForOrder: { $gt: 0 } }] },
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
    setList(listData?.data)
    setPaginate(listData?.paginator)
  }, [])

  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
  }
}

export default useRewardHistory
