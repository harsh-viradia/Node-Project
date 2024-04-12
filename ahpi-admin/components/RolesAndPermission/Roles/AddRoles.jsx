/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { roleSchema } from "schema/master"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"

import useSyncRole from "./hooks/useSyncRole"

const defaultValues = {
  _id: undefined,
  name: undefined,
}

const AddRoles = ({ open, setOpen, title = "Add Role", data = {}, getList, pagination, permission }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues,
    resolver: yupResolver(roleSchema),
  })
  const { onSubmit, loading } = useSyncRole({ reset, setOpen, defaultValues, getList, pagination, permission })

  useEffect(() => {
    // eslint-disable-next-line no-restricted-syntax
    reset({ ...defaultValues })
    if (open && data) {
      for (const [key, value] of Object.entries(defaultValues)) {
        setValue(key, data?.[key] || value)
      }
    }
  }, [open])

  return (
    <DrawerWrapper
      title={title}
      modalFooter={
        <>
          <Button onClick={() => setOpen(false)} title="Close" kind="dark-gray" hoverKind="white" disabled={loading} />
          <Button title={title} onClick={handleSubmit(onSubmit)} loading={loading} />
        </>
      }
      open={open}
      setOpen={setOpen}
    >
      <div className="grid gap-4">
        <Input
          label="Role Name"
          mandatory
          placeholder="Enter Role Name"
          rest={register("name")}
          error={errors?.name?.message}
          disabled={loading}
          className="capitalize"
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddRoles
