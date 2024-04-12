import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, DEFAULT_SORT, MODULES } from "utils/constant"

const useMaster = ({ permission }) => {
  // const [pagination, setPagination] = useState()
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedMaster, setSelectedMaster] = useState()

  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    module: "masters",
    mount: true,
    fixedQuery: {
      searchColumns: ["name", "code"],
      search: searchValue,
      parentCode: {
        $exists: false,
      },
    },
    // populate: ["img"],
    sort: {
      createdAt: DEFAULT_SORT,
    },
  })

  const isAllow = (key) => hasAccessTo(permission, MODULES.MASTER, key)

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
    onPaginationChange,
    list,
    getList,
    open,
    setOpen,
    searchValue,
    setSearchValue,
    selectedMaster,
    setSelectedMaster,
    isAllow,
  }
}

export default useMaster
