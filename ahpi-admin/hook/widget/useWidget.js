/* eslint-disable no-unused-vars */
/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"

const useWidgets = ({ permission = {} }) => {
  const [searchValue, setSearchValue] = useState("")
  const [filter, setFilter] = useState()
  const [widgetTypeFilter, setWidgetTypeFilter] = useState()
  const [openFilter, setOpenFilter] = useState(false)
  const [filterObject, setFilterObject] = useState({})
  const isAllow = (key) => hasAccessTo(permission, MODULES.WIDGET, key)

  const router = useRouter()
  const { query } = router

  const {
    list = [],
    getList,
    paginate,
    loading,
    setList,
  } = usePaginate({
    // action: "add",
    module: "widget",
    mount: isAllow(MODULE_ACTIONS.GETALL),
    populate: ["type", "secType"],
    fixedQuery: {
      searchColumns: ["name", "code"],
      search: searchValue,
    },
    setOpenFilter,
  })

  const onPaginationChange = (offset, limit) => {
    // return getList(options{offset, limit})
    getList({
      options: {
        offset,
        limit,
      },
      query: {
        searchColumns: ["name", "code"],
        search: searchValue,
      },
      filter: {
        isActive: filter?.value,
        type: widgetTypeFilter?.value,
      },
    })
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) {
      getList({
        options: {
          offset: Number(query?.offset) || 0,
          limit: Number(query?.limit) || paginate?.perPage || DEFAULT_LIMIT,
        },
        query: {
          searchColumns: ["name", "code"],
          search: searchValue,
        },
        filter: {
          isActive: filter?.value,
          type: widgetTypeFilter?.value,
        },
      })
    }
  }, [searchValue])

  const handleApplyFilter = () => {
    setFilterObject({ filter: filter?.value, widgetType: widgetTypeFilter?.value })
    getList({
      query: {
        searchColumns: ["name"],
        search: searchValue,
      },
      filter: {
        isActive: filter?.value,
        type: widgetTypeFilter?.value,
      },
    })
  }
  const onClickClearFilter = () => {
    setFilterObject()
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
    })
    setFilter()
    setWidgetTypeFilter()
  }

  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
    isAllow,
    setSearchValue,
    searchValue,
    setList,
    openFilter,
    setOpenFilter,
    filter,
    setFilter,
    handleApplyFilter,
    onClickClearFilter,
    widgetTypeFilter,
    setWidgetTypeFilter,
    filterObject,
  }
}

export default useWidgets
