import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import { useRouter } from "next/router"
import React, { useRef, useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import AppContext from "utils/appContext"
import { MODULE_ACTIONS } from "utils/constant"
import routes from "utils/routes"
import useSearch from "utils/useSearch"
import Button from "widgets/button"
import FilterButton from "widgets/filterButton"
import SearchInput from "widgets/searchInput"

import courseColumn from "./columns"
import FilterCourse from "./filterCourse"
import useCourse from "./hooks/useCourse"
import PreviewCourse from "./previewCourse"

const Course = ({ permission = {}, user = {}, token }) => {
  const router = useRouter()

  const childReference = useRef()

  const {
    loading,
    getList,
    isAllow,
    openFilter,
    setOpenFilter,
    filter,
    setFilter,
    handleApplyFilter,
    onClickClearFilter,
    allowAdd,
    getCourseCounts,
    ...other
  } = useCourse({ permission, user })
  const [value, setValue] = useState(other.searchValue)
  const { setCourseData, setSectionData } = React.useContext(AppContext)
  const { onSearch } = useSearch({
    setSearchValue: other.setSearchValue,
    setValue,
  })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Courses"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.PREVIEW_COUNT) && (
            <p className="text-sm font-medium px-2">Request for Review : {other.requestedCount || 0}</p>
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search Courses"
              className="w-60"
              value={value}
              onChange={(event) => onSearch(event.target.value || "")}
            />
          )}
          {isAllow(MODULE_ACTIONS.BASICINFO) && (
            <Button
              disabled={!allowAdd}
              icon={<AddIcon size="10" />}
              title="Add Course"
              onClick={() => {
                router.push(routes.addCourse)
                setCourseData({})
                setSectionData()
              }}
            />
          )}
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <FilterButton
              onClick={() => setOpenFilter(true)}
              removeFilter={() => {
                childReference.current.resetValues()
                onClickClearFilter()
              }}
              filterCount={filter ? Object.entries(filter).length : undefined}
            />
          )}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            courseColumn({
              getList,
              isAllow,
              other,
              permission,
              getCourseCounts,
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
      <FilterCourse
        permission={permission}
        ref={childReference}
        handleApplyFilter={handleApplyFilter}
        open={openFilter}
        setOpen={setOpenFilter}
        isAllow={isAllow}
        user={user}
      />
      <PreviewCourse
        rejectPreview={other.rejectPreview}
        acceptPreview={other.acceptPreview}
        token={token}
        courseDetails={other.preview}
        open={!!other.preview}
        setOpen={other.setPreview}
        isAllow={isAllow}
      />
    </LayoutWrapper>
  )
}

export default Course
