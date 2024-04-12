import React from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"
import Upload from "widgets/upload"

const AddDocument = ({ open, setOpen, addedDocument, title = "Add", setSectionTitle }) => {
  const closeModal = () => {
    setOpen(false)
    setSectionTitle("Add")
  }
  return (
    <DrawerWrapper
      modalFooter={
        <div className="flex gap-3 ">
          <Button title="Close" onClick={() => closeModal()} outline />{" "}
          <Button onClick={() => addedDocument()} title={title === "Add" ? title : "Update"} />{" "}
        </div>
      }
      title={`${title} Document`}
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Input label="Title*" placeholder="Enter Title" mandatory />
        <TextEditor label="Description" mandatory />
        <Upload formats="PDF" label="Add Document" mandatory resolution="400px/100px" />
      </div>
    </DrawerWrapper>
  )
}

export default AddDocument
