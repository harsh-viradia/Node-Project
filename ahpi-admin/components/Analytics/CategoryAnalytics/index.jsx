/* eslint-disable sonarjs/no-duplicate-string */
import Table from "hook/table/useTable"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import DateRangeInput from "widgets/dateRangeInput"
import OrbitLoader from "widgets/loader"
// import Button from "widgets/button"
import SearchInput from "widgets/searchInput"

import CategoryAnalyticsChart from "./categoryAnalyticsChart"
import CategoryAnalyticsColumn from "./columns"
import useAnalytics from "./hooks/useAnalytics"

const AnalyticsIndex = ({ permission = {}, user = {} }) => {
  const {
    loading,
    isAllow,
    search,
    setSearch,
    reportData,
    list = [],
    paginate,
    onPaginationChange,
    applyFilter,
    exportList,
    filter,
    loading2,
  } = useAnalytics({
    permission,
  })
  const [value, setValue] = useState(search)

  const { onSearch } = useSearch({
    setSearchValue: setSearch,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Program Analytics"
      headerDetail={
        <div className="flex items-center gap-3">
          <DateRangeInput
            startDate={filter?.dateRange?.[0]}
            endDate={filter?.dateRange?.[1]}
            setDateRange={(date) => {
              applyFilter({ dateRange: date })
            }}
            isClear={false}
          />
          <SearchInput
            placeholder="Search Program"
            className="w-60"
            value={value}
            onChange={(e) => onSearch(e.target.value || "")}
          />
          {isAllow(MODULE_ACTIONS.EXPORT) && (
            <Button title="Export" onClick={exportList} disabled={list?.length === 0} />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GET_REPORT) && (
        <div className="relative p-4 mb-3 bg-white border rounded-lg border-light-gray">
          {loading && <OrbitLoader relative />}
          <CategoryAnalyticsChart reportData={reportData} />
        </div>
      )}
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <div className="pb-3">
          <Table
            columns={CategoryAnalyticsColumn({ paginate }).columns}
            data={list}
            loading={loading2}
            onPaginationChange={onPaginationChange}
            page={paginate.currentPage}
            totalPages={paginate.pageCount}
            limit={paginate.perPage}
            itemCount={paginate.itemCount}
            currentPageCount={list.length > 0 ? list.length - 1 : 0}
            className="h-max-content min-h-[200px]"
          />
        </div>
      )}
    </LayoutWrapper>
  )
}

export default AnalyticsIndex
