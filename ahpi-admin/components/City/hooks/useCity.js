/* eslint-disable react-hooks/exhaustive-deps */
import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"

const useCity = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)
  const isAllow = (key) => hasAccessTo(permission, MODULES.CITY, key)
  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    module: "city",
    mount: true,
    action: "cityList",
    fixedQuery: {
      searchColumns: ["name", "code"],
      search: searchValue,
    },
    populate: ["stateId"],
  })

  const onPaginationChange = (offset, limit) => {
    return getList({
      options: {
        offset,
        limit,
      },
    })
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL))
      getList({
        options: {
          offset: 0,
          limit: paginate?.perPage || DEFAULT_LIMIT,
        },
        search: searchValue,
      })
  }, [searchValue])

  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
    setSearchValue,
    open,
    setOpen,
    isAllow,
  }
}

export default useCity
