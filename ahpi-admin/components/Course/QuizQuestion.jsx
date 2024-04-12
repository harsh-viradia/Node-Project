/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import ImageIcon from "icons/imageIcon"
import TodoAddIcon from "icons/todoAddIcon"
import TodoRemoveIcon from "icons/todoRemoveIcon"
import React from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"
import OrbitLink from "widgets/orbitLink"
import RadioButton from "widgets/radioButton"
import TextEditor from "widgets/textEditor"

const QuizQuestion = ({ open, setOpen, addQuestion, title = "Add", setSectionTitle }) => {
  const closeModal = () => {
    setOpen(false)
    setSectionTitle("Add")
  }

  return (
    <DrawerWrapper
      modalFooter={
        <div className="flex gap-3 ">
          <Button title="Close" onClick={() => closeModal()} />
          <Button onClick={() => addQuestion()} title={title === "Add" ? title : "Update"} />
        </div>
      }
      title={`${title} Question`}
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <div>
          <div className="grid gap-3">
            <TextEditor label="Question" mandatory />
            <Dropdown label="Type" option="MCQ" mandatory />
            <div>
              <label className="inline-block mb-2 text-xs font-medium text-foreground">
                {" "}
                Answer <span className="text-red pl-0.5">*</span>
              </label>
              <div className="grid gap-3">
                <div className="flex items-center w-full gap-2">
                  <div className="flex items-center w-full gap-3">
                    <RadioButton name="question" />
                    <Input placeholder="Enter Answer" className="w-full" />
                  </div>
                  <OrbitLink href="#" className="text-gray-400">
                    <ImageIcon />
                  </OrbitLink>
                  <OrbitLink href="#">
                    <TodoAddIcon />
                  </OrbitLink>
                  <OrbitLink href="#">
                    <TodoRemoveIcon />
                  </OrbitLink>
                </div>
                <div className="flex items-center w-full gap-2">
                  <div className="flex items-center w-full gap-3">
                    <RadioButton name="question" />
                    <Input placeholder="Enter Answer" className="w-full" />
                  </div>
                  <OrbitLink href="#" className="text-gray-400">
                    <ImageIcon />
                  </OrbitLink>
                  <OrbitLink href="#">
                    <TodoAddIcon />
                  </OrbitLink>
                  <OrbitLink href="#">
                    <TodoRemoveIcon />
                  </OrbitLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DrawerWrapper>
  )
}

export default QuizQuestion
