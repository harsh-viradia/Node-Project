/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import getConfig from "next/config"
import qs from "qs"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULES } from "utils/constant"

const { publicRuntimeConfig } = getConfig()

const useOrder = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [openFilter, setOpenFilter] = useState(false)
  const [filter, setFilter] = useState({})
  const isAllow = (key) => hasAccessTo(permission, MODULES.ORDERS, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
    setList,
  } = usePaginate({
    module: "api/v1/order",
    fixedQuery: {
      searchColumns: ["orderNo"],
      search: searchValue,
    },
    populate: ["user.id", "receiptId", "courses.courseId"],
    mount: true,
    setOpenFilter,
  })

  const onPaginationChange = (offset, limit) => {
    return getList({
      options: {
        offset,
        limit,
      },
      query: {
        search: searchValue,
      },
      filter,
    })
  }
  const handleApplyFilter = (sendObject) => {
    setFilter(sendObject)
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        search: searchValue,
      },
      filter: sendObject,
    })
  }

  const onClickClearFilter = () => {
    setFilter()
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        search: searchValue,
      },
      filter: {},
    })
  }

  useEffect(() => {
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        search: searchValue,
      },
      filter,
    })
  }, [searchValue])

  const exportOrder = async () => {
    const payload = {
      userId: filter?.["user.id"],
      payMethod: filter?.payMethod,
      sts: filter?.sts,
      startDate: filter?.startDate,
      endDate: filter?.endDate,
      search: searchValue,
      searchColumns: "orderNo",
    }
    window.open(
      `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/admin/api/v1/order/export-list?${qs.stringify(payload)}`,
      "_blank"
    )
  }

  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
    setSearchValue,
    isAllow,
    setList,
    openFilter,
    setOpenFilter,
    filter,
    setFilter,
    handleApplyFilter,
    onClickClearFilter,
    exportOrder,
  }
}

export default useOrder
