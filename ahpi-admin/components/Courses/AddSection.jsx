/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"

const AddSection = ({
  open,
  setOpen,
  addUpdateSection,
  register,
  errors,
  handleSubmit,
  setValue,
  getValues,
  reset,
  defaultValues,
  title,
  setSectionTitle,
  loading2,
}) => {
  const closeModal = () => {
    setOpen(false)
    reset({ ...defaultValues })
    setSectionTitle("Add Section")
  }

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(addUpdateSection)()
    }
  }

  return (
    <DrawerWrapper
      title={`${title} Section`}
      modalFooter={
        <>
          <Button title="Close" onClick={() => closeModal()} outline disabled={loading2} />
          <Button
            title={title === "Add" ? `${title} Section` : "Update Section"}
            onClick={handleSubmit(addUpdateSection)}
            loading={loading2}
          />{" "}
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Input
          label="Section Name"
          placeholder="Enter Section Name"
          mandatory
          rest={register("nm")}
          error={errors?.nm?.message}
          disabled={loading2}
          onKeyDown={onKeyDown}
        />
        <TextEditor
          label="Section Description"
          placeholder="Enter Section Description"
          mandatory
          rest={register("desc")}
          setValue={setValue}
          valueText="desc"
          valueData={getValues("desc")}
          error={errors.desc?.message}
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddSection
