import Table from "hook/table/useTable"
import React, { useRef, useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import FilterButton from "widgets/filterButton"
import SearchInput from "widgets/searchInput"

import learnerColumn from "./columns"
import FilterStudents from "./FilterStudents"
import useLearner from "./hooks/useLearner"

const Learner = ({ title = "Learner", permission = {}, user = {} }) => {
  const childRef = useRef()
  const {
    loading,
    getList,
    isAllow,
    openFilter,
    setOpenFilter,
    filter,
    setFilter,
    handleApplyFilter,
    onClickClearFilter,
    stateOptions,
    cityOptions,
    getAllStates,
    getAllCities,
    ...other
  } = useLearner({ permission })
  const [value, setValue] = useState(other.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other.setSearchValue,
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
              placeholder="Search Learner"
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <FilterButton
              onClick={() => setOpenFilter(true)}
              removeFilter={() => {
                childRef.current.resetValues()
                onClickClearFilter()
              }}
              filterCount={filter ? Object.entries(filter).length : undefined}
            />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            learnerColumn({
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
      <FilterStudents
        ref={childRef}
        open={openFilter}
        setOpen={setOpenFilter}
        permission={permission}
        cityOptions={cityOptions}
        stateOptions={stateOptions}
        handleApplyFilter={handleApplyFilter}
        getAllStates={getAllStates}
        getAllCities={getAllCities}
      />
    </LayoutWrapper>
  )
}

export default Learner
