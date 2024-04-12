import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { masterSchema } from "schema/master"
import DrawerWrapper from "shared/drawer"
import isEmpty from "utils/util"
import Button from "widgets/button"
import Input from "widgets/input"

import useSyncSubMaster from "./hooks/useSyncSubMaster"

const defaultValues = {
  id: undefined,
  name: undefined,
  code: undefined,
}

const AddSubMaster = ({
  open,
  setOpen,
  title = "Add Sub Master",
  parentCode,
  parentId,
  data = {},
  getList,
  pagination,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(masterSchema),
  })
  const { onSubmit, loading } = useSyncSubMaster({
    parentCode,
    parentId,
    reset,
    setOpen,
    defaultValues,
    getList,
    pagination,
  })

  useEffect(() => {
    // eslint-disable-next-line no-restricted-syntax
    reset({ ...defaultValues })
    if (open && data) {
      for (const [key, value] of Object.entries(defaultValues)) {
        setValue(key, data?.[key] || value)
      }
    }
  }, [open])

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
  }

  return (
    <DrawerWrapper
      title={title}
      modalFooter={
        <div className="flex items-center justify-end w-full gap-3">
          <Button onClick={() => setOpen(false)} kind="dark-gray" hoverKind="white" title="Close" disabled={loading} />
          <Button title={title} onClick={handleSubmit(onSubmit)} loading={loading} />
        </div>
      }
      open={open}
      setOpen={setOpen}
    >
      <div className="grid gap-4">
        <Input
          rest={register("name")}
          placeholder="Enter Name"
          label="Name *"
          error={errors.name?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <Input
          label="Code *"
          placeholder="Enter Code"
          rest={register("code", {
            onChange: (event) => {
              setValue("code", event.target.value.replaceAll(/ /g, "_")?.toUpperCase())
            },
          })}
          error={errors.code?.message}
          disabled={!isEmpty(data) || loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddSubMaster
