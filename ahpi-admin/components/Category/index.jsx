/* eslint-disable import/no-named-as-default-member */
/* eslint-disable sonarjs/no-duplicate-string */

import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS, SYSTEM_USERS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import SearchInput from "widgets/searchInput"

import Filter from "../common/Filter"
import FilterButton from "../common/FilterButton"
import AddCategory from "./AddCategory"
import categoryColumns from "./columns"
import useCategory from "./hook/useCategory"
import SeoManageForm from "./SeoManageForm"

const Category = ({ permission = {}, user = {} }) => {
  const {
    isAllow,
    setSearchValue,
    searchValue,
    changeSearch,
    loading,
    list,
    openFilter,
    setOpenFilter,
    open,
    setOpen,
    filter,
    setFilter,
    open1,
    setOpen1,
    handleApplyFilter,
    onClickClearFilter,
    ...dt
  } = useCategory({ permission, user })

  const [value, setValue] = useState(searchValue)

  const { onSearch } = useSearch({
    setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      title="Programs"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search Program"
              className="w-60"
              value={value}
              onChange={(event) => onSearch(event.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.CREATE) && (
            <Button onClick={() => setOpen(true)} title="Add Program" icon={<AddIcon size="10" />} />
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <FilterButton
              onClick={() => setOpenFilter(true)}
              removeFilter={onClickClearFilter}
              filterCount={{ filter: filter?.value }}
            />
          )}
        </div>
      }
      permission={permission}
      user={user}
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            categoryColumns({
              dt,
              setOpen1,
              setOpen,
              isAllow,
              permission,
              list,
              showSlug: user?.role !== SYSTEM_USERS.INSTRUCTOR,
            }).columns
          }
          data={list}
          loading={loading}
          page={dt.currentPage || 1}
          totalPages={dt.pageCount}
          limit={dt.perPage}
          onPaginationChange={dt.onPaginationChange}
          itemCount={dt.itemCount}
          currentPageCount={list.length}
        />
      )}

      <AddCategory
        getList={dt.getList}
        editId={dt.editId}
        setEditId={dt.setEditId}
        open={open}
        setOpen={setOpen}
        limit={dt.perPage}
        offset={dt.offset}
        searchValue={searchValue}
        list={isAllow(MODULE_ACTIONS.GETALL)}
      />
      <SeoManageForm
        permission={permission}
        open={open1}
        setOpen={setOpen1}
        categoryDetail={dt.editId}
        module="category"
      />

      <Filter
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        filter={filter}
        setFilter={setFilter}
        handleApplyFilter={handleApplyFilter}
      />
    </LayoutWrapper>
  )
}

export default Category
