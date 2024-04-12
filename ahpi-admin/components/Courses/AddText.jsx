/* eslint-disable no-underscore-dangle */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { textSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"

import useText from "./hooks/useText"

const defaultValues = {
  id: undefined,
  nm: undefined,
  desc: undefined,
  text: undefined,
}

const AddText = ({
  open,
  setOpen,
  title = "Add",
  setSectionTitle,
  secId,
  getMaterialList,
  editTextData,
  setEditTextData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(textSchema),
  })

  const { addUpdateText, loading } = useText({ reset, defaultValues, setSectionTitle, setOpen, secId, getMaterialList })

  useEffect(() => {
    reset({ ...defaultValues })
    if (!open) {
      setEditTextData()
    }
  }, [open])

  useEffect(() => {
    if (editTextData) {
      setValue("id", editTextData?._id)
      setValue("nm", editTextData.nm)
      setValue("desc", editTextData.desc)
      setValue("text", editTextData.text)
    }
  }, [editTextData])

  const closeModal = () => {
    setOpen(false)
    setSectionTitle("Add")
    setEditTextData()
    reset({ ...defaultValues })
  }

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(addUpdateText)()
    }
  }

  return (
    <DrawerWrapper
      modalFooter={
        <div className="flex gap-3 ">
          <Button
            title="Close"
            onClick={() => closeModal()}
            kind="dark-gray"
            hoverKind="white"
            darkHoverKind="primary"
            disabled={loading}
          />{" "}
          <Button
            onClick={handleSubmit(addUpdateText)}
            title={title === "Add" ? `${title} Text` : "Update Text"}
            loading={loading}
          />{" "}
        </div>
      }
      title={`${title} Text`}
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Input
          label="Title"
          placeholder="Enter Title"
          mandatory
          rest={register("nm")}
          error={errors.nm?.message}
          disabled={loading}
          onKeyDown={onKeyDown}
        />
        <TextEditor
          label="Text Description"
          placeholder="Enter Text Description"
          // mandatory
          rest={editTextData ? watch("desc") : register("desc")}
          setValue={setValue}
          valueText="desc"
          valueData={getValues("desc")}
          error={errors.desc?.message}
        />
        <TextEditor
          label="Text"
          placeholder="Enter Text"
          mandatory
          rest={editTextData ? watch("text") : register("text")}
          setValue={setValue}
          valueText="text"
          valueData={getValues("text")}
          error={errors.text?.message}
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddText
