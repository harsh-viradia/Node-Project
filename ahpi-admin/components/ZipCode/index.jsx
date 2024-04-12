/* eslint-disable prettier/prettier */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import SearchInput from "widgets/searchInput"

import AddZipCode from "./AddZipCode"
import ZipCodeColumn from "./columns"
import useZipCode from "./hooks/useZipCode"

const ZipCode = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState(false)
  const { getList, loading, isAllow, ...other } = useZipCode({ permission })
  const [value, setValue] = useState(other.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other.setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Zip Code"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search Zip Code"
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.CREATE) && (
            <Button title="Add Zip Code" icon={<AddIcon size="10" />} onClick={() => setOpen(true)} />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            ZipCodeColumn({
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
      <AddZipCode open={open} setOpen={setOpen} getList={getList} />
    </LayoutWrapper>
  )
}

export default ZipCode
