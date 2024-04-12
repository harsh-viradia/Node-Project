/* eslint-disable react/jsx-filename-extension */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import { useEffect, useState } from "react"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import { dateDisplay } from "utils/util"

const startOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}
const DEFAULT_FILTER = { dateRange: [startOfMonth(), new Date()] }
const DATE_FORMAT = "YYYY-MM-DD"
const useAnalytics = ({ permission }) => {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState()
  const isAllow = (key) => hasAccessTo(permission, MODULES.INSTRUCTOR_ANALYTICS, key)
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [open, setOpen] = useState(false)
  const [ratingReportData, setRatingReportData] = useState()
  const getChartData = async () => {
    const payload = {
      options: {},
      query: {
        fromDate: dateDisplay(filter?.dateRange?.[0], DATE_FORMAT),
        toDate: dateDisplay(filter?.dateRange?.[1], DATE_FORMAT),
        instructorIds: filter?.instructorIds || undefined,
        courseIds: filter?.courseIds || undefined,
      },
    }
    try {
      setLoading(true)
      if (isAllow(MODULE_ACTIONS.SALES_ANALYTICS))
        await commonApi({
          action: "salesAnalytics",
          data: payload,
        }).then(([, { data = {} }]) => {
          setReportData(data || [])
          return false
        })
      if (isAllow(MODULE_ACTIONS.RATING_ANALYTICS))
        await commonApi({
          action: "ratingsAnalytics",
          data: payload,
        }).then(([, { data = {} }]) => {
          setRatingReportData(data || [])
          return false
        })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getChartData()
  }, [filter])
  const applyFilter = (data) => {
    setFilter(data)
    setOpen(false)
  }
  const clearFilter = () => {
    setFilter(DEFAULT_FILTER)
  }
  return {
    loading,
    isAllow,
    reportData,
    filter,
    applyFilter,
    open,
    clearFilter,
    setOpen,
    ratingReportData,
  }
}

export default useAnalytics
