/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-unused-vars */
import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { MODULE_ACTIONS, MODULES } from "utils/constant"

const useRole = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const isAllow = (key) => hasAccessTo(permission, MODULES.ROLE, key)
  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    module: "role",
    mount: isAllow(MODULE_ACTIONS.GETALL),
    fixedQuery: {
      searchColumns: ["name", "code"],
      search: searchValue,
    },
  })

  const onPaginationChange = (offset, limit) => {
    return getList({
      // search,
      options: {
        offset,
        limit,
      },
    })
  }
  useEffect(() => {
    getList()
  }, [])
  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
    setSearchValue,
    isAllow,
  }
}

export default useRole
