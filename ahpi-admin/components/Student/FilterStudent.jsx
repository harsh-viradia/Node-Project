/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"
import DrawerWrapper from "shared/drawer"
import { MASTER_CODES, MODULE_ACTIONS, MODULES } from "utils/constant"
import { debounce } from "utils/util"
import Button from "widgets/button"
import DateRangeInput from "widgets/dateRangeInput"
import Dropdown from "widgets/dropdown"
import MasterSelect from "widgets/masterSelect"

const activityOptions = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Not Active", value: "Not Active" },
]

const verifiedOptions = [
  { label: "All", value: "All" },
  { label: "Verified", value: "Verified" },
  { label: "Not Verified", value: "NotVerified" },
]

const FilterStudent = ({ open, setOpen, title = "Filter", applyFilter, loading, permission = {} }) => {
  const [selectValue, setSelectValue] = useState()
  const [selectValue2, setSelectValue2] = useState()
  const [selectValue3, setSelectValue3] = useState()
  const [selectValue4, setSelectValue4] = useState()
  const [selectValue5, setSelectValue5] = useState()
  const [courseOptions, setCourseOptions] = useState([])
  const [universityOptions, setUniversityOptions] = useState([])
  const [courseFilter, setCourseFilter] = useState()
  const [statusFilter, setStatusFilter] = useState()
  const [universityFilter, setUniversityFilter] = useState()
  const [activityFilter, setActivityFilter] = useState()
  const [verificationFilter, setVerificationFilter] = useState()
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const getAllCourses = debounce(async (inputValue, callback) => {
    const payload = {
      query: {},
    }

    if (inputValue) {
      payload.query.searchColumns = ["name", "desc"]
      payload.query.search = inputValue
    }
    await commonApi({ action: "list", module: "course", common: true, data: payload }).then(([, { data = {} }]) => {
      const coursesList = data?.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(coursesList)
      } else {
        setCourseOptions(coursesList)
      }
      return false
    })
  }, 500)

  const getAllUniversities = debounce(async (inputValue, callback) => {
    const payload = {
      search: inputValue,
    }

    await commonApi({ action: "list", module: "university", common: true, data: payload }).then(([, { data = {} }]) => {
      const universityList = data?.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(universityList)
      } else {
        setUniversityOptions(universityList)
      }
      return false
    })
  }, 500)

  useEffect(() => {
    if (open) {
      if (hasAccessTo(permission, MODULES.COURSE, MODULE_ACTIONS.GETALL)) {
        getAllCourses()
      }
      if (hasAccessTo(permission, MODULES.UNIVERSITY, MODULE_ACTIONS.GETALL)) {
        getAllUniversities()
      }
    }
  }, [open])

  const applyFilters = () => {
    const filterData = {}
    if (courseFilter?.length > 0) {
      filterData.courses = courseFilter
    }
    if (statusFilter?.length > 0) {
      filterData.stsIds = statusFilter
    }
    if (universityFilter?.length > 0) {
      filterData.universityIds = universityFilter
    }
    if (startDate && endDate) {
      filterData.appliedDate = {
        from: dayjs(startDate).format("YYYY-MM-DD 00:00:00"),
        to: dayjs(endDate).format("YYYY-MM-DD 23:59:59"),
      }
    }
    if (activityFilter) {
      filterData.isActive = activityFilter
        ? activityFilter !== "All"
          ? activityFilter === "Active"
          : undefined
        : undefined
    }
    if (verificationFilter) {
      filterData.unVerified = verificationFilter
        ? verificationFilter !== "All"
          ? verificationFilter === "Active"
          : undefined
        : undefined
    }
    applyFilter(filterData)
  }

  return (
    <DrawerWrapper
      title={title}
      modalFooter={
        <>
          <Button onClick={() => setOpen(false)} title="Close" kind="dark-gray" hoverKind="white" disabled={loading} />
          <Button title="Apply Filter" onClick={() => applyFilters()} loading={loading} />
        </>
      }
      open={open}
      setOpen={setOpen}
    >
      <div className="grid items-start gap-4">
        {hasAccessTo(permission, MODULES.COURSE, MODULE_ACTIONS.GETALL) && (
          <div className="flex items-end gap-3">
            <div className="w-full gap-2">
              <Dropdown
                isDisabled={loading}
                isMulti
                isSearchable={hasAccessTo(permission, MODULES.COURSE, MODULE_ACTIONS.GETALL)}
                placeholder="Select Courses"
                className="w-full"
                label="Courses"
                id="coursesAppliedIds"
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
        )}

        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <MasterSelect
              isMulti
              isDisabled={loading}
              placeholder="Select Status"
              className="w-full"
              label="Status *"
              id="stsIds"
              value={selectValue2}
              code={MASTER_CODES.userStatus}
              onChange={(opt) => {
                const dt = opt?.map((a) => {
                  return {
                    stsId: a.value,
                    stsNm: a.label,
                  }
                })
                setSelectValue2(opt)
                setStatusFilter(dt)
              }}
            />
          </div>
        </div>

        {hasAccessTo(permission, MODULES.UNIVERSITY, MODULE_ACTIONS.GETALL) && (
          <div className="flex items-end gap-3">
            <div className="w-full gap-2">
              <Dropdown
                isDisabled={loading}
                isMulti
                isSearchable={hasAccessTo(permission, MODULES.UNIVERSITY, MODULE_ACTIONS.GETALL)}
                placeholder="Select Universities"
                className="w-full"
                label="Universities"
                id="universityIds"
                value={selectValue3}
                defaultOptions={universityOptions}
                loadOptions={getAllUniversities}
                onChange={(opt) => {
                  const dt = opt?.map((a) => {
                    return {
                      universityId: a.value,
                    }
                  })
                  setSelectValue3(opt)
                  setUniversityFilter(dt)
                }}
              />
            </div>
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <Dropdown
              isClearable
              isDisabled={loading}
              placeholder="Select Activity Status"
              className="w-full"
              label="Active"
              id="activityIds"
              value={selectValue4}
              defaultOptions={activityOptions}
              onChange={(opt) => {
                setSelectValue4(opt)
                setActivityFilter(opt?.value)
              }}
            />
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <Dropdown
              isClearable
              isDisabled={loading}
              placeholder="Select Verification Status"
              className="w-full"
              label="Verified"
              id="verifiedIds"
              value={selectValue5}
              defaultOptions={verifiedOptions}
              onChange={(opt) => {
                setSelectValue5(opt)
                setVerificationFilter(opt?.value)
              }}
            />
          </div>
        </div>

        <DateRangeInput
          label="Applied Date"
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>
    </DrawerWrapper>
  )
}

export default FilterStudent
