import Table from "hook/table/useTable"
import FilterIcon from "icons/filterIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import SearchInput from "widgets/searchInput"

import documentColumn from "./columns"
import FilterStudent from "./FilterStudent"
import useDocument from "./hooks/useDocument"

const DocumentVerification = ({ permission = {}, user = {} }) => {
  const {
    getList,
    loading,
    isAllow,
    setOpenFilter,
    openFilter,
    courseOptions,
    getAllCourses,
    setCourseFilter,
    applyFilter,
    ...other
  } = useDocument({ permission })
  const [value, setValue] = useState(other.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other.setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Document Verification"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search..."
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <Button
              onClick={() => setOpenFilter(true)}
              title="Filter"
              kind="dark-gray"
              hoverKind="white"
              icon={<FilterIcon />}
            />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            documentColumn({
              getList,
              isAllow,
              other,
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
      <FilterStudent
        setOpen={setOpenFilter}
        open={openFilter}
        courseOptions={courseOptions}
        loading={loading}
        getAllCourses={getAllCourses}
        setCourseFilter={setCourseFilter}
        applyFilter={applyFilter}
        permission={permission}
      />
    </LayoutWrapper>
  )
}

export default DocumentVerification
