import { yupResolver } from "@hookform/resolvers/yup"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { mappedSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import Upload from "widgets/upload"

import useImport from "./hooks/useImport"

const defaultValues = {
  courseId: undefined,
  files: undefined,
}

const ImportData = ({ open, setOpen, getList, permission }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    clearErrors,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(mappedSchema),
  })

  const [selectValue, setSelectValue] = useState()

  const closeModal = () => {
    setOpen(false)
    reset({ ...defaultValues })
  }

  const onSelectInputChange = () => {
    setSelectValue()
  }

  const { courseOptions, getAllCourses, loading, onSubmit } = useImport({
    open,
    getValues,
    closeModal,
    getList,
    permission,
  })

  return (
    <DrawerWrapper
      title="Import Data"
      modalFooter={
        <>
          <Button onClick={() => closeModal()} title="Close" kind="dark-gray" hoverKind="white" disabled={loading} />
          <Button title="Import" onClick={handleSubmit(onSubmit)} loading={loading} />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="flex flex-col gap-3">
        <div className="w-full gap-2">
          <Dropdown
            isDisabled={loading}
            placeholder="Select Course"
            className="w-full"
            label="Select Course *"
            id="coursesAppliedId"
            value={selectValue}
            rest={register("courseId")}
            defaultOptions={courseOptions}
            loadOptions={getAllCourses}
            onInputChange={onSelectInputChange}
            onChange={(opt) => {
              setValue("courseId", opt.value)
              clearErrors("courseId")
            }}
            error={errors?.courseId?.message}
          />
        </div>
        <Upload
          label="Upload Applicants"
          setValue={setValue}
          error={errors.files?.message}
          clearErrors={clearErrors}
          getValues={getValues}
        />
      </div>
    </DrawerWrapper>
  )
}

export default ImportData
