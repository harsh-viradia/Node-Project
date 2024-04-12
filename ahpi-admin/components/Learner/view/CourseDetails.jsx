import Table from "hook/table/useTable"
import React, { useState } from "react"
import useSearch from "utils/useSearch"
import SearchInput from "widgets/searchInput"

import useViewStudents from "../hooks/useViewStudents"
import courseDetailColumn from "./courseDetailColumn"

const CourseDetails = ({ original }) => {
  const { loading, getList, isAllow, ...other } = useViewStudents({ original })
  const [value, setValue] = useState(other.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other.setSearchValue,
    setValue,
  })

  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="ml-auto w-72">
        <SearchInput
          placeholder="Search..."
          className="w-60"
          value={value}
          onChange={(e) => onSearch(e.target.value || "")}
        />
      </div>
      <Table
        tableHeight="courseDetailTable"
        columns={
          courseDetailColumn({
            getList,
            isAllow,
            other,
            // permission,
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
    </div>
  )
}

export default CourseDetails
