import Table from "hook/table/useTable"
import React, { useRef, useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import FilterButton from "widgets/filterButton"
import SearchInput from "widgets/searchInput"

import InstructorColumn from "./columns"
import FilterReview from "./filterReview"
import useReview from "./hook/useReview"

const InstructorManageIndex = ({ permission = {}, user = {}, title = "Reviews" }) => {
  const { isAllow, ...other } = useReview({ permission })
  const childRef = useRef()
  const [value, setValue] = useState(other?.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other?.setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title={title}
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder={`Search ${title}`}
              className="w-64"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <FilterButton
              onClick={() => other?.setOpenFilter(true)}
              removeFilter={() => {
                childRef.current.resetValues()
                other?.onClickClearFilter()
              }}
              filterCount={other?.filter ? Object.entries(other?.filter).length : undefined}
            />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            InstructorColumn({
              permission,
              isAllow,
              ...other,
            }).columns
          }
          data={other?.list}
          loading={other?.loading}
          page={other?.currentPage || 1}
          totalPages={other?.pageCount || 1}
          limit={other?.perPage}
          onPaginationChange={other?.onPaginationChange}
          itemCount={other?.itemCount}
          currentPageCount={other?.list.length}
        />
      )}
      <FilterReview
        ref={childRef}
        handleApplyFilter={other?.handleApplyFilter}
        open={other?.openFilter}
        setOpen={other?.setOpenFilter}
        selectedCourse={other?.selectedCourse}
        setSelectedCourse={other?.setSelectedCourse}
        rating={other?.rating}
        setRating={other?.setRating}
      />
    </LayoutWrapper>
  )
}

export default InstructorManageIndex
