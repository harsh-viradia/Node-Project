import Filter from "components/common/Filter"
import FilterButton from "components/common/FilterButton"
import Table from "hook/table/useTable"
import useWidgets from "hook/widget/useWidget"
import AddIcon from "icons/addIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MASTER_CODES, MODULE_ACTIONS } from "utils/constant"
import routes from "utils/routes"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import MasterSelect from "widgets/masterSelect"
import OrbitLink from "widgets/orbitLink"
import SearchInput from "widgets/searchInput"

import widgetColumns from "./columns"

const WidgetsBuilderIndex = ({ permission = {}, user = {} }) => {
  const {
    filter,
    setFilter,
    openFilter,
    setOpenFilter,
    isAllow,
    setSearchValue,
    searchValue,
    changeSearch,
    loading,
    list,
    handleApplyFilter,
    onClickClearFilter,
    widgetTypeFilter,
    setWidgetTypeFilter,
    filterObject,
    ...dt
  } = useWidgets({ permission })

  const [value, setValue] = useState(searchValue)

  const { onSearch } = useSearch({
    setSearchValue,
    setValue,
  })

  const MemoizedNestedComponent = React.useCallback(
    () => (
      // eslint-disable-next-line react/jsx-filename-extension
      <div className="grid grid-cols-1 items-start gap-4">
        <MasterSelect
          code={MASTER_CODES.widgetType}
          label="Widget Type"
          placeholder="Select Type"
          value={widgetTypeFilter}
          onChange={setWidgetTypeFilter}
          isClearable
          isSearch={false}
        />
      </div>
    ),
    [openFilter, widgetTypeFilter]
  )

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Widget"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search Widget"
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.CREATE) && (
            <OrbitLink href={routes.addWidget}>
              <Button title="Add Widget" icon={<AddIcon size="10" />} />
            </OrbitLink>
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <FilterButton
              onClick={() => setOpenFilter(true)}
              removeFilter={onClickClearFilter}
              filterCount={filterObject}
            />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={widgetColumns({ dt, isAllow, list }).columns}
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

export default WidgetsBuilderIndex
