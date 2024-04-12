/* eslint-disable unicorn/prevent-abbreviations */
import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import SearchInput from "widgets/searchInput"

import AddCountry from "./AddCountry"
import countryColumn from "./columns"
import useCountry from "./hooks/useCountry"

const Country = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState(false)
  const { getList, loading, partialDefaultUpdate, isAllow, ...other } = useCountry({ permission })
  const [value, setValue] = useState(other.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other.setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Country"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search Country"
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.CREATE) && (
            <Button title="Add Country" icon={<AddIcon size="10" />} onClick={() => setOpen(true)} />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            countryColumn({
              getList,
              other,
              partialDefaultUpdate,
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

      <AddCountry open={open} setOpen={setOpen} getList={getList} />
    </LayoutWrapper>
  )
}

export default Country
