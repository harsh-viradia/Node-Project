/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import DateRangeInput from "widgets/dateRangeInput"
import Dropdown from "widgets/dropdown"

const statusList = [
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
]

const PAYOUT_TYPE = [
  { value: 1, label: "Manual(By Admin)" },
  { value: 2, label: "Automatic(By PAYTM)" },
]

const FilterPayout = ({
  open,
  setOpen,
  title = "Filter",
  applyFilter,
  setOpenFilter,
  dateRange,
  setDateRange,
  status,
  setStatus,
  setMonthYrRange,
  monthYrRange,
  payoutType,
  setPayoutType,
}) => {
  const closeModal = () => {
    setOpen(false)
    setOpenFilter(false)
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
          <Button title="Apply Filter" onClick={applyFilter} />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Dropdown
          label="Status"
          defaultOptions={statusList}
          placeholder="Select Status"
          isClearable
          onChange={(value) => {
            setStatus(value)
          }}
          value={status}
          isSearch={false}
        />

        <DateRangeInput
          startDate={dateRange?.[0]}
          endDate={dateRange?.[1]}
          label="Transfer Date"
          placeholder="Start Date - End Date"
          setDateRange={(value) => {
            setDateRange(value || "")
          }}
          className="left-0"
        />

        <DateRangeInput
          startDate={monthYrRange?.[0]}
          endDate={monthYrRange?.[1]}
          setDateRange={(value) => {
            setMonthYrRange(value || "")
          }}
          format="MM/YYYY"
          selectMonth
          label="Month/Year Range"
          className="left-0"
        />

        <Dropdown
          label="Payout type"
          defaultOptions={PAYOUT_TYPE}
          placeholder="Select Payout Type"
          isMulti
          onChange={(value) => {
            setPayoutType(value)
          }}
          value={payoutType}
          isSearch={false}
        />
      </div>
    </DrawerWrapper>
  )
}

export default FilterPayout
