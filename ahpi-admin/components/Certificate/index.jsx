/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/no-duplicate-string */
import Table from "hook/table/useTable"
import React, { useRef, useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import useSearch from "utils/useSearch"
import FilterButton from "widgets/filterButton"
import SearchInput from "widgets/searchInput"

import CertificateColumn from "./columns"
import FilterCertificate from "./FilterCertificate"
import useCertificate from "./hooks/useCertificate"
import PreviewCertificate from "./PreviewCertificate"

const Certificate = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState()
  const {
    isAllow,
    getList,
    loading,
    openFilter,
    setOpenFilter,
    filter = {},
    onClickClearFilter,
    handleApplyFilter,
    ...other
  } = useCertificate({ permission, user })
  const childReference = useRef()
  const [value, setValue] = useState(other?.searchValue)
  const { onSearch } = useSearch({
    setSearchValue: other?.setSearchValue,
    setValue,
  })
  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Certificate"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search Certificate"
              className="w-60"
              value={value}
              onChange={(e) => onSearch(e.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && isAllow(MODULE_ACTIONS.PARTIALUPDATE) && (
            <FilterButton
              onClick={() => setOpenFilter(true)}
              removeFilter={() => {
                childReference.current.resetValues()
                onClickClearFilter()
              }}
              filterCount={Object.keys(filter)?.length}
            />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            CertificateColumn({
              isAllow,
              getList,
              ...other,
              permission,
              setOpen,
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
      <FilterCertificate
        ref={childReference}
        handleApplyFilter={handleApplyFilter}
        open={openFilter}
        setOpen={setOpenFilter}
      />
      <PreviewCertificate certificateId={open} open={!!open} setOpen={setOpen} />
    </LayoutWrapper>
  )
}

export default Certificate
