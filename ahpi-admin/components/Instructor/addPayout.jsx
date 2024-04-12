/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable sonarjs/no-duplicate-string */
import { hasAccessOf } from "@knovator/can"
import useEarnings from "components/Instructor/hook/useEarnings"
import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import LeftArrowIcon from "icons/leftArrowIcon"
import { useRouter } from "next/router"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import DateRangeInput from "widgets/dateRangeInput"
import FilterButton from "widgets/filterButton"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"
import OrbitLink from "widgets/orbitLink"
import SearchInput from "widgets/searchInput"

import CreatePayout from "./CreatePayout"
import EarningColumn from "./earningColumns"
import FilterPayout from "./FilterPayout"
import usePayout from "./hook/usePayout"
import PayoutColumn from "./payoutColumn"

const AddPayout = ({ user, permission }) => {
  const router = useRouter()
  const selectedUserId = router.query.payUser
  const { isAllow, ...dt } = useEarnings({ user, permission, selectedUserId, isFromAdmin: true })

  const {
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
    // eslint-disable-next-line no-unused-vars
    setFilterCount,
    removeFilter,
    status,
    setStatus,
    dateRange,
    setDateRange,
    setMonthYrRange,
    monthYrRange,
    payoutType,
    setPayoutType,
    applyFilter,
    loading,
    list,
    // eslint-disable-next-line no-unused-vars
    getList,
    onPaginationChange,
    paginate,
  } = usePayout({ user, permission, selectedUserId })

  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState(searchValue)

  const { onSearch } = useSearch({
    setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      topDetail={
        (hasAccessOf(permission, MODULES.MY_EARNING) || hasAccessOf(permission, MODULES.PAYOUT)) && (
          <div className="static top-0 px-4 py-2.5 bg-white shadow-sm gap-2">
            <div className="flex flex-wrap  gap-2 w-full justify-between">
              <div className="flex overflow-hidden rounded-lg">
                <h4 className="flex items-center col-span-2 gap-2 font-bold mr-6">
                  <OrbitLink onClick={() => router.back()}>
                    <LeftArrowIcon />
                  </OrbitLink>
                  <p className="self-center">{router.query.userName || ""}</p>
                </h4>
                <button
                  type="button"
                  value="Instructor-earning"
                  className={`px-3 py-2 font-medium text-sm border-b ${
                    // eslint-disable-next-line sonarjs/no-duplicate-string
                    view === "Instructor-earning" ? "text-primary border-primary" : "text-foreground"
                  } `}
                  onClick={() => {
                    setView("Instructor-earning")
                    dt.getList({
                      options: {
                        offset: paginate?.offset,
                        limit: paginate?.perPage || DEFAULT_LIMIT,
                      },
                    })
                  }}
                >
                  Earnings
                </button>
                <button
                  type="button"
                  value="Instructor-payout"
                  className={`px-3 py-2 font-medium text-sm border-b ${
                    view === "Instructor-payout" ? "text-primary border-primary" : "text-foreground"
                  } `}
                  onClick={() => setView("Instructor-payout")}
                >
                  Payout
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {view === "Instructor-earning" && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-end gap-4">
                      <div className="w-60">
                        <FilterSelectDropdown
                          action="add" // action - list
                          module="courses"
                          placeholder="Select Course"
                          onChange={(opt) => {
                            dt?.applyFilter({ ...dt?.filter, courseIds: opt })
                          }}
                          value={dt?.filter?.courseIds}
                          isClearable
                          labelColumn="title"
                          extraParam={{ filter: { userIds: [router.query.payUser] } }}
                          searchColumns={["title"]}
                        />
                      </div>
                      <div className="w-60">
                        <DateRangeInput
                          startDate={dt?.filter?.dateRange?.[0]}
                          endDate={dt?.filter?.dateRange?.[1]}
                          // eslint-disable-next-line no-shadow
                          setDateRange={(value) => {
                            dt?.applyFilter({ ...dt?.filter, dateRange: value })
                          }}
                          isClear={false}
                          format="MM/YYYY"
                          selectMonth
                          className="right-0"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {view === "Instructor-payout" && (
                  <>
                    {isPayoutAllow(MODULE_ACTIONS.LIST) && (
                      <SearchInput
                        placeholder="Search Transaction Type"
                        onChange={(e) => onSearch(e.target.value || "")}
                      />
                    )}
                    {isPayoutAllow(MODULE_ACTIONS.CREATE) && (
                      <Button
                        className="h-9"
                        title="Add Payout"
                        icon={<AddIcon size="12px" />}
                        onClick={() => setOpen(true)}
                      />
                    )}
                    {isPayoutAllow(MODULE_ACTIONS.LIST) && (
                      <FilterButton
                        onClick={() => setOpenFilter(true)}
                        filterCount={filterCount}
                        removeFilter={removeFilter}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )
      }
    >
      {view === "Instructor-earning" && (
        <Table
          tableHeight={false}
          columns={EarningColumn({ dt }).columns}
          data={dt.list}
          loading={dt.loading}
          page={dt.currentPage || 1}
          totalPages={dt.pageCount}
          limit={dt.perPage}
          onPaginationChange={dt.onPaginationChange}
          itemCount={dt.itemCount}
          currentPageCount={dt.list?.length}
        />
      )}

      {view === "Instructor-payout" && (
        <>
          {isPayoutAllow(MODULE_ACTIONS.LIST) && (
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
          )}
          <CreatePayout
            open={open}
            setOpen={setOpen}
            payoutUserId={selectedUserId}
            getList={getList}
            paginate={paginate}
          />
          <FilterPayout
            open={openFilter}
            setOpen={setOpenFilter}
            setOpenFilter={setOpenFilter}
            applyFilter={applyFilter}
            status={status}
            setStatus={setStatus}
            monthYrRange={monthYrRange}
            setMonthYrRange={setMonthYrRange}
            dateRange={dateRange}
            setDateRange={setDateRange}
            payoutType={payoutType}
            setPayoutType={setPayoutType}
          />
        </>
      )}
    </LayoutWrapper>
  )
}

export default AddPayout
