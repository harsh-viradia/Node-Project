import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { courseDocumentSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"
import Upload2 from "widgets/upload2"

import useDocs from "./hooks/useDocs"

const defaultValues = {
  id: undefined,
  nm: undefined,
  desc: undefined,
  docId: undefined,
}

const AddDocument = ({
  open,
  setOpen,
  title = "Add",
  setSectionTitle,
  secId,
  getMaterialList,
  editDocsData,
  setEditDocsData,
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
    resolver: yupResolver(courseDocumentSchema),
  })

  const { addUpdateDocs, loading } = useDocs({ reset, defaultValues, setSectionTitle, setOpen, secId, getMaterialList })

  useEffect(() => {
    reset({ ...defaultValues })
    if (!open) {
      setEditDocsData()
    }
  }, [open])

  useEffect(() => {
    if (editDocsData) {
      // eslint-disable-next-line no-underscore-dangle
      setValue("id", editDocsData?._id)
      setValue("nm", editDocsData.nm)
      // eslint-disable-next-line no-underscore-dangle
      setValue("docId", editDocsData.docId?._id)
      setValue("docDetails", editDocsData.docId)
      setValue("desc", editDocsData.desc)
    }
  }, [editDocsData])

  const closeModal = () => {
    setOpen(false)
    setSectionTitle("Add")
    setEditDocsData()
    reset({ ...defaultValues })
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
            onClick={handleSubmit(addUpdateDocs)}
            title={title === "Add" ? `${title} Document` : "Update Document"}
            loading={loading}
          />{" "}
        </div>
      }
      title={`${title} Document`}
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
        />
        <TextEditor
          label="Document Description"
          placeholder="Enter Document Description"
          // mandatory
          rest={editDocsData ? watch("desc") : register("desc")}
          setValue={setValue}
          valueText="desc"
          valueData={getValues("desc")}
          error={errors.desc?.message}
        />
        <Upload2
          docId={watch("docId")}
          docDetails={watch("docDetails")}
          setValue={setValue}
          getValues={getValues}
          error={errors?.docId?.message}
          label="Add Document"
          formikKey="docId"
          mandatory
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddDocument
