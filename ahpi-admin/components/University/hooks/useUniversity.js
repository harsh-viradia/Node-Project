import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import getConfig from "next/config"
import qs from "qs"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"

const { publicRuntimeConfig } = getConfig()

const useUniversity = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState()

  const isAllow = (key) => hasAccessTo(permission, MODULES.UNIVERSITY, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    module: "university",
    search: searchValue,
    mount: isAllow(MODULE_ACTIONS.GETALL),
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
    if (isAllow(MODULE_ACTIONS.GETALL)) {
      getList({
        options: {
          offset: 0,
          limit: paginate?.perPage || DEFAULT_LIMIT,
        },
      })
    }
  }, [searchValue, userId])

  const exportUniversityList = () => {
    const payload = {}

    if (searchValue) {
      payload.search = searchValue
    }
    window.open(
      `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/admin/university/export?${qs.stringify(payload)}`,
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
    open,
    setOpen,
    isAllow,
    setUserId,
    exportUniversityList,
  }
}

export default useUniversity
