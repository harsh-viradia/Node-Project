/* eslint-disable react/jsx-filename-extension */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import getConfig from "next/config"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"
import { dateDisplay } from "utils/util"

const { publicRuntimeConfig } = getConfig()
const startOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}
const DEFAULT_FILTER = { dateRange: [startOfMonth(), new Date()] }
const DATE_FORMAT = "YYYY-MM-DD"
const useAnalytics = ({ permission }) => {
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [reportData, setReportData] = useState()
  const [search, setSearch] = useState()
  const isAllow = (key) => hasAccessTo(permission, MODULES.CATEGORY_ANALYTICS, key)
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [list, seList] = useState([])
  const [paginate, setPaginate] = useState({})
  const getChartData = async () => {
    const payload = {
      options: {},
      query: {
        searchColumns: ["_id"],
        search,
      },
      filter: {
        startDate: dateDisplay(filter?.dateRange?.[0], DATE_FORMAT),
        endDate: dateDisplay(filter?.dateRange?.[1], DATE_FORMAT),
      },
    }
    try {
      setLoading(true)
      await commonApi({ action: "add", module: "analytics/category-wise-report", common: true, data: payload }).then(
        ([, { data = {} }]) => {
          setReportData(data || [])
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
        searchColumns: ["_id"],
        search,
      },
      filter: {
        startDate: dateDisplay(filter?.dateRange?.[0], DATE_FORMAT),
        endDate: dateDisplay(filter?.dateRange?.[1], DATE_FORMAT),
      },
    }
    try {
      setLoading2(true)
      await commonApi({ action: "add", module: "analytics/category-wise-list", common: true, data: payload }).then(
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
                    totalSales: (
                      <div>
                        <div>Total Sales</div>
                        <div className="text-lg font-bold">{otherParameters.totalPurchased}</div>
                      </div>
                    ),
                    revenue: (
                      <div>
                        <div>Revenue</div>
                        <div className="text-lg font-bold">₹ {otherParameters.totalRevenue}</div>
                      </div>
                    ),
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
    if (isAllow(MODULE_ACTIONS.GETALL)) getList(1, paginate?.perPage)
  }, [search, filter])
  const applyFilter = (data) => {
    setFilter(data)
  }
  const onPaginationChange = (offset, limit) => {
    getList(offset / limit + 1, limit)
  }
  const exportList = () => {
    const payload = {
      startDate: dateDisplay(filter?.dateRange?.[0], DATE_FORMAT),
      endDate: dateDisplay(filter?.dateRange?.[1], DATE_FORMAT),
      categories: filter?.categories?.toString(),
      searchColumns: "courseNm",
      search,
    }
    window.open(
      `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/admin/analytics/export-category-report?${qs.stringify(payload)}`,
      "_blank"
    )
  }
  return {
    loading,
    isAllow,
    reportData,
    filter,
    applyFilter,
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
