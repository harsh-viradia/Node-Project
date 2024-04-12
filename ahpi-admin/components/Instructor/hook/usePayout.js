/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { COUPON_DATE_FORMAT, DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"
import { dateDisplay } from "utils/util"

// eslint-disable-next-line sonarjs/cognitive-complexity
const usePayout = ({ user, permission, selectedUserId, isAccessInstructorPan }) => {
  const [view, setView] = useState("Instructor-earning")
  const [open, setOpen] = useState(false)

  const [searchValue, setSearchValue] = useState("")

  const [openFilter, setOpenFilter] = useState(false)
  const [filterCount, setFilterCount] = useState()
  const [status, setStatus] = useState()
  const [dateRange, setDateRange] = useState()
  const [monthYrRange, setMonthYrRange] = useState()
  const [payoutType, setPayoutType] = useState()

  const isPayoutAllow = (key) => hasAccessTo(permission, MODULES.PAYOUT, key)

  const DATE_FORMAT = "MM YYYY"
  const setFilter = () => {
    return {
      user: isAccessInstructorPan ? [user.id] : [selectedUserId],
      payoutType: payoutType?.length > 0 ? payoutType.map((a) => a.value) : undefined,
      startDate: dateRange?.[0] ? dateDisplay(dateRange?.[0], COUPON_DATE_FORMAT) : undefined,
      endDate: dateRange?.[1] ? dateDisplay(dateRange?.[1], COUPON_DATE_FORMAT) : undefined,
      fromDate: monthYrRange?.[0] ? dateDisplay(monthYrRange?.[0], DATE_FORMAT) : undefined,
      toDate: monthYrRange?.[1] ? dateDisplay(monthYrRange?.[1], DATE_FORMAT) : undefined,
      status: status?.value || undefined,
    }
  }
  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    module: "payout",
    fixedQuery: {
      searchColumns: ["trnsType"],
      search: searchValue,
      filter: {
        user: isAccessInstructorPan ? [user.id] : [selectedUserId],
      },
    },
    populate: [
      {
        path: "user createdBy currency",
        select: "name",
      },
    ],
    mount: isPayoutAllow(MODULE_ACTIONS.LIST),
  })

  const applyFilter = async () => {
    await setFilterCount(
      (status?.value ? 1 : 0) + (dateRange?.[0] ? 1 : 0) + (monthYrRange?.[0] ? 1 : 0) + (payoutType?.length ? 1 : 0)
    )
    setOpenFilter(false)
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        filter: setFilter(),
      },
    })
  }

  const removeFilter = async () => {
    await setStatus()
    await setDateRange()
    await setMonthYrRange()
    await setPayoutType()
    await setFilterCount()
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        filter: {
          user: isAccessInstructorPan ? [user.id] : [selectedUserId],
        },
      },
    })
  }

  const onPaginationChange = (offset, limit) => {
    return getList({
      options: {
        offset,
        limit,
      },
      query: {
        filter: setFilter(),
      },
    })
  }

  useEffect(() => {
    if (isPayoutAllow(MODULE_ACTIONS.LIST)) {
      getList({
        options: {
          offset: 0,
          limit: paginate?.perPage || DEFAULT_LIMIT,
        },
        query: {
          filter: setFilter(),
        },
      })
    }
  }, [searchValue])

  return {
    view,
    setView,
    open,
    setOpen,
    searchValue,
    setSearchValue,
    isPayoutAllow,
    openFilter,
    setOpenFilter,
    filterCount,
    setFilterCount,
    removeFilter,
    status,
    setStatus,
    dateRange,
    setDateRange,
    monthYrRange,
    setMonthYrRange,
    payoutType,
    setPayoutType,
    applyFilter,
    loading,
    list,
    getList,
    onPaginationChange,
    paginate,
  }
}

export default usePayout
