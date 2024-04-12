/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable promise/always-return */
/* eslint-disable no-unused-vars */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import usePaginate from "hook/common/usePaginate"
import { useCallback, useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"
import Toast from "utils/toast"

const useCountry = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)
  const isAllow = (key) => hasAccessTo(permission, MODULES.COUNTRY, key)
  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    module: "country",
    action: "all",
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
        search: searchValue,
      })
  }, [searchValue])

  const partialDefaultUpdate = useCallback(
    (id, data) => async () => {
      try {
        await commonApi({
          parameters: [id],
          module: "country/update-default",
          data,
          common: true,
          action: "partialDefaultCountryUpdate",
        }).then(([error, { message }]) => {
          if (error) return false
          Toast(message)
          getList()
          return false
        })
      } finally {
      }
    },
    []
  )

  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
    setSearchValue,
    open,
    setOpen,
    partialDefaultUpdate,
    isAllow,
  }
}

export default useCountry
