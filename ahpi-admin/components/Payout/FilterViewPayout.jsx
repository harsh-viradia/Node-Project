import React, { useState } from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import DateRangeInput from "widgets/dateRangeInput"
import Dropdown from "widgets/dropdown"

const statusList = [
  { value: "1", label: "Pending" },
  { value: "2", label: "Successfull" },
  { value: "3", label: "Failed" },
]

const FilterPayout = ({ open, setOpen, title = "Filter" }) => {
  const [setTabIndex] = useState(1)
  const closeModal = () => {
    setOpen(false)
    setTabIndex(1)
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
          <Button title="Apply Filter" />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Dropdown label="Status" defaultOptions={statusList} placeholder="Select Status" />
        <DateRangeInput label="Date Range" placeholder="Start Date - End Date" />
      </div>
    </DrawerWrapper>
  )
}

export default FilterPayout
