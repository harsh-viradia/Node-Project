import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import SearchInput from "widgets/searchInput"

import AddProvince from "./AddProvince"
import provinceColumn from "./columns"
import useProvince from "./hooks/useProvince"

const Province = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState(false)
  const { getList, list, loading, isAllow, ...other } = useProvince({ permission })
  const [value, setValue] = useState(other.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other.setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="State"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search State"
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.CREATE) && (
            <Button title="Add State" icon={<AddIcon size="10" />} onClick={() => setOpen(true)} />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            provinceColumn({
              getList,
              list,
              other,
              isAllow,
            }).columns
          }
          data={list}
          loading={loading}
          onPaginationChange={other.onPaginationChange}
          page={other.currentPage}
          totalPages={other.pageCount}
          limit={other.perPage}
          itemCount={other.itemCount}
          currentPageCount={list.length}
        />
      )}

      <AddProvince open={open} setOpen={setOpen} getList={getList} />
    </LayoutWrapper>
  )
}

export default Province
