/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import { yupResolver } from "@hookform/resolvers/yup"
import useAddCategory from "components/Category/hook/useAddCategory"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { categorySchema } from "schema/master"
import DrawerWrapper from "shared/drawer"
import { MASTER_CODES } from "utils/constant"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"
import MasterSelect from "widgets/masterSelect"
import TextEditor from "widgets/textEditor"
import Upload from "widgets/upload"

const defaultValues = {
  name: "",
  description: undefined,
  topics: [],
}

const AddCategory = ({ getList, open, setOpen, editId, setEditId, limit, offset, searchValue, list }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(categorySchema),
  })

  const { getAllParentCategory, onSubmit, categoryOptions, ...other } = useAddCategory({
    open,
    setOpen,
    editId,
    setEditId,
    getList,
    limit,
    searchValue,
    offset,
    list,
  })

  useEffect(() => {
    // eslint-disable-next-line no-restricted-syntax
    if (open) {
      reset({ ...defaultValues })
      other.setSelectedImg()
      other.setSelectedParentCategory()
    }
  }, [open])

  useEffect(() => {
    if (editId && open) {
      setValue("name", editId.name)
      setValue("description", editId.description)
      if (editId.image) other.setSelectedImg({ id: editId.image._id, uri: editId.image.uri })
      if (editId.parentCategory?.length)
        other.setSelectedParentCategory({
          value: editId.parentCategory?.[0]._id,
          label: editId.parentCategory?.[0].name,
        })
      if (editId.topics?.length)
        setValue(
          "topics",
          editId.topics?.map(({ _id, name }) => ({
            value: _id,
            label: name,
          }))
        )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId])
  return (
    <DrawerWrapper
      modalFooter={
        <div className="flex gap-3 ">
          <Button
            onClick={() => {
              setEditId()
              setOpen(false)
            }}
            title="Close"
            kind="dark-gray"
            hoverKind="white"
            className="hover:border-primary"
          />
          <Button loading={other.loading} title={editId ? "Update Program" : "Save"} onClick={handleSubmit(onSubmit)} />{" "}
        </div>
      }
      title={editId ? "Update Program" : "Add Program"}
      open={open}
      setOpen={() => {
        setOpen(false)
        setEditId()
      }}
    >
      <div className="grid gap-3">
        <Input
          label="Program Name"
          placeholder="Enter Program Name"
          rest={register("name")}
          error={errors.name?.message}
          mandatory
          className="capitalize"
        />
        {list && (
          <Dropdown
            placeholder="Search Parent Program"
            id="userId"
            label="Parent Program"
            value={other.selectedParentCategory}
            defaultOptions={categoryOptions}
            loadOptions={getAllParentCategory}
            isClearable
            onChange={(opt) => {
              other.setSelectedParentCategory(opt)
            }}
          />
        )}
        <TextEditor
          label="Program Description"
          placeholder="Enter Program Description"
          mandatory
          rest={register("description")}
          setValue={setValue}
          valueText="description"
          valueData={getValues("description")}
          error={errors.description?.message}
        />
        <Upload
          label="Upload Image"
          selectedImg={other.selectedImg}
          setImg={(data) => other.setSelectedImg(data)}
          resolution="400px/100px"
        />
        <MasterSelect
          placeholder="Search Keyword"
          className="w-full"
          label="Search Keyword"
          id="topics"
          showCode
          mandatory
          // showCode
          code={MASTER_CODES.topics}
          isMulti
          isClearable
          value={watch("topics")}
          error={errors?.topics?.message}
          name="topics"
          onChange={(opt) => {
            setValue("topics", opt, { shouldValidate: true })
          }}
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddCategory
