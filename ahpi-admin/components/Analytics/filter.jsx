import { hasAccessTo } from "@knovator/can"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import DrawerWrapper from "shared/drawer"
import { MODULE_ACTIONS, MODULES, SYSTEM_USERS } from "utils/constant"
import Button from "widgets/button"
import DateRangeInput from "widgets/dateRangeInput"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"

const { forwardRef, useImperativeHandle } = React
const FilterOrders = forwardRef((properties, reference) => {
  const { open, setOpen, title = "Filter", applyFilter, filter, permission, user } = properties
  const { handleSubmit, setValue, watch, reset } = useForm({ defaultValues: filter })
  const [formValues, setFormValues] = useState(filter)
  const closeModal = () => {
    setOpen(false)
  }
  useImperativeHandle(reference, () => ({
    resetValues() {
      setFormValues(filter)
      reset(filter)
    },
  }))
  const onSubmit = (values) => {
    const sendObject = {
      dateRange: values.dateRange,
      categories: values.categories?.length ? values.categories.map((a) => a.value) : undefined,
      instructorId: values?.instructorId?.value || undefined,
    }
    for (const propertyName in sendObject) {
      if (!sendObject[propertyName]) {
        delete sendObject[propertyName]
      }
    }
    applyFilter(sendObject)
    setFormValues(watch())
  }
  useEffect(() => {
    if (open) reset(formValues)
  }, [open])
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
        <DateRangeInput
          startDate={watch("dateRange")?.[0]}
          endDate={watch("dateRange")?.[1]}
          setDateRange={(value) => {
            setValue("dateRange", value)
          }}
          label="Date Range"
          isClear={false}
        />
        <FilterSelectDropdown
          action="list" // action - list
          module="category"
          label="Program"
          placeholder="Search Program"
          onChange={(opt) => {
            setValue("categories", opt)
          }}
          value={watch("categories")}
          query={{
            isActive: true,
            instructorId: user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : undefined,
          }}
          isClearable
          isMulti
        />
        {hasAccessTo(permission, MODULES.INSTRUCTOR, MODULE_ACTIONS.GETALL) && (
          <FilterSelectDropdown
            action="add"
            module="instructor"
            label="Partner"
            placeholder="Search Partner"
            onChange={(opt) => {
              setValue("instructorId", opt)
            }}
            value={watch("instructorId")}
            searchColumns={["name", "email", "mobNo", "companyNm"]}
            extraParam={{ filter: { isActive: true } }}
            isClearable
            query={{}}
            // labelColumn="companyNm"
            // optionalLabel="name"
          />
        )}
      </div>
    </DrawerWrapper>
  )
})

export default FilterOrders
