import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"

const useProvince = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)
  const isAllow = (key) => hasAccessTo(permission, MODULES.PROVINCE, key)
  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    action: "provinceList",
    module: "state",
    mount: true,
    fixedQuery: {
      searchColumns: ["name", "code", "ISOCode2"],
      search: searchValue,
    },
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

export default useProvince
