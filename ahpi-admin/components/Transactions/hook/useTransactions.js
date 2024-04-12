/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import getConfig from "next/config"
import qs from "qs"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"

const { publicRuntimeConfig } = getConfig()

const useTransaction = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [openFilter, setOpenFilter] = useState(false)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState(false)

  const isAllow = (key) => hasAccessTo(permission, MODULES.TRANSACTIONS, key)
  const {
    list = [],
    getList,
    paginate,
    loading,
    setList,
  } = usePaginate({
    module: "api/v1/payment",
    action: "add",
    mount: true,
    populate: [
      {
        path: "orderId",
        populate: "receiptId",
        select: "orderNo payMethod usedRewardsForOrder",
      },
      {
        path: "userId",
        select: "name email",
      },
      {
        path: "stsId",
      },
    ],
    select: "-payTransId -res -remark -updatedAt",

    fixedQuery: {
      searchColumns: ["transNo"],
      search: searchValue,
    },
    setOpenFilter,
  })

  const onClickClearFilter = () => {
    setFilter()
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        searchColumns: ["transNo"],
        search: searchValue,
      },
    })
  }

  const handleApplyFilter = (sendobject) => {
    setFilter(sendobject)
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        search: searchValue,
        searchColumns: ["transNo"],
      },
      filter: sendobject,
    })
  }

  const onPaginationChange = (offset, limit) => {
    return getList({
      options: {
        offset,
        limit,
      },
      query: {
        search: searchValue,
        searchColumns: ["transNo"],
      },
      filter,
    })
  }

  const exportOrder = async () => {
    // eslint-disable-next-line no-unused-expressions
    const payload = {
      stsId: filter?.stsId,
      type: filter?.type,
      userId: filter?.userId,
      startDate: filter?.startDate,
      endDate: filter?.endDate,
      search: searchValue,
      searchColumns: "transNo",
    }
    window.open(
      //     // eslint-disable-next-line no-undef
      `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/admin/api/v1/payment/export?${qs.stringify(payload)}`,
      "_blank"
    )
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL))
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

  return {
    filter,
    setFilter,
    setOpenFilter,
    openFilter,
    loading,
    setList,
    isAllow,
    searchValue,
    setSearchValue,
    onClickClearFilter,
    handleApplyFilter,
    onPaginationChange,
    exportOrder,
    list,
    getList,
    open,
    setOpen,
    ...paginate,
  }
}

export default useTransaction
