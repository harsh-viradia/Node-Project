/* eslint-disable unicorn/prevent-abbreviations */
// import Table from "hook/table/useTable"
import Table from "hook/table/useTable"
import React, { useRef, useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import FilterButton from "widgets/filterButton"
import SearchInput from "widgets/searchInput"

import transactionsColumn from "./columns"
import FilterTransactions from "./FilterTransactions"
import useTransaction from "./hook/useTransactions"

const TransactionsIndex = ({ permission = {}, user = {} }) => {
  const {
    isAllow,
    getList,
    loading,
    openFilter,
    setOpenFilter,
    filter,
    onClickClearFilter,
    handleApplyFilter,
    ...other
  } = useTransaction({ permission })
  // eslint-disable-next-line no-unused-vars
  const childRef = useRef()
  const [value, setValue] = useState(other?.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other?.setSearchValue,
    setValue,
  })

  const filterCount = () => {
    if (filter) {
      if (filter.startDate || filter.endDate) {
        return Object.entries(filter).length - 1
      }
      return Object.entries(filter).length
    }
    return false
  }

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Transactions"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search Transactions"
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.EXPORT) && (
            <Button title="Export" onClick={other.exportOrder} disabled={other?.list?.length === 0} />
          )}

          {isAllow(MODULE_ACTIONS.GETALL) && (
            <FilterButton
              onClick={() => setOpenFilter(true)}
              removeFilter={() => {
                childRef.current.resetValues()
                onClickClearFilter()
              }}
              filterCount={filterCount()}
            />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            transactionsColumn({
              getList,
              ...other,
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
      <FilterTransactions
        ref={childRef}
        handleApplyFilter={handleApplyFilter}
        open={openFilter}
        setOpen={setOpenFilter}
      />
    </LayoutWrapper>
  )
}

export default TransactionsIndex
