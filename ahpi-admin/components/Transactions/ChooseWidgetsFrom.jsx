/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import ProductCard from "widgets/Cards/productCard"
import Dropdown from "widgets/dropdown"
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

const ChooseWidgets = ({ open, setOpen, title = "Add Widget", getList, data, pagination, permission }) => {
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
      width="max-w-2xl"
      modalFooter={
        <>
          <Button onClick={() => closeModal()} title="Close" kind="dark-gray" hoverKind="white" />
          <Button title={title} />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="w-full">
          <Dropdown label="Widget" placeholder="Choose Widget" mandatory defaultOptions={defaultOptions} />
          <div className="pt-4">
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div className="grid gap-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                  {courseList?.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <ProductCard item={item} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </DrawerWrapper>
  )
}

export default ChooseWidgets
