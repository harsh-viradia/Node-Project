/* eslint-disable react/jsx-filename-extension */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import dayjs from "dayjs"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"
import { dateDisplay } from "utils/util"

const lastYear = (date = new Date()) => {
  return new Date(date.getFullYear() - 1, date.getMonth(), 1)
}
const DEFAULT_FILTER = { dateRange: [lastYear(), new Date().setDate(dayjs().daysInMonth())] }
const DATE_FORMAT = "MM YYYY"
const useEarnings = ({ permission, user, selectedUserId, isFromAdmin }) => {
  const [reportData, setReportData] = useState()
  const isAllow = (key) => hasAccessTo(permission, MODULES.MY_EARNING, key)
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [open, setOpen] = useState(false)
  const [earningData, setEarningData] = useState()

  const getChartData = async () => {
    const payload = {
      options: {},
      query: {
        fromDate: dateDisplay(filter?.dateRange?.[0], DATE_FORMAT),
        toDate: dateDisplay(filter?.dateRange?.[1], DATE_FORMAT),
        instructorIds: isFromAdmin ? [selectedUserId] : [user?.id],
        courseIds: filter?.courseIds?.value ? [filter?.courseIds?.value] : undefined,
      },
    }
    await commonApi({
      action: "earnings",
      parameters: ["analytics"],
      data: payload,
    }).then(([, { data }]) => {
      setReportData(data?.data || [])
      return false
    })
  }
  const getEarningData = async () => {
    await commonApi({
      action: "earningsIncome",
    }).then(([, { data }]) => {
      setEarningData(data || [])
      return false
    })
  }
  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    action: "earnings",
    common: false,
    parameters: ["list"],
    fixedQuery: {
      fromDate: dateDisplay(filter?.dateRange?.[0], DATE_FORMAT),
      toDate: dateDisplay(filter?.dateRange?.[1], DATE_FORMAT),
      instructorIds: isFromAdmin ? [selectedUserId] : [user?.id],
      courseIds: filter?.courseIds?.value ? [filter?.courseIds?.value] : undefined,
    },
  })
  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.ANALYTICS)) getChartData()
    if (isAllow(MODULE_ACTIONS.LIST))
      getList({
        options: {
          offset: paginate?.offset,
          limit: paginate?.perPage || DEFAULT_LIMIT,
        },
      })
  }, [filter])
  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.INCOME)) getEarningData()
  }, [])
  const applyFilter = (data) => {
    setFilter(data)
    setOpen(false)
  }
  const clearFilter = () => {
    setFilter(DEFAULT_FILTER)
  }
  const onPaginationChange = (offset, limit) => {
    getList({
      options: {
        offset,
        limit,
      },
    })
  }
  return {
    loading,
    isAllow,
    getList,
    reportData,
    filter,
    applyFilter,
    open,
    clearFilter,
    setOpen,
    ...paginate,
    list,
    earningData,
    onPaginationChange,
  }
}

export default useEarnings
