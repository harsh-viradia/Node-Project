/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { hasAccessTo } from "@knovator/can"
import React, { useState } from "react"
import DrawerWrapper from "shared/drawer"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"

const FilterStudent = ({
  open,
  setOpen,
  title = "Filter",
  courseOptions,
  getAllCourses,
  setCourseFilter,
  applyFilter,
  loading,
  permission,
}) => {
  const [selectValue, setSelectValue] = useState()

  return (
    <DrawerWrapper
      title={title}
      modalFooter={
        <>
          <Button onClick={() => setOpen(false)} title="Close" kind="dark-gray" hoverKind="white" disabled={loading} />
          <Button title="Apply Filter" onClick={() => applyFilter()} loading={loading} />
        </>
      }
      open={open}
      setOpen={setOpen}
    >
      <div className="grid items-start gap-4">
        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <Dropdown
              isSearchable={hasAccessTo(permission, MODULES.COURSE, MODULE_ACTIONS.GETALL)}
              isDisabled={loading}
              isMulti
              placeholder="Select Courses"
              className="w-full"
              label="Courses"
              id="coursesAppliedId"
              value={selectValue}
              defaultOptions={courseOptions}
              loadOptions={getAllCourses}
              onChange={(opt) => {
                const dt = opt?.map((a) => {
                  return {
                    courseId: a.value,
                    courseNm: a.label,
                  }
                })
                setSelectValue(opt)
                setCourseFilter(dt)
              }}
            />
          </div>
        </div>
      </div>
    </DrawerWrapper>
  )
}

export default FilterStudent
