import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT } from "utils/constant"

const useSubMaster = ({ parentId, parentCode }) => {
  const [subMasterList, setSubMasterList] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)

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
      parentId,
      parentCode,
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
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
    })
  }, [parentCode, searchValue])

  return {
    subMasterList,
    open,
    setOpen,
    loading,
    searchValue,
    setSearchValue,
    onPaginationChange,
    list,
    getList,
    setSubMasterList,
    ...paginate,
  }
}

export default useSubMaster
