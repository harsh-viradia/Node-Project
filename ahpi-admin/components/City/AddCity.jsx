/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { citySchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import { capitalizeFirstLetter, codeValidation } from "utils/util"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"

import useSyncCity from "./hooks/useSyncCity"

const defaultValues = {
  id: undefined,
  name: undefined,
  code: undefined,
  stateId: undefined,
  stateNm: undefined,
  country: undefined,
  contryNm: undefined,
}

const AddCity = ({ open, setOpen, title = "Add City", getList, data, pagination }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    clearErrors,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(citySchema),
  })
  const {
    onSubmit,
    loading,
    SelectCountryValue,
    onSelectCountryInputChange,
    CountryOptions,
    getAllCountry,
    setSelectValue,
    setSelectCountryValue,
    stateOptions,
    getAllStates,
    onSelectInputChange,
  } = useSyncCity({
    open,
    setOpen,
    getList,
    reset,
    getValues,
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
      if (data?.stateId && data?.stateNm) {
        setValue("stateId", data.stateId?._id)
        setValue("stateNm", data.stateNm)
        setSelectValue([{ value: data.stateId?._id, label: data.stateNm }])
      }
      if (data?.stateId?.countryId && data?.stateId?.countryNm) {
        setValue("country", data?.stateId?.countryId)
        setValue("countryNm", data?.stateId?.countryNm)
        setSelectCountryValue([{ value: data?.stateId?.countryId, label: data?.stateId?.countryNm }])
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
          label="City Name"
          mandatory
          placeholder="Enter City Name"
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
          id="country"
          isDisabled={loading}
          value={SelectCountryValue}
          rest={register("country")}
          defaultOptions={CountryOptions}
          loadOptions={getAllCountry}
          onInputChange={onSelectCountryInputChange}
          onChange={(opt) => {
            setValue("country", opt.value)
            setValue("countryNm", opt.label)
            clearErrors("country")
            setValue("stateId")
            setValue("stateNm")
          }}
          error={errors?.country?.message}
          onKeyDown={(event) => onKeyDown(event)}
        />

        <Dropdown
          placeholder="Search State"
          className="w-full"
          label="State"
          mandatory
          id="StateId"
          isDisabled={loading || !getValues("country")}
          value={
            watch("country")
              ? watch("stateId")
                ? { label: watch("stateNm"), value: watch("stateId") }
                : "Search State"
              : ""
          }
          rest={register("stateId")}
          defaultOptions={stateOptions}
          loadOptions={getAllStates}
          onInputChange={onSelectInputChange}
          onChange={(opt) => {
            setValue("stateId", opt.value)
            setValue("stateNm", opt.label)
            clearErrors("stateId")
          }}
          error={errors?.stateId?.message}
          onKeyDown={(event) => onKeyDown(event)}
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddCity
