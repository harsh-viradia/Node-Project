/* eslint-disable sonarjs/no-duplicate-string */
import Table from "hook/table/useTable"
import React, { useRef, useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import FilterButton from "widgets/filterButton"
import OrbitLoader from "widgets/loader"
// import Button from "widgets/button"
import SearchInput from "widgets/searchInput"

import CourseAnalyticsColumn from "./columns"
import CourseAnalyticsChart from "./courseAnalyticsChart"
import AnalyticsFilter from "./filter"
import useAnalytics from "./hooks/useAnalytics"

const AnalyticsIndex = ({ permission = {}, user = {} }) => {
  const {
    open,
    setOpen,
    loading,
    isAllow,
    TYPE_NAMES,
    type,
    setType,
    filter = {},
    applyFilter,
    clearFilter,
    search,
    setSearch,
    reportData,
    list = [],
    paginate,
    onPaginationChange,
    exportList,
    loading2,
  } = useAnalytics({ permission, user })
  const childReference = useRef()
  const [value, setValue] = useState(search)

  const { onSearch } = useSearch({
    setSearchValue: setSearch,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Analytics"
      headerDetail={
        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search Course Name"
            className="w-60"
            value={value}
            onChange={(e) => onSearch(e.target.value || "")}
          />
          {isAllow(MODULE_ACTIONS.EXPORT) && (
            <Button title="Export" onClick={exportList} disabled={list?.length === 0} />
          )}
          <FilterButton
            onClick={() => setOpen(true)}
            removeFilter={async () => {
              await clearFilter()
              await childReference.current.resetValues()
            }}
            filterCount={Object.keys(filter)?.length}
          />
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GET_REPORT) && (
        <div className="relative p-4 mb-3 bg-white border rounded-lg border-light-gray">
          {loading && <OrbitLoader relative />}
          <div className="flex justify-end gap-2">
            {TYPE_NAMES.map((a) => {
              return <Button title={a} kind={type === a ? undefined : "foreground"} onClick={() => setType(a)} />
            })}
          </div>
          <CourseAnalyticsChart reportData={reportData} />
        </div>
      )}
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <div className="pb-3">
          <Table
            columns={CourseAnalyticsColumn({ paginate, user }).columns}
            data={list}
            loading={loading2}
            onPaginationChange={onPaginationChange}
            page={paginate.currentPage}
            totalPages={paginate.pageCount}
            limit={paginate.perPage}
            itemCount={paginate.itemCount}
            currentPageCount={list.length > 0 ? list.length - 1 : 0}
            tableHeight="analytics-table"
          />
        </div>
      )}
      <AnalyticsFilter
        permission={permission}
        ref={childReference}
        filter={filter}
        applyFilter={applyFilter}
        open={open}
        setOpen={setOpen}
        user={user}
      />
    </LayoutWrapper>
  )
}

export default AnalyticsIndex
