import { hasAccessTo } from "@knovator/can"
import React from "react"
import { useForm } from "react-hook-form"
import DrawerWrapper from "shared/drawer"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import { removeNullAndUndefinedFromObj } from "utils/util"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"

const { forwardRef, useImperativeHandle } = React
const FilterStudents = forwardRef((properties, reference) => {
  const {
    open,
    setOpen,
    title = "Filter",
    cityOptions,
    stateOptions,
    handleApplyFilter,
    getAllStates,
    getAllCities,
    permission,
  } = properties
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
      courseId: values.courseId?.length ? values.courseId.map((a) => a.value) : undefined,
      city: values.city?.length ? values.city.map((a) => a.value) : undefined,
      state: values.state?.length ? values.state.map((a) => a.value) : undefined,
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
      <div className="grid items-start grid-cols-1 gap-4">
        {hasAccessTo(permission, MODULES.COURSE, MODULE_ACTIONS.GETALL) && (
          <FilterSelectDropdown
            action="add"
            module="courses"
            searchColumns={["title"]}
            label="Course"
            placeholder="Search Courses"
            onChange={(opt) => {
              setValue("courseId", opt)
            }}
            labelColumn="title"
            value={watch("courseId")}
            isClearable
            isMulti
          />
        )}
        {hasAccessTo(permission, MODULES.COUNTRY, MODULE_ACTIONS.GETALL) && (
          <Dropdown
            defaultOptions={cityOptions}
            label="City"
            placeholder="Search City"
            loadOptions={getAllCities}
            onChange={(opt) => {
              setValue("city", opt)
            }}
            value={watch("city")}
            isClearable
            isMulti
          />
        )}
        {hasAccessTo(permission, MODULES.PROVINCE, MODULE_ACTIONS.GETALL) && (
          <Dropdown
            defaultOptions={stateOptions}
            loadOptions={getAllStates}
            label="State"
            placeholder="Search State"
            onChange={(opt) => {
              setValue("state", opt)
            }}
            value={watch("state")}
            isClearable
            isMulti
          />
        )}
      </div>
    </DrawerWrapper>
  )
})

export default FilterStudents
