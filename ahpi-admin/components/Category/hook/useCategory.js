/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES, SYSTEM_USERS } from "utils/constant"

const useCategory = ({ permission, user }) => {
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [editId, setEditId] = useState()
  const [openFilter, setOpenFilter] = useState(false)
  const [filter, setFilter] = useState()
  const isAllow = (key) => hasAccessTo(permission, MODULES.CATEGORY, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
    setList,
  } = usePaginate({
    module: "category",
    mount: isAllow(MODULE_ACTIONS.GETALL),
    populate: ["image", "parentCategory", "topics"],
    fixedQuery: {
      instructorId: user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : undefined,
      searchColumns: ["name", "parentCategory.name"],
      search: searchValue,
    },
    setOpenFilter,
  })

  const onPaginationChange = (offset, limit) => {
    getList({
      options: {
        offset,
        limit,
      },
      query: {
        isActive: filter?.value,
        search: searchValue,
      },
    })
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) {
      getList({
        options: {
          offset: 0,
          limit: paginate?.perPage || DEFAULT_LIMIT,
        },
        query: {
          isActive: filter?.value,
          search: searchValue,
        },
      })
    }
  }, [searchValue])

  const handleApplyFilter = () => {
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        isActive: filter?.value,
        search: searchValue,
      },
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
    })
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
    open,
    setOpen,
    open1,
    setOpen1,
    editId,
    setEditId,
    openFilter,
    setOpenFilter,
    filter,
    setFilter,
    handleApplyFilter,
    onClickClearFilter,
    setList,
  }
}

export default useCategory
