/* eslint-disable unicorn/prevent-abbreviations */
import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import SearchInput from "widgets/searchInput"

import AddCity from "./AddCity"
import cityColumn from "./columns"
import useCity from "./hooks/useCity"

const City = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState(false)
  const { getList, loading, isAllow, ...other } = useCity({ permission })
  const [value, setValue] = useState(other.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other.setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="City"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search City"
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.CREATE) && (
            <Button title="Add City" icon={<AddIcon size="10" />} onClick={() => setOpen(true)} />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            cityColumn({
              getList,
              other,
              isAllow,
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

      <AddCity open={open} setOpen={setOpen} getList={getList} />
    </LayoutWrapper>
  )
}

export default City
