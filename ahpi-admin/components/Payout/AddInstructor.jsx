/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Checkbox from "widgets/checkbox"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"
import Upload from "widgets/upload"

const AddInstructorForm = ({ open, setOpen, title = "Add Partner" }) => {
  const [tabIndex, setTabIndex] = useState(1)
  const closeModal = () => {
    setOpen(false)
    setTabIndex(1)
  }

  return (
    <DrawerWrapper
      title={title}
      width="max-w-3xl"
      modalFooter={
        <>
          <Button
            onClick={() => closeModal()}
            title="Close"
            kind="dark-gray"
            hoverKind="white"
            className="hover:border-primary"
          />
          <Button title="Add Partner" />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <Tabs>
        <TabList>
          <Tab>Basic Information</Tab>
          <Tab>Agreement</Tab>
        </TabList>

        <TabPanel>
          <div className="grid gap-3">
            <Input label="Name" placeholder="Enter Name" mandatory />
            <Input label="Email" placeholder="Enter Email" mandatory type="email" />
            <Input label="Phone" placeholder="Enter Phone" mandatory type="number" />
            <Upload label="Profile Image" mandatory formats="JPEG,PNG" />
            <TextEditor label="Bio" placeholder="Enter Bio" mandatory />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid gap-3">
            <div>
              <Input label="No Of Courses" placeholder="Enter No Courses" mandatory type="number" />
              <Checkbox title="Course Approval" id="approval" />
            </div>
            <Dropdown label="Program" placeholder="Select Program" />
            <Input label="Payout Percentage(%)" placeholder="Enter Payout Percentage(%)" mandatory type="number" />
          </div>
        </TabPanel>
      </Tabs>
    </DrawerWrapper>
  )
}

export default AddInstructorForm
