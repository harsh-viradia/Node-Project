import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import FilterButton from "widgets/filterButton"
import SearchInput from "widgets/searchInput"

import AddUsers from "./AddUser"
import userColumn from "./columns"
import FilterUser from "./FilterUser"
import useUser from "./hooks/useUser"

const Users = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState(false)
  const {
    loading,
    userData,
    openFilter,
    filterCount,
    activeFilter,
    userId,
    getList,
    isAllow,
    getUsersList,
    setUserId,
    onPaginationChange,
    setSearchValue,
    setOpenFilter,
    setActiveFilter,
    applyFilter,
    removeFilter,
    ...other
  } = useUser({ permission })
  const [value, setValue] = useState(other.searchValue)
  const { onSearch } = useSearch({
    setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Users"
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
          {isAllow(MODULE_ACTIONS.CREATE) && (
            <div className="relative group">
              <Button onClick={() => setOpen(true)} title="Add User" icon={<AddIcon size="12px" />} />
            </div>
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <FilterButton onClick={() => setOpenFilter(true)} filterCount={filterCount} removeFilter={removeFilter} />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            userColumn({
              getList,
              isAllow,
              permission,
              other,
              rolesList: userData,
            }).columns
          }
          data={other.list}
          loading={loading}
          onPaginationChange={onPaginationChange}
          page={other.currentPage}
          totalPages={other.pageCount}
          limit={other.perPage}
          itemCount={other.itemCount}
          currentPageCount={other.list.length}
        />
      )}
      <AddUsers rolesList={userData} open={open} setOpen={setOpen} getList={getList} permission={permission} />
      <FilterUser
        open={openFilter}
        permission={permission}
        userData={userData}
        loading={loading}
        activeFilter={activeFilter}
        setOpen={setOpenFilter}
        getUsersList={getUsersList}
        setUserId={setUserId}
        setActiveFilter={setActiveFilter}
        applyFilter={applyFilter}
        userId={userId}
      />
    </LayoutWrapper>
  )
}

export default Users
