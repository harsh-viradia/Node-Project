/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-unneeded-ternary */
import { hasAccessTo } from "@knovator/can"
import dayjs from "dayjs"
import usePaginate from "hook/common/usePaginate"
import getConfig from "next/config"
import qs from "qs"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"

const { publicRuntimeConfig } = getConfig()

const useStudent = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [openFilter, setOpenFilter] = useState(false)
  const [filterDetails, setFilterDetails] = useState("")

  const isAllow = (key) => hasAccessTo(permission, MODULES.APPLICANT, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    mount: isAllow(MODULE_ACTIONS.GETALL),
    module: "student",
    fixedQuery: {
      searchColumns: ["firstName", "emails.email", "mobile.no", "nikNo", "nim"],
      search: searchValue,
    },
    setOpenFilter,
  })

  const getListData = async ({ offset, limit, filterData = filterDetails }) => {
    const { isActive, unVerified, ...rest } = filterData
    const data = {
      options: {
        offset,
        limit,
      },
      filter: rest,
      isActive,
      unVerified,
      fixedQuery: {
        searchColumns: ["firstName", "emails.email", "mobile.no", "nikNo", "nim"],
        search: searchValue,
      },
    }
    await getList(data)
  }

  const onPaginationChange = (offset, limit) => {
    getListData({ offset, limit, filterData: filterDetails })
  }

  const applyFilter = (filterData) => {
    setFilterDetails(filterData)
    getListData({ offset: 0, limit: paginate.perPage, filterData })
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) {
      if (filterDetails) {
        getListData({ offset: 0, limit: paginate.perPage, filterData: filterDetails })
      } else {
        getList({
          options: {
            offset: 0,
            limit: paginate?.perPage || DEFAULT_LIMIT,
          },
        })
      }
    }
  }, [searchValue])

  const exportStudentList = () => {
    const payload = {}
    if (searchValue) {
      payload.search = searchValue
    }
    if (filterDetails?.courses?.length > 0) {
      payload.courseIds = filterDetails.courses.map((x) => x.courseId).toString()
    }
    if (filterDetails?.stsIds?.length > 0) {
      payload.stsId = filterDetails.stsIds.map((y) => y.stsId).toString()
    }
    if (filterDetails?.universityIds?.length > 0) {
      payload.universityIds = filterDetails.universityIds.map((x) => x.universityId).toString()
    }
    if (filterDetails?.appliedDate?.from && filterDetails?.appliedDate?.to) {
      payload.appliedDate = {
        from: dayjs(filterDetails.appliedDate.from).format("YYYY-MM-DD 00:00:00"),
        to: dayjs(filterDetails.appliedDate.to).format("YYYY-MM-DD 23:59:59"),
      }
    }
    if (filterDetails.isActive !== undefined) {
      payload.isActive = filterDetails.isActive
    }
    if (filterDetails?.unVerified !== undefined) {
      payload.unVerified = filterDetails.unVerified
    }
    window.open(`${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/admin/student/export?${qs.stringify(payload)}`, "_blank")
  }

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
    applyFilter,
    exportStudentList,
    getListData,
  }
}

export default useStudent
