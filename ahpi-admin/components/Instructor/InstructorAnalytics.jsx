import React, { useRef } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS, SYSTEM_USERS } from "utils/constant"
import DateRangeInput from "widgets/dateRangeInput"
import FilterButton from "widgets/filterButton"
import OrbitLoader from "widgets/loader"

import AnalyticsChart from "./analyticsChart"
import AnalyticsFilter from "./filter"
import useAnalytics from "./hook/useAnalytics"

const InstructorAnalytics = ({ permission = {}, user = {} }) => {
  const {
    open,
    setOpen,
    loading,
    filter = {},
    applyFilter,
    clearFilter,
    reportData,
    ratingReportData,
    isAllow,
  } = useAnalytics({
    permission,
  })
  const childReference = useRef()
  return (
    <LayoutWrapper
      headerDetail={
        <div className="flex items-center gap-3">
          <DateRangeInput
            startDate={filter?.dateRange?.[0]}
            endDate={filter?.dateRange?.[1]}
            setDateRange={(value) => {
              applyFilter({ ...filter, dateRange: value })
            }}
            isClear={false}
          />
          <FilterButton
            onClick={() => setOpen(true)}
            removeFilter={async () => {
              await clearFilter()
              await childReference.current.resetValues()
            }}
            filterCount={(Object.keys(filter)?.length || 1) - 1}
          />
        </div>
      }
      permission={permission}
      user={user}
      title={user?.role === SYSTEM_USERS.INSTRUCTOR ? "My Analytics" : "Partner Analytics"}
    >
      {loading && <OrbitLoader relative />}
      <div className="p-4 mb-3 bg-white border rounded-lg border-light-gray">
        {isAllow(MODULE_ACTIONS.SALES_ANALYTICS) && <AnalyticsChart reportData={reportData} title="Course Sales" />}
      </div>
      <div className="mt-4">
        {isAllow(MODULE_ACTIONS.RATING_ANALYTICS) && (
          <AnalyticsChart reportData={ratingReportData} title="Course Ratings" />
        )}
      </div>
      <AnalyticsFilter
        user={user}
        ref={childReference}
        filter={filter}
        applyFilter={applyFilter}
        open={open}
        setOpen={setOpen}
      />
    </LayoutWrapper>
  )
}

export default InstructorAnalytics
