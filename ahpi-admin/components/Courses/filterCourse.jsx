import { hasAccessTo } from "@knovator/can"
import React from "react"
import { useForm } from "react-hook-form"
import DrawerWrapper from "shared/drawer"
import {
  COURSE_OPTION,
  COURSE_STATUS_OPTION,
  FILTER_OPTION,
  MODULE_ACTIONS,
  MODULES,
  SYSTEM_USERS,
} from "utils/constant"
import { removeNullAndUndefinedFromObj } from "utils/util"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"

const { forwardRef, useImperativeHandle } = React
const FilterCourse = forwardRef((properties, reference) => {
  const { open, setOpen, title = "Filter", handleApplyFilter, permission, user } = properties
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
      sts: values.sts?.value,
      category: values.category?.length ? values.category.map((a) => a.value) : undefined,
      userIds: values.userId?.length ? values.userId.map((a) => a.value) : undefined,
      isPreview: values.isPreview?.value,
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
        <Dropdown
          defaultOptions={COURSE_STATUS_OPTION}
          label="Course Status"
          placeholder="Select Course Status"
          onChange={(opt) => {
            setValue("sts", opt)
          }}
          value={watch("sts")}
          isClearable
          isSearch={false}
        />
        {hasAccessTo(permission, MODULES.INSTRUCTOR, MODULE_ACTIONS.GETALL) && (
          <FilterSelectDropdown
            action="add"
            module="instructor"
            label="Partner"
            placeholder="Search Partner"
            onChange={(opt) => {
              setValue("userId", opt)
            }}
            value={watch("userId")}
            searchColumns={["name", "email", "mobNo", "companyNm"]}
            extraParam={{ filter: { isActive: true } }}
            isClearable
            isMulti
            query={{}}
          />
        )}
        {hasAccessTo(permission, MODULES.CATEGORY, MODULE_ACTIONS.GETALL) && (
          <FilterSelectDropdown
            action="list" // action - list
            module="category"
            label="Program"
            placeholder="Search Program"
            onChange={(opt) => {
              setValue("category", opt)
            }}
            value={watch("category")}
            query={{
              isActive: true,
              instructorId: user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : undefined,
            }}
            isClearable
            isMulti
            searchColumns={["name"]}
          />
        )}
        <Dropdown
          defaultOptions={COURSE_OPTION}
          label="Requested For Review"
          placeholder="Select Option"
          onChange={(opt) => {
            setValue("isPreview", opt)
          }}
          value={watch("isPreview")}
          isClearable
          isSearch={false}
        />
      </div>
    </DrawerWrapper>
  )
})

export default FilterCourse
