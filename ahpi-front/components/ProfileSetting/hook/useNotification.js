import commonApi from "api/index"
import React, { useEffect } from "react"
import usePaginate from "shared/hook/usePaginate"
import AppContext from "utils/AppContext"
import { DEFAULT_LIMIT } from "utils/constant"
import Toast from "utils/toast"

const useNotification = ({ notificationList = {} }) => {
  const { setNotificationCount } = React.useContext(AppContext)
  const { list, getList, loading, paginate, setList, setPaginate } = usePaginate({
    action: "generalNotification",
    populate: [
      {
        path: "notificationId",
        populate: { path: "criteriaId imgId", select: "name nm code uri" },
        select: "nm title desc",
      },
    ],
    fixedQuery: {
      searchColumns: ["nm", "title", "desc"],
      search: "",
      isRead: false,
    },
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
    setList(notificationList?.data)
    setPaginate(notificationList?.paginator)
  }, [])
  useEffect(() => {
    setNotificationCount(paginate?.itemCount)
  }, [paginate])
  const setNotificationAsRead = async (id) => {
    await commonApi({
      action: "markNotificationAsRead",
      parameters: [id],
      data: {
        isRead: true,
      },
    }).then(([error, { message }]) => {
      if (error) return false
      Toast(message)
      getList({
        options: {
          page: paginate?.currentPage,
          limit: DEFAULT_LIMIT,
        },
      })
      return false
    })
  }
  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
    setNotificationAsRead,
  }
}

export default useNotification
