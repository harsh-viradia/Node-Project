/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import usePaginate from "hook/common/usePaginate"
import qs from "qs"
import { useCallback, useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES, SYSTEM_USERS } from "utils/constant"
import Toast from "utils/toast"

const useCertificate = ({ permission, user }) => {
  const [searchValue, setSearchValue] = useState("")
  const [openFilter, setOpenFilter] = useState(false)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState()

  const isAllow = (key) => hasAccessTo(permission, MODULES.CERTIFICATE, key)
  const {
    list = [],
    getList,
    paginate,
    loading,
    setList,
  } = usePaginate({
    module: "certificate",
    action: "list",
    mount: true,
    fixedQuery: {
      searchColumns: ["name"],
      search: searchValue,
    },
    select: "-details",
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
        search: searchValue,
        filter: { instructorId: user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : undefined },
      },
    })
  }

  const handleApplyFilter = (sendobject = {}) => {
    setFilter(sendobject)
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        search: searchValue,
        filter: { ...sendobject, instructorId: user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : undefined },
      },
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
        filter: { ...filter, instructorId: user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : undefined },
      },
    })
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL))
      getList({
        options: {
          limit: paginate?.perPage || DEFAULT_LIMIT,
        },
        query: {
          search: searchValue,
          filter: { ...filter, instructorId: user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : undefined },
        },
      })
  }, [searchValue])
  const partialDefaultUpdate = useCallback(
    (id, data) => async () => {
      await commonApi({
        parameters: [id],
        module: "certificate/set-default",
        data,
        common: true,
        action: "partialDefaultCountryUpdate",
      }).then(([error, { message }]) => {
        if (error) return false
        Toast(message)
        getList({
          options: {
            offset: paginate?.offset,
            limit: paginate?.perPage || DEFAULT_LIMIT,
          },
          query: {
            search: searchValue,
            filter: { ...filter, instructorId: user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : undefined },
          },
        })
        return false
      })
    },
    []
  )
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
    list,
    getList,
    open,
    setOpen,
    partialDefaultUpdate,
    ...paginate,
  }
}

export default useCertificate
