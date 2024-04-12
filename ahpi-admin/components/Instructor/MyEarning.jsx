import Table from "hook/table/useTable"
import React from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import { decimalValue } from "utils/helper"
import DateRangeInput from "widgets/dateRangeInput"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"
import OrbitLoader from "widgets/loader"

import EarningColumn from "./earningColumns"
import useEarnings from "./hook/useEarnings"
import MonthlyEarningChart from "./MonthlyEarningChart"

const InstructorEarning = ({ permission = {}, user = {}, title = "My Earning" }) => {
  const { isAllow, ...dt } = useEarnings({
    permission,
    user,
  })

  return (
    <LayoutWrapper
      headerDetail={
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-end gap-4">
            <div className="w-60">
              <FilterSelectDropdown
                action="add" // action - list
                module="courses"
                placeholder="Search Course"
                onChange={(opt) => {
                  dt?.applyFilter({ ...dt?.filter, courseIds: opt })
                }}
                value={dt?.filter?.courseIds}
                isClearable
                labelColumn="title"
                searchColumns={["title"]}
              />
            </div>
            <div className="w-60">
              <DateRangeInput
                startDate={dt?.filter?.dateRange?.[0]}
                endDate={dt?.filter?.dateRange?.[1]}
                setDateRange={(value) => {
                  dt?.applyFilter({ ...dt?.filter, dateRange: value })
                }}
                isClear={false}
                format="MM/YYYY"
                selectMonth
              />
            </div>
          </div>
        </div>
      }
      permission={permission}
      user={user}
      title={title}
    >
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="2xl:px-16 xl:px-10 py-4 w-80 text-center">
            <img src="/images/income.png" className="h-10 mx-auto" alt="" />
            <p className="text-gray-500 mt-3">Net Income</p>
            <h3 className="font-semibold text-2xl mt-1 text-primary">
              {decimalValue(dt?.earningData?.[0]?.netIncome)} ₹
            </h3>
          </div>
          <div className="border-l border-gray-200 w-0.5 h-40" />
          <div className="2xl:px-16 xl:px-10 py-4 w-80 text-center">
            <img src="/images/withdraw.png" className="h-10 mx-auto" alt="" />
            <p className="text-gray-500 mt-3 ">Withdrawn</p>
            <h3 className="font-semibold text-2xl mt-1 text-primary">
              {decimalValue(dt?.earningData?.[0]?.creditedAmt)} ₹
            </h3>
          </div>
          <div className="border-l border-gray-200 w-0.5 h-40" />
          <div className="2xl:px-16 xl:px-10 py-4 w-80 text-center">
            <img src="/images/wall-clock.png" className="h-10 mx-auto" alt="" />
            <p className="text-gray-500 mt-3">Pending Clearance</p>
            <h3 className="font-semibold text-2xl mt-1 text-primary">
              {decimalValue(dt?.earningData?.[0]?.pendingClearance)} ₹
            </h3>
          </div>
        </div>
      </div>
      {isAllow(MODULE_ACTIONS.ANALYTICS) && (
        <div className="mt-4">
          {dt?.loading && <OrbitLoader relative />}
          <MonthlyEarningChart reportData={dt.reportData} />
        </div>
      )}
      <div className="mt-4">
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
          className="h-max-content min-h-[200px]"
        />
      </div>
    </LayoutWrapper>
  )
}

export default InstructorEarning
