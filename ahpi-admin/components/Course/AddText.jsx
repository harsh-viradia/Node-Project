import React from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"

const AddText = ({ open, setOpen, addedText, title = "Add", setSectionTitle }) => {
  const closeModal = () => {
    setOpen(false)
    setSectionTitle("Add")
  }
  return (
    <DrawerWrapper
      modalFooter={
        <div className="flex gap-3 ">
          <Button title="Close" onClick={() => closeModal()} outline />{" "}
          <Button onClick={() => addedText()} title={title === "Add" ? title : "Update"} />{" "}
        </div>
      }
      title={`${title} Text`}
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Input label="Title" placeholder="Enter Title" mandatory />
        <TextEditor label="Description" mandatory />
        <TextEditor label="Text" mandatory />
      </div>
    </DrawerWrapper>
  )
}

export default AddText
