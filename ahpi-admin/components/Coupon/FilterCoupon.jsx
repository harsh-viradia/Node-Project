/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React from "react"
import DrawerWrapper from "shared/drawer"
import { COURSE_TYPE, MASTER_CODES } from "utils/constant"
import Button from "widgets/button"
import DateRangeInput from "widgets/dateRangeInput"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"
import MasterSelect from "widgets/masterSelect"

const FilterCoupon = ({
  open,
  setOpen,
  title = "Filter",
  loading,
  dateRange,
  dateRange3,
  criteriaFilter,
  courseFilter,
  categoryFilter,
  setDateRange,
  setDateRange3,
  setCriteriaFilter,
  setCourseFilter,
  setCategoryFilter,
  applyFilter,
}) => {
  const closeModal = () => {
    setOpen(false)
  }

  return (
    <DrawerWrapper
      title={title}
      modalFooter={
        <>
          <Button
            onClick={() => closeModal()}
            title="Close"
            kind="dark-gray"
            hoverKind="white"
            className="hover:border-primary"
            disabled={loading}
          />
          <Button title="Apply Filter" onClick={() => applyFilter()} loading={loading} />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <DateRangeInput
          label="Applied Date"
          placeholder="Start Date - End Date"
          startDate={dateRange?.[0]}
          endDate={dateRange?.[1]}
          setDateRange={(value) => {
            setDateRange(value)
          }}
          isClear={false}
        />
        <DateRangeInput
          label="Expire Date"
          placeholder="Start Date - End Date"
          startDate={dateRange3?.[0]}
          endDate={dateRange3?.[1]}
          setDateRange={(value) => {
            setDateRange3(value)
          }}
          isClear={false}
        />
        <MasterSelect
          showCode
          isSearchable
          isClearable
          isDisabled={loading}
          placeholder="Choose Coupon Criteria"
          className="w-full"
          label="Coupon Criteria"
          id="criteriaId"
          code={MASTER_CODES.couponCriteria}
          value={criteriaFilter}
          onChange={(opt) => {
            setCriteriaFilter(opt)
          }}
        />
        <FilterSelectDropdown
          action="add"
          module="courses"
          searchColumns={["title"]}
          label="Course"
          placeholder="Search Course"
          onChange={(opt) => {
            setCourseFilter(opt)
          }}
          labelColumn="title"
          value={courseFilter}
          isClearable
          isMulti
          isSearch
          query={{ isActive: true, sts: COURSE_TYPE.PUBLISHED }}
          isDisabled={loading}
        />
        <FilterSelectDropdown
          action="list"
          module="category"
          searchColumns={["name"]}
          label="Program"
          placeholder="Search Program"
          onChange={(opt) => {
            setCategoryFilter(opt)
          }}
          value={categoryFilter}
          isClearable
          isMulti
          isSearch
          isDisabled={loading}
        />
      </div>
    </DrawerWrapper>
  )
}

export default FilterCoupon
