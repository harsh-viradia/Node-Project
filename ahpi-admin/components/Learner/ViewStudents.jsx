import React from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import DrawerWrapper from "shared/drawer"
import { MODULE_ACTIONS } from "utils/constant"
import Button from "widgets/button"

import CourseDetails from "./view/CourseDetails"
import StudentDetails from "./view/StudentDetails"

const ViewStudents = ({ original, open, setOpen, isAllow, permission }) => {
  const closeModal = () => {
    setOpen(false)
  }

  return (
    <DrawerWrapper
      width="max-w-6xl"
      title={<>View User Details</>}
      modalFooter={<Button onClick={() => closeModal()} title="Close" kind="dark-gray" hoverKind="white" />}
      open={open}
      setOpen={closeModal}
    >
      <Tabs className="relative block -mt-3">
        <TabList>
          <Tab>User Details</Tab>
          {isAllow(MODULE_ACTIONS.GETCOURSEDETAILS) && <Tab>Course Detail</Tab>}
        </TabList>
        <TabPanel>
          <StudentDetails original={original} permission={permission} />
        </TabPanel>
        <TabPanel>
          <CourseDetails original={original} />
        </TabPanel>
      </Tabs>
    </DrawerWrapper>
  )
}

export default ViewStudents
