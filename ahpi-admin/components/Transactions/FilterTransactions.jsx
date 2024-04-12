/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React from "react"
import { useForm } from "react-hook-form"
import DrawerWrapper from "shared/drawer"
import { MASTER_CODES, STATUS } from "utils/constant"
import Button from "widgets/button"
import DateRangeInput from "widgets/dateRangeInput"
import Dropdown from "widgets/dropdown"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"
import MasterSelect from "widgets/masterSelect"

const paymentMethodList = [{ value: "PAYTM", label: "Paytm" }]

const { forwardRef, useImperativeHandle } = React
const FilterTransactions = forwardRef((properties, reference) => {
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
      stsId: values.status?.value,
      type: values.payment?.value,
      userId: values.userId?.value,
      startDate: values?.startDate,
      endDate: values?.endDate,
    }
    for (const propertyName in sendObject) {
      if (!sendObject[propertyName]) {
        delete sendObject[propertyName]
      }
    }
    handleApplyFilter(sendObject)
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
          />
          <Button title="Apply Filter" onClick={handleSubmit(onSubmit)} />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <FilterSelectDropdown
          module="lerner"
          label="User"
          placeholder="Search User"
          onChange={(opt) => {
            setValue("userId", opt)
          }}
          value={watch("userId")}
          isClearable
        />
        <DateRangeInput
          label="Date Range"
          placeholder="Start Date - End Date"
          startDate={watch("startDate")}
          endDate={watch("endDate")}
          setDateRange={(value) => {
            setValue("startDate", value?.[0] || "")
            setValue("endDate", value?.[1] || "")
          }}
        />

        <MasterSelect
          placeholder="Search Status"
          className="w-full"
          label="Status"
          id="status"
          code={MASTER_CODES.transactionStatus}
          value={watch("status")}
          showCode
          onChange={(opt) => {
            setValue("status", opt)
          }}
        />
        <Dropdown
          label="Payment Method"
          isClearable
          value={watch("payment")}
          isSearch={false}
          defaultOptions={paymentMethodList}
          placeholder="Select Payment Method"
          onChange={(opt) => {
            setValue("payment", opt)
          }}
        />
      </div>
    </DrawerWrapper>
  )
})

export default FilterTransactions
