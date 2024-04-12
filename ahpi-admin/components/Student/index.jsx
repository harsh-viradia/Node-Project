import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import ExportIcon from "icons/exportIcon"
import FilterIcon from "icons/filterIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import SearchInput from "widgets/searchInput"

import AddStudent from "./AddStudent"
import studentColumn from "./columns"
import FilterStudent from "./FilterStudent"
import useStudent from "./hooks/useStudent"

const Student = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState(false)
  const {
    loading,
    getList,
    isAllow,
    openFilter,
    setOpenFilter,
    applyFilter,
    exportStudentList,
    getListData,
    ...other
  } = useStudent({
    permission,
  })
  const [value, setValue] = useState(other.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other.setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Applicants"
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
            <Button onClick={() => setOpen(true)} title="Add" icon={<AddIcon size="10" />} />
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
          {isAllow(MODULE_ACTIONS.EXPORT) && other?.list?.length ? (
            <Button
              title="Export"
              icon={<ExportIcon />}
              kind="green"
              hoverKind="white"
              darkHoverKind="dark-green"
              onClick={() => exportStudentList()}
            />
          ) : (
            ""
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            studentColumn({
              getListData,
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
      <AddStudent open={open} setOpen={setOpen} getList={getList} permission={permission} />
      <FilterStudent
        loading={loading}
        open={openFilter}
        setOpen={setOpenFilter}
        applyFilter={applyFilter}
        permission={permission}
      />
    </LayoutWrapper>
  )
}

export default Student
