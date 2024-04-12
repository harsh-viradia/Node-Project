import React from "react"
import { useForm } from "react-hook-form"
import DrawerWrapper from "shared/drawer"
import { FILTER_OPTION, MASTER_CODES } from "utils/constant"
import { removeNullAndUndefinedFromObj } from "utils/util"
import Button from "widgets/button"
import DateRangeInput from "widgets/dateRangeInput"
import Dropdown from "widgets/dropdown"
import MasterSelect from "widgets/masterSelect"

const { forwardRef, useImperativeHandle } = React
const FilterNotification = forwardRef((properties, reference) => {
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
      startDt: values.startDt,
      endDt: values.endDt,
      typeId: values.typeId?.value,
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
        <MasterSelect
          showCode
          placeholder="Search Notification Type"
          className="w-full"
          label="Notification Type"
          code={MASTER_CODES.notificationType}
          value={watch("typeId")}
          onChange={(opt) => {
            setValue("typeId", opt)
          }}
        />
        <DateRangeInput
          startDate={watch("startDt")}
          endDate={watch("endDt")}
          setDateRange={(value) => {
            setValue("startDt", value?.[0] || "")
            setValue("endDt", value?.[1] || "")
          }}
          label="Date Range"
        />
      </div>
    </DrawerWrapper>
  )
})

export default FilterNotification
