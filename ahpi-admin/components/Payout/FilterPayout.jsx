/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useState } from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import DateRangeInput from "widgets/dateRangeInput"
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
  { value: "1", label: "Pending" },
  { value: "2", label: "Successfull" },
  { value: "3", label: "Failed" },
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

const FilterPayout = ({ open, setOpen, title = "Filter", getList, data, pagination, permission }) => {
  const [setTabIndex] = useState(1)
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
          <Button title="Apply Filter" />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Dropdown label="Instructor" defaultOptions={userList} placeholder="Select Instructor" />
        <Dropdown label="Status" defaultOptions={statusList} placeholder="Select Status" />
        <DateRangeInput label="Date Range" placeholder="Start Date - End Date" />
      </div>
    </DrawerWrapper>
  )
}

export default FilterPayout
