/* eslint-disable no-unused-vars */
/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"

const useReview = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [openFilter, setOpenFilter] = useState(false)
  const [filter, setFilter] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState()
  const [rating, setRating] = useState()

  const isAllow = (key) => hasAccessTo(permission, MODULES.REVIEWS, key)
  const {
    list = [],
    getList,
    paginate,
    loading,
    setList,
  } = usePaginate({
    module: "reviews",
    mount: isAllow(MODULE_ACTIONS.GETALL),
    query: {
      searchColumns: ["fullName", "desc"],
      search: searchValue,
    },
    populate: ["courseId"],
    setOpenFilter,
  })

  const onClickClearFilter = () => {
    setFilter()
    setSelectedCourse()
    setRating()
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        searchColumns: ["fullName", "desc"],
        search: searchValue,
      },
    })
  }

  const handleApplyFilter = (sendObject) => {
    setFilter(sendObject)
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        searchColumns: ["fullName", "desc"],
        search: searchValue,
      },
      filter: sendObject,
    })
  }
  const onPaginationChange = (offset, limit) => {
    return getList({
      options: {
        offset,
        limit,
      },
      query: {
        search: searchValue,
        searchColumns: ["fullName", "desc"],
      },
      filter,
    })
  }
  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) {
      getList({
        options: {
          offset: 0,
          limit: paginate?.perPage || DEFAULT_LIMIT,
        },
        query: {
          searchColumns: ["fullName", "desc"],
          search: searchValue,
        },
        filter,
      })
    }
  }, [searchValue])

  return {
    filter,
    setFilter,
    setOpenFilter,
    openFilter,
    loading,
    setList,
    list,
    isAllow,
    searchValue,
    setSearchValue,
    onClickClearFilter,
    handleApplyFilter,
    selectedCourse,
    setSelectedCourse,
    onPaginationChange,
    rating,
    setRating,
    ...paginate,
  }
}

export default useReview
