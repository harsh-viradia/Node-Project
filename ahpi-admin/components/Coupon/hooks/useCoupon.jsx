/* eslint-disable sonarjs/cognitive-complexity */
import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { COUPON_DATE_FORMAT, DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"
import { dateDisplay } from "utils/util"

const useCoupon = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)
  const [openFilter, setOpenFilter] = useState(false)
  const [filterCount, setFilterCount] = useState()
  const [dateRange, setDateRange] = useState()
  const [dateRange2, setDateRange2] = useState()
  const [dateRange3, setDateRange3] = useState()
  const [dateRange4, setDateRange4] = useState()
  const [criteriaFilter, setCriteriaFilter] = useState()
  const [criteriaFilter2, setCriteriaFilter2] = useState()
  const [courseFilter, setCourseFilter] = useState()
  const [courseFilter2, setCourseFilter2] = useState()
  const [categoryFilter, setCategoryFilter] = useState()
  const [categoryFilter2, setCategoryFilter2] = useState()
  const isAllow = (key) => hasAccessTo(permission, MODULES.COUPON, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    action: "add",
    module: "coupon",
    populate: ["typeId", "criteriaId", "users", "buyCourses", "getCourses", "buyCategories", "getCategories"],
    fixedQuery: {
      searchColumns: ["name", "code"],
      search: searchValue,
      expireDate: dateRange
        ? {
            $gte: dateDisplay(dateRange[0], COUPON_DATE_FORMAT),
            $lte: dateDisplay(dateRange[1], COUPON_DATE_FORMAT),
          }
        : undefined,
      appliedDate: dateRange3
        ? {
            $gte: dateDisplay(dateRange3[0], COUPON_DATE_FORMAT),
            $lte: dateDisplay(dateRange3[1], COUPON_DATE_FORMAT),
          }
        : undefined,
      criteriaId: criteriaFilter?.value || undefined,
      buyCourses: courseFilter?.length ? { $in: courseFilter?.map((item) => item.value) } : undefined,
      buyCategories: categoryFilter?.length ? { $in: categoryFilter?.map((item) => item.value) } : undefined,
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

  const applyFilter = async () => {
    await getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
    })
    await setFilterCount(
      (dateRange ? 1 : 0) +
        (dateRange3 ? 1 : 0) +
        (criteriaFilter?.label ? 1 : 0) +
        (courseFilter?.length ? 1 : 0) +
        (categoryFilter?.length ? 1 : 0)
    )
    await setDateRange2(dateRange)
    await setDateRange4(dateRange3)
    await setCriteriaFilter2(criteriaFilter)
    await setCourseFilter2(courseFilter)
    await setCategoryFilter2(categoryFilter)
    setOpenFilter(false)
  }

  const removeFilter = async () => {
    await setDateRange()
    await setDateRange2()
    await setDateRange3()
    await setDateRange4()
    await setCriteriaFilter()
    await setCriteriaFilter2()
    await setCourseFilter()
    await setCourseFilter2()
    await setCategoryFilter()
    await setCategoryFilter2()
    await setFilterCount()
    getList({
      query: {
        searchColumns: ["batchNm"],
        search: searchValue,
        expireDate: undefined,
        appliedDate: undefined,
        criteriaId: undefined,
        buyCourses: undefined,
        buyCategories: undefined,
      },
    })
  }

  useEffect(() => {
    if (filterCount) {
      setDateRange(dateRange2)
      setDateRange3(dateRange4)
      setCriteriaFilter(criteriaFilter2)
      setCourseFilter(courseFilter2)
      setCategoryFilter(categoryFilter2)
    } else {
      setDateRange()
      setDateRange3()
      setCriteriaFilter()
      setCourseFilter()
      setCategoryFilter()
      setFilterCount()
    }
  }, [openFilter])

  return {
    ...paginate,
    loading,
    list,
    open,
    dateRange,
    dateRange3,
    openFilter,
    filterCount,
    criteriaFilter,
    courseFilter,
    categoryFilter,
    setOpenFilter,
    getList,
    setOpen,
    isAllow,
    setSearchValue,
    onPaginationChange,
    setDateRange,
    setDateRange3,
    setCriteriaFilter,
    setCourseFilter,
    setCategoryFilter,
    applyFilter,
    removeFilter,
  }
}

export default useCoupon
