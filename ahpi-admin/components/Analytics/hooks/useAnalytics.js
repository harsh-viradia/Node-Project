/* eslint-disable react/jsx-filename-extension */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import getConfig from "next/config"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES, SYSTEM_USERS } from "utils/constant"
import { dateDisplay } from "utils/util"

const { publicRuntimeConfig } = getConfig()
const TYPE_NAMES = ["Daily", "Weekly", "Monthly", "Yearly"]
const TYPE_FORMATS = {
  Yearly: {
    format: "Y",
    type: "year",
  },

  Monthly: {
    format: "MMM Y",
    type: "month",
  },

  Weekly: {
    format: "DD MMM Y",
    type: "week",
  },

  Daily: {
    format: "DD MMM Y",
    type: "day",
  },
}
const startOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}
const DEFAULT_FILTER = { dateRange: [startOfMonth(), new Date()] }
const DATE_FORMAT = "YYYY-MM-DD"
const useAnalytics = ({ permission, user }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [reportData, setReportData] = useState()
  const [type, setType] = useState(TYPE_NAMES[0])
  const [search, setSearch] = useState()
  const isAllow = (key) => hasAccessTo(permission, MODULES.COURSE_ANALYTICS, key)
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [list, seList] = useState([])
  const [paginate, setPaginate] = useState({})
  const getChartData = async () => {
    const payload = {
      query: {
        searchColumns: ["courses.nm"],
        search,
      },
      filter: {
        startDate: dateDisplay(filter?.dateRange?.[0], DATE_FORMAT),
        endDate: dateDisplay(filter?.dateRange?.[1], DATE_FORMAT),
        categories: filter?.categories || undefined,
        instructorId: user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : filter?.instructorId || undefined,
      },
      dateFormat: TYPE_FORMATS[type],
    }
    try {
      setLoading(true)
      await commonApi({ action: "add", module: "analytics/course-wise-report", common: true, data: payload }).then(
        ([, { data = {} }]) => {
          setReportData(data || {})
          return false
        }
      )
    } finally {
      setLoading(false)
    }
  }
  const getList = async (page = 1, limit = DEFAULT_LIMIT) => {
    const payload = {
      options: {
        page,
        limit,
      },
      query: {
        searchColumns: ["courseNm"],
        search,
      },
      filter: {
        startDate: dateDisplay(filter?.dateRange?.[0], DATE_FORMAT),
        endDate: dateDisplay(filter?.dateRange?.[1], DATE_FORMAT),
        categories: filter?.categories || undefined,
        instructorId: user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : filter?.instructorId || undefined,
      },
    }
    try {
      setLoading2(true)
      await commonApi({ action: "add", module: "analytics/course-wise-list", common: true, data: payload }).then(
        ([, { data = {} }]) => {
          const { data: rows, paginator, ...otherParameters } = data
          setPaginate({ ...paginator })
          const newList =
            rows?.map((a, index) => ({
              ...a,
              no: (paginator.currentPage - 1) * paginator.perPage + index + 1,
            })) || []
          seList(
            rows?.length > 0
              ? [
                  {
                    purchasedCourses: (
                      <div>
                        <div>Total Sales</div>
                        <div className="text-lg font-bold">{otherParameters.totalPurchased}</div>
                      </div>
                    ),
                    courseTotalPrice: (
                      <div>
                        <div>Revenue</div>
                        <div className="text-lg font-bold">₹ {otherParameters.totalprice}</div>
                      </div>
                    ),
                    avgStarts: "NO",
                  },
                  ...newList,
                ]
              : []
          )
          return false
        }
      )
    } finally {
      setLoading2(false)
    }
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GET_REPORT)) getChartData()
  }, [search, type, filter])
  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) getList(1, paginate?.perPage)
  }, [search, filter])
  const applyFilter = (data) => {
    setFilter(data)
    setOpen(false)
  }
  const clearFilter = () => {
    setFilter(DEFAULT_FILTER)
  }
  const onPaginationChange = (offset, limit) => {
    getList(offset / limit + 1, limit)
  }
  const exportList = () => {
    const payload = {
      startDate: dateDisplay(filter?.dateRange?.[0], DATE_FORMAT),
      endDate: dateDisplay(filter?.dateRange?.[1], DATE_FORMAT),
      categories: filter?.categories?.toString(),
      instructorId: user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : filter?.instructorId || undefined,
      searchColumns: "courseNm",
      search,
    }
    window.open(
      `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/admin/analytics/export-course-report?${qs.stringify(payload)}`,
      "_blank"
    )
  }
  return {
    open,
    setOpen,
    loading,
    isAllow,
    reportData,
    TYPE_NAMES,
    type,
    setType,
    filter,
    applyFilter,
    clearFilter,
    search,
    setSearch,
    list,
    paginate,
    onPaginationChange,
    exportList,
    loading2,
  }
}

export default useAnalytics
