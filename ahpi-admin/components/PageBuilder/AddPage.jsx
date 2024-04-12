/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useState } from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"

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

const AddPage = ({ open, setOpen, title = "Add Page", getList, data, pagination, permission }) => {
  const [tabIndex, setTabIndex] = useState(1)
  const [courseList, setCourseList] = useState(course)
  const closeModal = () => {
    setOpen(false)
    setTabIndex(1)
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
      modalFooter={
        <>
          <Button
            onClick={() => closeModal()}
            title="Close"
            kind="dark-gray"
            hoverKind="white"
            className="hover:border-primary"
          />
          <Button title="Add Page" />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Input label="Page Name" placeholder="Enter Page Name" mandatory />
        <Input label="Slug" placeholder="Enter Slug" mandatory />
      </div>
    </DrawerWrapper>
  )
}

export default AddPage
