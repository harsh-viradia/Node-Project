/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"
import Upload from "widgets/upload"

const defaultOptions = [
  { value: "chocolate", label: "First" },
  { value: "strawberry", label: "Second" },
  { value: "vanilla", label: "Third" },
]

const course = [
  {
    id: "item-1",
    courseImage: "https://picsum.photos/200?random=1",
    courseCategory: "Learn Python: The Complete Python Programming Course",
    courseTitle: "science",
    coursePrice: "100",
    courseDescription: "0",
  },
  {
    id: "item-2",
    courseImage: "https://picsum.photos/200?random=2",
    courseCategory: "The Complete Python Masterclass : Become a Python Engineer",
    courseTitle: "science",
    coursePrice: "100",
    courseDescription: "0",
  },
  {
    id: "item-3",
    courseImage: "https://picsum.photos/200?random=3",
    courseCategory: "First",
    courseTitle: "science",
    coursePrice: "100",
    courseDescription: "0",
  },
  {
    id: "item-4",
    courseImage: "https://picsum.photos/200?random=4",
    courseCategory: "First",
    courseTitle: "science",
    coursePrice: "100",
    courseDescription: "0",
  },
]

const reorder = (list, startIndex, endIndex) => {
  const result = [...list]
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const SeoManageForm = ({ open, setOpen, title = "SEO Management", getList, data, pagination, permission }) => {
  const [tabIndex, setTabIndex] = useState(0)
  const [courseList, setCourseList] = useState(course)
  const closeModal = () => {
    setOpen(false)
    setTabIndex(0)
  }

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) return
    const items = reorder(courseList, result.source.index, result.destination.index)
    setCourseList(items)
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
          <Button title="Save Changes" />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <Tabs>
        <TabList>
          <Tab>Basic</Tab>
          <Tab>Open Graph</Tab>
          <Tab>Header</Tab>
        </TabList>

        <TabPanel>
          <div className="grid gap-3">
            <Input label="Meta Title" placeholder="Enter Meta Title" mandatory />
            <Input label="Meta Description" placeholder="Enter Meta Description" mandatory />
            <Input label="Keywords" placeholder="Enter Keywords" mandatory />
            <Input label="Slug" placeholder="Enter Slug" mandatory />
            <Input label="Author" placeholder="Enter Author Name" mandatory />
            <Upload label="Image URL" placeholder="Enter URL" mandatory formats="JPEG,PNG" />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid gap-3">
            <Input label="Title" placeholder="Enter Title" mandatory />
            <Input label="Description" placeholder="Enter Description" mandatory />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid gap-3">
            <TextEditor label="Add Script" />
          </div>
        </TabPanel>
      </Tabs>
    </DrawerWrapper>
  )
}

export default SeoManageForm
