/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { countrySchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import { capitalizeFirstLetter, codeValidation } from "utils/util"
import Button from "widgets/button"
import Input from "widgets/input"

import useSyncCountry from "./hooks/useSyncCountry"

const defaultValues = {
  id: undefined,
  name: undefined,
  code: undefined,
  ISOCode2: undefined,
  ISOCode3: undefined,
  ISDCode: undefined,
  isDefault: false,
}

const AddCountry = ({ open, setOpen, title = "Add Country", getList, data, pagination }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(countrySchema),
  })
  const { onSubmit, loading } = useSyncCountry({
    setOpen,
    getList,
    reset,
    defaultValues,
    pagination,
  })

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
  }

  useEffect(() => {
    reset({ ...defaultValues })
    if (open && data) {
      setValue("id", data?._id)
      setValue("name", data?.name)
      setValue("code", data?.code)
      setValue("ISOCode2", data?.ISOCode2)
      setValue("ISOCode3", data?.ISOCode3)
      setValue("ISDCode", data?.ISDCode)
    }
  }, [open])

  return (
    <DrawerWrapper
      width="max-w-xl"
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
          label="Country Name"
          mandatory
          placeholder="Enter Country Name"
          rest={register("name", {
            onChange: (event) => {
              setValue("name", capitalizeFirstLetter(event.target.value))
            },
          })}
          error={errors?.name?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <Input
          label="Code"
          mandatory
          placeholder="Enter Code"
          rest={register("code", {
            onChange: (event) => {
              setValue("code", codeValidation(event.target.value))
            },
          })}
          error={errors?.code?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <Input
          label="Two Letter ISO Code"
          mandatory
          placeholder="Enter Two Letter ISO Code"
          rest={register("ISOCode2", {
            onChange: (event) => {
              setValue("ISOCode2", event.target.value.toUpperCase())
            },
          })}
          error={errors?.ISOCode2?.message}
          disabled={loading}
          maxLength={2}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <Input
          label="Three Letter ISO Code"
          mandatory
          placeholder="Enter Three Letter ISO Code"
          rest={register("ISOCode3", {
            onChange: (event) => {
              setValue("ISOCode3", event.target.value.toUpperCase())
            },
          })}
          error={errors?.ISOCode3?.message}
          disabled={loading}
          maxLength={3}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <Input
          label="ISD Code"
          mandatory
          placeholder="Enter ISD Code"
          rest={register("ISDCode", {
            onChange: (event) => {
              const { value } = event.target
              if (value && /^\d+$/.test(value)) {
                setValue("ISDCode", value)
              } else if (!value) {
                setValue("ISDCode", "")
              } else {
                setValue("ISDCode", getValues("ISDCode"))
              }
            },
          })}
          error={errors?.ISDCode?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddCountry
