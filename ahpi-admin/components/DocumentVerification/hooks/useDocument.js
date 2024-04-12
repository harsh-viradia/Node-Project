/* eslint-disable no-unused-vars */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"
import { debounce } from "utils/util"

const useDocument = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [openFilter, setOpenFilter] = useState(false)
  const [courseOptions, setCourseOptions] = useState([])
  const [courseFilter, setCourseFilter] = useState()

  const isAllow = (key) => hasAccessTo(permission, MODULES.APPLICANT, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    module: "student",
    fixedQuery: {
      searchColumns: ["firstName", "emails.email", "nikNo", "nim"],
      search: searchValue,
    },
    unVerified: true,
    setOpenFilter,
    mount: isAllow(MODULE_ACTIONS.GETALL),
  })

  const onPaginationChange = (offset, limit) => {
    const filterData = {}
    if (courseFilter?.length > 0) {
      filterData.courses = courseFilter
    }
    return getList({
      options: {
        offset,
        limit,
      },
      filter: filterData,
      unVerified: true,
    })
  }

  const applyFilter = async () => {
    const filterData = {}
    if (courseFilter?.length > 0) {
      filterData.courses = courseFilter
    }
    await getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      filter: filterData,
      unVerified: true,
    })
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) {
      const filterData = {}
      if (courseFilter?.length > 0) {
        filterData.courses = courseFilter
      }
      getList({
        options: {
          offset: 0,
          limit: paginate?.perPage || DEFAULT_LIMIT,
        },
        filter: filterData || undefined,
        unVerified: true,
      })
    }
  }, [searchValue])

  const getAllCourses = debounce(async (inputValue, callback) => {
    const payload = {
      query: {},
    }

    if (inputValue) {
      payload.query.searchColumns = ["name", "desc"]
      payload.query.search = inputValue
    }
    await commonApi({ action: "list", module: "course", common: true, data: payload }).then(([, { data = {} }]) => {
      const coursesList = data?.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(coursesList)
      } else {
        setCourseOptions(coursesList)
      }
      return false
    })
  }, 500)

  useEffect(() => {
    if (openFilter && hasAccessTo(permission, MODULES.COURSE, MODULE_ACTIONS.GETALL)) {
      getAllCourses()
    }
  }, [openFilter])

  return {
    ...paginate,
    loading,
    list,
    getList,
    onPaginationChange,
    setSearchValue,
    isAllow,
    setOpenFilter,
    openFilter,
    courseOptions,
    getAllCourses,
    setCourseFilter,
    applyFilter,
  }
}

export default useDocument
