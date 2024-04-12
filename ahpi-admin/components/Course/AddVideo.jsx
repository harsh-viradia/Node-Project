import React from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"
import Upload from "widgets/upload"

const AddVideo = ({ open, setOpen, addVideo, title = "Add", setSectionTitle }) => {
  const closeModal = () => {
    setOpen(false)
    setSectionTitle("Add")
  }

  return (
    <DrawerWrapper
      modalFooter={
        <div className="flex gap-3 ">
          <Button title="Close" onClick={() => closeModal()} outline />
          <Button title={title === "Add" ? title : "Update"} onClick={() => addVideo()} />{" "}
        </div>
      }
      title={`${title} Video`}
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Input label="Title" placeholder="Enter title" mandatory />
        <TextEditor label="Description" mandatory />
        <Upload label="Upload Video" formats="MP3, MOV, WMV" mandatory />
      </div>
    </DrawerWrapper>
  )
}

export default AddVideo
