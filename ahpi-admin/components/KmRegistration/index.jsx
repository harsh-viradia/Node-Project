import { hasAccessTo } from "@knovator/can"
import Table from "hook/table/useTable"
import UploadIcon from "icons/uploadIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import SearchInput from "widgets/searchInput"

import kmRegistrationColumn from "./columns"
import useKmRegistration from "./hooks/useKmRegistration"
import ImportData from "./ImportData"
import ImportDataList from "./ImportDataList"

const KmRegistration = ({ permission = {}, user = {} }) => {
  const { loading, getList, applicantsList, setApplicantsList, ignore, setIgnore, loading2, isAllow, ...other } =
    useKmRegistration({ permission })
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(other.searchValue)

  const { onSearch } = useSearch({
    setSearchValue: other.setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="KM Registration"
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
          {hasAccessTo(permission, MODULES.APPLICANT, MODULE_ACTIONS.IMPORT) && (
            <Button onClick={() => setOpen(true)} title="Import" icon={<UploadIcon className="w-4 h-4 text-white" />} />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            kmRegistrationColumn({
              setIgnore,
              isAllow,
              other,
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
      <ImportDataList
        title={ignore?.title || "Applicants"}
        open={!!ignore}
        setOpen={setIgnore}
        applicantsList={applicantsList}
        setApplicantsList={setApplicantsList}
        loading2={loading2}
      />
      <ImportData open={open} setOpen={setOpen} getList={getList} permission={permission} />
    </LayoutWrapper>
  )
}

export default KmRegistration
