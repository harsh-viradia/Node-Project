import React from "react"
import { useForm } from "react-hook-form"
import DrawerWrapper from "shared/drawer"
import { SYSTEM_USERS } from "utils/constant"
import Button from "widgets/button"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"

const { forwardRef, useImperativeHandle } = React
const AnalyticsFilter = forwardRef((properties, reference) => {
  const { open, setOpen, title = "Filter", applyFilter, filter, user } = properties
  const { handleSubmit, setValue, watch, reset } = useForm({ defaultValues: filter })
  const closeModal = () => {
    setOpen(false)
  }
  const onSubmit = (values) => {
    const sendObject = {
      dateRange: values.dateRange,
      courseIds: values.courseIds?.length ? values.courseIds.map((a) => a.value) : undefined,
      instructorIds: values.instructorIds?.length ? values.instructorIds.map((a) => a.value) : undefined,
    }
    for (const propertyName in sendObject) {
      if (!sendObject[propertyName]) {
        delete sendObject[propertyName]
      }
    }
    applyFilter(sendObject)
  }
  useImperativeHandle(reference, () => ({
    resetValues() {
      reset(filter)
    },
  }))

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
        {user?.role !== SYSTEM_USERS.INSTRUCTOR && (
          <FilterSelectDropdown
            action="add" // action - list
            module="instructor"
            label="Partner"
            placeholder="Search Partner"
            onChange={(opt) => {
              setValue("instructorIds", opt)
            }}
            value={watch("instructorIds")}
            isClearable
            isMulti
            limit={false}
          />
        )}
        <FilterSelectDropdown
          action="add" // action - list
          module="courses"
          label="Course"
          placeholder="Search Course"
          onChange={(opt) => {
            setValue("courseIds", opt)
          }}
          value={watch("courseIds")}
          isClearable
          isMulti
          labelColumn="title"
          limit={false}
        />
      </div>
    </DrawerWrapper>
  )
})

export default AnalyticsFilter
