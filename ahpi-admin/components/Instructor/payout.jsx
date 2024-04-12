/* eslint-disable no-unused-vars */
import Table from "hook/table/useTable"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import FilterButton from "widgets/filterButton"
import SearchInput from "widgets/searchInput"

import FilterPayout from "./FilterPayout"
import usePayout from "./hook/usePayout"
import PayoutColumn from "./payoutColumn"

const Payout = ({ user, permission, title = "Payout" }) => {
  const {
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
    onPaginationChange,
    paginate,
  } = usePayout({ user, permission, isAccessInstructorPan: true })

  const [value, setValue] = useState(searchValue)

  const { onSearch } = useSearch({
    setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title={title}
      headerDetail={
        <div className="flex items-center gap-3">
          {isPayoutAllow(MODULE_ACTIONS.LIST) && (
            <SearchInput placeholder="Search Transaction Type" onChange={(e) => onSearch(e.target.value || "")} />
          )}
          {isPayoutAllow(MODULE_ACTIONS.LIST) && (
            <FilterButton onClick={() => setOpenFilter(true)} filterCount={filterCount} removeFilter={removeFilter} />
          )}
        </div>
      }
    >
      {isPayoutAllow(MODULE_ACTIONS.LIST) && (
        <>
          <div className="mt-4">
            <Table
              columns={PayoutColumn({ list, paginate }).columns}
              data={list}
              loading={loading}
              onPaginationChange={onPaginationChange}
              page={paginate.currentPage}
              totalPages={paginate.pageCount}
              limit={paginate.perPage}
              itemCount={paginate.itemCount}
              currentPageCount={list.length}
            />
          </div>
          <FilterPayout
            open={openFilter}
            setOpen={setOpenFilter}
            setOpenFilter={setOpenFilter}
            applyFilter={applyFilter}
            status={status}
            setStatus={setStatus}
            dateRange={dateRange}
            setDateRange={setDateRange}
            monthYrRange={monthYrRange}
            setMonthYrRange={setMonthYrRange}
            payoutType={payoutType}
            setPayoutType={setPayoutType}
          />
        </>
      )}
    </LayoutWrapper>
  )
}

export default Payout
