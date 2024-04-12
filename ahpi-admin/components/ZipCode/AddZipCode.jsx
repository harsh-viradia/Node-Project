/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable spaced-comment */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zipCodeSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"

import useSyncZipCode from "./hooks/useSyncZipCode"

const defaultValues = {
  id: undefined,
  zipCode: undefined,
  country: undefined,
  city: undefined,
  cityNm: undefined,
  stateId: undefined,
  stateNm: undefined,
}

const AddZipCode = ({ open, setOpen, title = "Add Zip Code", getList, data, pagination }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    clearErrors,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(zipCodeSchema),
  })

  const {
    onSubmit,
    loading,
    setSelectValue,
    SelectCountryValue,
    setSelectCountryValue,
    setSelectStateValue,
    cityOptions,
    stateOptions,
    CountryOptions,
    getAllCity,
    getAllStates,
    getAllCountry,
    onSelectInputChange,
    onSelectStateInputChange,
    onSelectCountryInputChange,
  } = useSyncZipCode({
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
      setValue("zipCode", data?.zipcode)
      // setValue("city", data?.city)
      if (data?.city?._id) {
        setValue("city", data?.city?._id)
        setValue("cityNm", data?.city?.name)
        setSelectValue([{ value: data.city._id, label: data.city.name }])
      }
      if (data?.state?._id) {
        setValue("stateId", data?.state?._id)
        setValue("stateNm", data?.state?.name)
        setSelectStateValue([{ value: data.state._id, label: data.state.name }])
      }
      if (data?.country?._id) {
        setValue("country", data?.country?._id)
        setValue("countryNm", data?.country?.name)
        setSelectCountryValue([{ value: data.country._id, label: data.country.name }])
      }
    }
  }, [open])
  return (
    <DrawerWrapper
      title={title}
      width="max-w-xl"
      modalFooter={
        <>
          <Button onClick={() => setOpen(false)} title="Close" kind="dark-gray" hoverKind="white" />
          <Button title={title} onClick={handleSubmit(onSubmit)} loading={loading} />
        </>
      }
      open={open}
      setOpen={setOpen}
    >
      <div className="grid gap-4">
        <Input
          label="Zip Code"
          mandatory
          placeholder="Enter Zip Code"
          rest={register("zipCode")}
          error={errors?.zipCode?.message}
          maxLength={11}
          onKeyDown={(event) => onKeyDown(event)}
          disabled={loading}
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
          id="stateId"
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
          onInputChange={onSelectStateInputChange}
          onChange={(opt) => {
            setValue("stateId", opt.value)
            setValue("stateNm", opt.label)
            clearErrors("stateId")
            clearErrors("stateNm")
            setValue("city")
          }}
          error={errors?.stateId?.message}
          onKeyDown={(event) => onKeyDown(event)}
        />

        <Dropdown
          placeholder="Search City"
          className="w-full"
          label="City"
          mandatory
          id="city"
          isDisabled={loading || !getValues("stateId") || !getValues("country")}
          value={
            watch("stateId") ? (watch("city") ? { label: watch("cityNm"), value: watch("city") } : "Search City") : ""
          }
          rest={register("city")}
          defaultOptions={cityOptions}
          loadOptions={getAllCity}
          onInputChange={onSelectInputChange}
          onChange={(opt) => {
            setValue("city", opt.value)
            setValue("cityNm", opt.label)
            clearErrors("city")
          }}
          error={errors?.city?.message}
          onKeyDown={(event) => onKeyDown(event)}
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddZipCode
