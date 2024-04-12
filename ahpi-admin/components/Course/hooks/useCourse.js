import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import getConfig from "next/config"
import qs from "qs"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"

const { publicRuntimeConfig } = getConfig()
const useCourse = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const isAllow = (key) => hasAccessTo(permission, MODULES.COURSE, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    module: "course",
    fixedQuery: {
      searchColumns: ["name", "desc"],
      search: searchValue,
    },
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
  }, [searchValue])

  const exportCourseList = () => {
    const payload = {}

    if (searchValue) {
      payload.search = searchValue
    }
    window.open(`${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/admin/course/export?${qs.stringify(payload)}`, "_blank")
  }

  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
    setSearchValue,
    isAllow,
    exportCourseList,
  }
}

export default useCourse
