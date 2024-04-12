/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import commonApi from "api"
import CloseIcon from "icons/closeIcon"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import StarRatings from "react-star-ratings"
import DrawerWrapper from "shared/drawer"
import { COURSE_TYPE, DEFAULT_LIMIT, DEFAULT_OFFSET_PAYLOAD, FILTER_OPTION } from "utils/constant"
import { debounce, removeNullAndUndefinedFromObj } from "utils/util"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"

const { forwardRef, useImperativeHandle } = React
const FilterReview = forwardRef((properties, reference) => {
  const {
    open,
    setOpen,
    title = "Filter",
    handleApplyFilter,

    rating,
    setRating,
  } = properties

  const [course, setCourse] = useState()
  const { handleSubmit, setValue, reset, watch } = useForm()
  const closeModal = () => {
    setOpen(false)
  }
  useImperativeHandle(reference, () => ({
    resetValues() {
      reset()
    },
  }))

  const onSubmit = (values) => {
    const sendObject = {
      isActive: values.isActive?.value,
      stars: rating,
      courseId: values.courses?.length ? values.courses.map((a) => a.value) : undefined,
    }
    handleApplyFilter(removeNullAndUndefinedFromObj(sendObject))
  }

  return (
    <DrawerWrapper
      title={title}
      modalFooter={
        <>
          <Button
            onClick={closeModal}
            title="Close"
            kind="dark-gray"
            hoverKind="white"
            className="hover:border-primary"
          />
          <Button onClick={handleSubmit(onSubmit)} title="Apply filter" />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <div className="flex items-center gap-6">
          <StarRatings
            rating={rating}
            starRatedColor="#40b5e8"
            starHoverColor="#fbae14"
            changeRating={setRating}
            numberOfStars={5}
            starDimension="22px"
            name="rating"
          />
          {rating === undefined ? (
            " "
          ) : (
            <button
              type="button"
              className="text-red outline-none appearance-none"
              onClick={() => {
                setRating()
              }}
            >
              <CloseIcon size="20px" />
            </button>
          )}
        </div>
        <Dropdown
          defaultOptions={FILTER_OPTION}
          label="Status"
          placeholder="Select Status"
          onChange={(opt) => {
            setValue("isActive", opt)
          }}
          value={watch("isActive")}
          isClearable
          isSearch={false}
        />
        <FilterSelectDropdown
          action="add"
          module="courses"
          searchColumns={["title"]}
          label="Course"
          placeholder="Search Course"
          onChange={(opt) => {
            setValue("courses", opt)
          }}
          labelColumn="title"
          value={watch("courses")}
          isClearable
          isMulti
          query={{ isActive: true, sts: COURSE_TYPE.PUBLISHED }}
        />
      </div>
    </DrawerWrapper>
  )
})

export default FilterReview
