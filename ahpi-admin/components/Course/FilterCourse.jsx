import React, { useState } from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"

const userList = [
  { value: "1", label: "Nining Putri" },
  { value: "2", label: "Chrisenia Nadia " },
  { value: "3", label: "Syifa Intan" },
  { value: "4", label: "Supangkat Eka" },
  { value: "5", label: "Luis Juliandenny" },
  { value: "6", label: "kurniadi" },
]

const statusList = [
  { value: "1", label: "Publish" },
  { value: "2", label: "Draft" },
]

const FilterCoupon = ({ open, setOpen, title = "Filter" }) => {
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
        <Dropdown label="Partner" defaultOptions={userList} placeholder="Select Partner" />
        <Dropdown label="Status" defaultOptions={statusList} placeholder="Select Status" />
      </div>
    </DrawerWrapper>
  )
}

export default FilterCoupon
