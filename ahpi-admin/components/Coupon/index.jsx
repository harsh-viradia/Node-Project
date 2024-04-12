// import Table from "hook/table/useTable"
import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import FilterButton from "widgets/filterButton"
import SearchInput from "widgets/searchInput"

import AddCouponForm from "./AddCouponForm"
import couponColumn from "./columns"
import FilterCoupon from "./FilterCoupon"
import useCoupon from "./hooks/useCoupon"

const CouponIndex = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState(false)
  const {
    loading,
    dateRange,
    dateRange3,
    openFilter,
    criteriaFilter,
    courseFilter,
    categoryFilter,
    filterCount,
    setOpenFilter,
    getList,
    isAllow,
    setDateRange,
    setDateRange3,
    setCriteriaFilter,
    setCourseFilter,
    setCategoryFilter,
    applyFilter,
    removeFilter,
    ...other
  } = useCoupon({
    permission,
  })

  const [value, setValue] = useState(other.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other.setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Coupons"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search Coupon"
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.CREATE) && (
            <Button title="Add" icon={<AddIcon size="10" />} onClick={() => setOpen(true)} />
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <FilterButton onClick={() => setOpenFilter(true)} filterCount={filterCount} removeFilter={removeFilter} />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            couponColumn({
              getList,
              isAllow,
              other,
              permission,
            }).columns
          }
          data={other.list}
          loading={loading}
          onPaginationChange={other.onPaginationChange}
          page={other.currentPage}
          totalPages={other.pageCount}
          limit={other.perPage}
          itemCount={other.itemCount}
          currentPageCount={other.list.length}
        />
      )}
      <AddCouponForm open={open} setOpen={setOpen} permission={permission} getList={getList} />
      <FilterCoupon
        open={openFilter}
        loading={loading}
        dateRange={dateRange}
        dateRange3={dateRange3}
        criteriaFilter={criteriaFilter}
        courseFilter={courseFilter}
        categoryFilter={categoryFilter}
        setOpen={setOpenFilter}
        setDateRange={setDateRange}
        setDateRange3={setDateRange3}
        setCriteriaFilter={setCriteriaFilter}
        setCourseFilter={setCourseFilter}
        setCategoryFilter={setCategoryFilter}
        applyFilter={applyFilter}
      />
    </LayoutWrapper>
  )
}

export default CouponIndex
