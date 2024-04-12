import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import FilterButton from "widgets/filterButton"
import SearchInput from "widgets/searchInput"

import AddNotificationForm from "./AddNotificationForm"
import NotificationColumn from "./columns"
import FilterNotification from "./FilterNotification"
import useNotification from "./hook/useNotification"

const { useRef } = React
const NotificationManage = ({ permission = {}, user = {} }) => {
  const childReference = useRef()

  const {
    isAllow,
    setSearchValue,
    searchValue,
    loading,
    list,
    openFilter,
    setOpenFilter,
    open,
    setOpen,
    filter,
    setFilter,
    handleApplyFilter,
    onClickClearFilter,
    ...dt
  } = useNotification({ permission })

  const [value, setValue] = useState(searchValue)

  const { onSearch } = useSearch({
    setSearchValue,
    setValue,
  })

  const filterCount = () => {
    if (filter) {
      if (filter.startDt || filter.endDt) {
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
      title="Notification Management"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search Notification"
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.CREATE) && (
            <Button onClick={() => setOpen(true)} title="Add Notification" icon={<AddIcon size="10" />} />
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
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={NotificationColumn({ dt, setOpen, isAllow, list }).columns}
          data={list}
          loading={loading}
          page={dt.currentPage || 1}
          totalPages={dt.pageCount || 1}
          limit={dt.perPage}
          onPaginationChange={dt.onPaginationChange}
          itemCount={dt.itemCount}
          currentPageCount={list.length}
        />
      )}

      <AddNotificationForm
        getList={dt.getList}
        editId={dt.editId}
        setEditId={dt.setEditId}
        open={open}
        setOpen={setOpen}
        limit={dt.perPage}
        offset={dt.offset}
        isAllow={isAllow}
      />
      <FilterNotification
        ref={childReference}
        handleApplyFilter={handleApplyFilter}
        open={openFilter}
        setOpen={setOpenFilter}
      />
    </LayoutWrapper>
  )
}

export default NotificationManage
