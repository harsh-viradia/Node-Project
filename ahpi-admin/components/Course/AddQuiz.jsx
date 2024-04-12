import React from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"

const AddQuiz = ({ open, setOpen, addedQuiz, title = "Add", setSectionTitle }) => {
  const closeModal = () => {
    setOpen(false)
    setSectionTitle("Add")
  }
  return (
    <DrawerWrapper
      modalFooter={
        <div className="flex gap-3 ">
          <Button title="Close" onClick={() => closeModal()} outline />{" "}
          <Button onClick={() => addedQuiz()} title={title === "Add" ? title : "Update"} />{" "}
        </div>
      }
      title={`${title} Quiz`}
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Input label="Title" placeholder="Enter title" mandatory />
        <TextEditor label="Description" mandatory />
        <Input label="View Set of Questions" placeholder="Enter Set of Questions" mandatory />
        <Input label="Duration" placeholder="Enter Duration" mandatory />
      </div>
    </DrawerWrapper>
  )
}

export default AddQuiz
