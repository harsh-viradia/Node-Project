/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"

const useZipCode = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)
  const isAllow = (key) => hasAccessTo(permission, MODULES.ZIPCODE, key)
  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    module: "zip-code",
    mount: true,
    action: "all",
    fixedQuery: {
      searchColumns: ["zipcode"],
      search: searchValue,
      stateId: "62ec05d19bbf0fc90654de57",
    },
    populate: ["city", "country", "state"],
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

export default useZipCode
