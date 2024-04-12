/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useState } from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"

const AddWidget = ({ open, setOpen, title = "Save Widget", getList, data, pagination, permission }) => {
  const [tabIndex, setTabIndex] = useState(1)
  const closeModal = () => {
    setOpen(false)
    setTabIndex(1)
  }
  return (
    <DrawerWrapper
      title={title}
      modalFooter={
        <>
          <Button onClick={() => closeModal()} title="Close" kind="dark-gray" hoverKind="white" />
          <Button title={title} />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid items-start gap-4">
        <Input label="Search" placeholder="Search and Select widget" minLength="16" maxLength="16" />
      </div>
    </DrawerWrapper>
  )
}

export default AddWidget
