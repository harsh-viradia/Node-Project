import Table from "hook/table/useTable"
import React, { useRef, useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import FilterButton from "widgets/filterButton"
import SearchInput from "widgets/searchInput"

import orderColumn from "./columns"
import CourseNameModal from "./CourseNameModal"
import FilterOrders from "./FilterOrders"
import useOrder from "./hook/useOrderFilter"

const OrderManageIndex = ({ permission = {}, user = {} }) => {
  const childReference = useRef()
  const {
    loading,
    exportOrder,
    openFilter,
    setOpenFilter,
    searchValue,
    setSearchValue,
    filter,
    setFilter,
    handleApplyFilter,
    onClickClearFilter,
    isAllow,
    ...paginate
  } = useOrder({ permission })
  const [value, setValue] = useState(searchValue)
  const [open, setOpen] = useState()

  const { onSearch } = useSearch({
    setSearchValue,
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
      title="Orders"
      headerDetail={
        <div className="flex items-center gap-3 ">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search Order ID"
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.EXPORT) && (
            <Button title="Export" onClick={exportOrder} disabled={paginate?.list?.length === 0} />
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <FilterButton
              onClick={() => setOpenFilter(true)}
              removeFilter={() => {
                childReference.current.resetValues()
                onClickClearFilter()
              }}
              filterCount={filterCount()}
            />
          )}
        </div>
      }
    >
      <Table
        columns={
          orderColumn({
            isAllow,
            setOpen,
            list: paginate.list,
            other: paginate,
          }).columns
        }
        data={paginate?.list}
        loading={loading}
        page={paginate.currentPage || 1}
        totalPages={paginate.pageCount}
        limit={paginate.perPage}
        onPaginationChange={paginate.onPaginationChange}
        itemCount={paginate.itemCount}
        currentPageCount={paginate?.list?.length}
      />
      <FilterOrders
        ref={childReference}
        handleApplyFilter={handleApplyFilter}
        open={openFilter}
        setOpen={setOpenFilter}
      />
      <CourseNameModal open={!!open?.length} setOpen={setOpen} courses={open || []} />
    </LayoutWrapper>
  )
}

export default OrderManageIndex
