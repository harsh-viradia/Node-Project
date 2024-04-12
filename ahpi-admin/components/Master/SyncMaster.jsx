import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { masterSchema } from "schema/master"
import DrawerWrapper from "shared/drawer"
import isEmpty from "utils/util"
import Button from "widgets/button"
import Input from "widgets/input"

import useSyncMaster from "./hooks/useSyncMaster"

const defaultValues = {
  id: undefined,
  name: undefined,
  code: undefined,
}

const AddMaster = ({ open, setOpen, title = "Add Master", data = {}, getList, pagination }) => {
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

  const [loading2, setLoading2] = useState(false)

  const { onSubmit } = useSyncMaster({ reset, setOpen, defaultValues, getList, pagination, setLoading2 })

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
          <Button onClick={() => setOpen(false)} kind="dark-gray" hoverKind="white" title="Close" disabled={loading2} />
          <Button title={title} onClick={handleSubmit(onSubmit)} loading={loading2} />
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
          disabled={loading2}
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
          disabled={!isEmpty(data) || loading2}
          onKeyDown={(event) => onKeyDown(event)}
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddMaster
