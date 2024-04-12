import React from "react"
import { useForm } from "react-hook-form"
import DrawerWrapper from "shared/drawer"
import { FILTER_OPTION } from "utils/constant"
import { removeNullAndUndefinedFromObj } from "utils/util"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"

const { forwardRef, useImperativeHandle } = React
const FilterCourse = forwardRef((properties, reference) => {
  const { open, setOpen, title = "Filter", handleApplyFilter } = properties
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
      </div>
    </DrawerWrapper>
  )
})

export default FilterCourse
