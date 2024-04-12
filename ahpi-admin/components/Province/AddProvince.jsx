/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { provinceSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import { capitalizeFirstLetter, codeValidation } from "utils/util"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"

import useSyncProvince from "./hooks/useSyncProvince"

const defaultValues = {
  id: undefined,
  name: undefined,
  code: undefined,
  ISOCode2: undefined,
  countryId: undefined,
  countryNm: undefined,
}

const AddProvince = ({ open, setOpen, title = "Add State", getList, data, pagination }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(provinceSchema),
  })
  const { onSubmit, loading, getAllCountries, countryOptions, selectValue, setSelectValue, onSelectInputChange } =
    useSyncProvince({
      open,
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
      if (data?.countryId && data?.countryNm) {
        setValue("countryId", data.countryId)
        setValue("countryNm", data.countryNm)
        setSelectValue([{ label: data.countryNm, value: data.countryId }])
      }
    }
  }, [open])

  return (
    <DrawerWrapper
      title={title}
      width="max-w-xl"
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
          label="State Name"
          mandatory
          placeholder="Enter State Name"
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
        <Dropdown
          placeholder="Search Country"
          className="w-full"
          label="Country"
          mandatory
          id="CountryId"
          isDisabled={loading}
          value={selectValue}
          rest={register("countryId")}
          defaultOptions={countryOptions}
          loadOptions={getAllCountries}
          onInputChange={onSelectInputChange}
          onChange={(opt) => {
            setValue("countryId", opt.value)
            setValue("countryNm", opt.label)
            clearErrors("countryId")
          }}
          error={errors?.countryId?.message}
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
      </div>
    </DrawerWrapper>
  )
}

export default AddProvince
