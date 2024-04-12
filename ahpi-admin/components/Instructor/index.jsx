/* eslint-disable sonarjs/no-nested-template-literals */
import Filter from "components/common/Filter"
import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import { useRouter } from "next/router"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import { addToUrl } from "utils/util"
import Button from "widgets/button"
import SearchInput from "widgets/searchInput"

import FilterButton from "../common/FilterButton"
import AddInstructorForm from "./AddInstructor"
import InstructorColumn from "./columns"
import useInstructor from "./hook/useInstructor"

const InstructorManageIndex = ({ permission = {}, user = {}, title = "Partners" }) => {
  const router = useRouter()
  const {
    isAllow,
    setSearchValue,
    searchValue,
    loading,
    list,
    open,
    setOpen,
    handleApplyFilter,
    onClickClearFilter,
    openFilter,
    setOpenFilter,
    filter,
    setFilter,
    MemoizedNestedComponent,
    courseApproval,
    filterObj,
    deleteAction,
    ...dt
  } = useInstructor({
    permission,
  })

  const [value, setValue] = useState(searchValue || router?.query?.isSearch)

  const { onSearch } = useSearch({
    setSearchValue,
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
              placeholder="Search Partner"
              className="w-60"
              value={value}
              onChange={(e) => {
                addToUrl("isSearch", e.target.value)
                addToUrl("limit", router?.query?.limit || dt?.perPage)
                addToUrl("isActive", router?.query?.isActive || filter?.value)
                addToUrl("isCourse", router?.query?.isCourse || courseApproval?.value)
                router.replace(addToUrl("offset", 0))
                onSearch(e.target.value)
                if (!e.target.value) {
                  setValue("")
                }
              }}
            />
          )}
          {isAllow(MODULE_ACTIONS.CREATE) && (
            <Button title="Add Partner" icon={<AddIcon size="10" />} onClick={() => setOpen(true)} />
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <FilterButton
              onClick={() => setOpenFilter(true)}
              removeFilter={onClickClearFilter}
              filterCount={filterObj}
            />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            InstructorColumn({
              dt,
              setOpen,
              isAllow,
              list,
              permission,
              deleteAction,
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

      <AddInstructorForm
        setFilterObject={dt.setFilterObject}
        filter={{
          isActive: filter?.value || router?.query?.isActive,
          "agreement.isApproved": courseApproval?.value || router?.query?.isCourse,
        }}
        setCourseApproval={dt.setCourseApproval}
        setFilter={setFilter}
        searchValue={searchValue}
        setSearchValue={setValue}
        getList={dt.getList}
        editId={dt.editId}
        setEditId={dt.setEditId}
        open={open}
        limit={dt.perPage}
        offset={dt.offset}
        setOpen={setOpen}
        permission={permission}
      />
      <Filter
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        permission={permission}
        filter={filter}
        setFilter={setFilter}
        handleApplyFilter={handleApplyFilter}
        Component={MemoizedNestedComponent}
      />
    </LayoutWrapper>
  )
}

export default InstructorManageIndex
