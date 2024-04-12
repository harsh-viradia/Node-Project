/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
// import { hasAccessTo } from "@knovator/can"
// import commonApi from "api"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT } from "utils/constant"
// import { debounce } from "utils/util"

const useViewStudents = ({ original }) => {
  const [searchValue, setSearchValue] = useState("")

  const {
    list = [],
    getList,
    paginate,
    loading,
    setList,
  } = usePaginate({
    module: "lerner",
    fixedQuery: {
      search: searchValue,
      searchColumns: ["name"],
    },
    action: "courseDetail",
    parameters: [original?._id],
  })

  const onPaginationChange = (offset, limit) => {
    return getList({
      options: {
        offset,
        limit,
      },
      query: {
        search: searchValue,
      },
    })
  }

  useEffect(() => {
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        search: searchValue,
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
    setList,
  }
}

export default useViewStudents
