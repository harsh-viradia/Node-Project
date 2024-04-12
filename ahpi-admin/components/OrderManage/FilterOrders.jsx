import React from "react"
import { useForm } from "react-hook-form"
import DrawerWrapper from "shared/drawer"
import { COURSE_TYPE, STATUS } from "utils/constant"
import Button from "widgets/button"
import DateRangeInput from "widgets/dateRangeInput"
import Dropdown from "widgets/dropdown"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"

const paymentMethodList = [{ value: "PAYTM", label: "Paytm" }]

const statusList = [
  { value: STATUS.PENDING, label: "Pending" },
  { value: STATUS.SUCCESSFULL, label: "Success" },
  { value: STATUS.FAILED, label: "Failed" },
]

const { forwardRef, useImperativeHandle } = React
const FilterOrders = forwardRef((properties, reference) => {
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
      sts: values.sts?.value,
      payMethod: values.paymentMethod?.value,
      "user.id": values.userId?.value,
      startDate: values.startDate,
      endDate: values.endDate,
      courses: values.courses?.length ? values.courses.map((a) => a.value) : undefined,
      coupon: values.coupon?.length ? values.coupon.map((a) => a.code) : undefined,
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
          defaultOptions={statusList}
          label="Status"
          placeholder="Select Status"
          onChange={(opt) => {
            setValue("sts", opt)
          }}
          value={watch("sts")}
          isClearable
          isSearch={false}
        />

        <DateRangeInput
          startDate={watch("startDate")}
          endDate={watch("endDate")}
          setDateRange={(value) => {
            setValue("startDate", value?.[0] || "")
            setValue("endDate", value?.[1] || "")
          }}
          label="Date Range"
        />
        <Dropdown
          onChange={(opt) => {
            setValue("paymentMethod", opt)
          }}
          value={watch("paymentMethod")}
          isClearable
          isSearch={false}
          label="Payment Method"
          defaultOptions={paymentMethodList}
          placeholder="Select Payment Method"
        />
        <FilterSelectDropdown
          action="add"
          module="coupon"
          searchColumns={["code"]}
          label="Coupon"
          placeholder="Search Coupon Code"
          onChange={(opt) => {
            setValue("coupon", opt)
          }}
          labelColumn="code"
          value={watch("coupon")}
          isClearable
          isMulti
          query={{ isActive: true }}
        />
        <FilterSelectDropdown
          action="list"
          module="lerner"
          label="User"
          placeholder="Search User"
          onChange={(opt) => {
            setValue("userId", opt)
          }}
          value={watch("userId")}
          isClearable
        />
        <FilterSelectDropdown
          action="add"
          module="courses"
          searchColumns={["title"]}
          label="Course"
          placeholder="Search Courses"
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

export default FilterOrders
