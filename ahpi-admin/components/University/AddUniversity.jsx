/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { universitySchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"

import useSyncUniversity from "./hooks/useSyncUniversity"

const defaultValues = {
  id: undefined,
  name: undefined,
  abbreviation: undefined,
  street: undefined,
  countryId: undefined,
  countryNm: undefined,
  stateId: undefined,
  stateNm: undefined,
  cityId: undefined,
  cityNm: undefined,
  zipCode: undefined,
}

const AddUniversity = ({ open, setOpen, title = "Add University", getList, data, pagination, permission }) => {
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
    resolver: yupResolver(universitySchema),
  })
  const {
    onSubmit,
    loading,
    onSelectInputChange,
    onSelectInputChange2,
    onSelectInputChange3,
    setSelectValue,
    setSelectValue2,
    setSelectValue3,
    selectValue,
    selectValue2,
    selectValue3,
    getAllCountries,
    getAllStates,
    getAllCities,
    countryOptions,
    stateOptions,
    cityOptions,
  } = useSyncUniversity({
    open,
    setOpen,
    getList,
    reset,
    defaultValues,
    pagination,
    permission,
  })

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
  }

  useEffect(() => {
    reset({ ...defaultValues })
    if (open && data) {
      const { id = "", name = "", abbreviation = "", add = {} } = data
      setValue("id", id)
      setValue("name", name)
      setValue("abbreviation", abbreviation)
      setValue("street", add.street)
      setValue("zipCode", add?.zipCode)
      if (add?.countryId && add?.countryNm) {
        setValue("countryId", add.countryId)
        setValue("countryNm", add.countryNm)
        setSelectValue([{ label: add.countryNm, value: add.countryId }])
      }
      if (add?.stateId && add?.stateNm) {
        setValue("stateId", add?.stateId)
        setValue("stateNm", add?.stateNm)
        setSelectValue2([{ label: add.stateNm, value: add.stateId }])
      }
      if (add?.cityId && add?.cityNm) {
        setValue("cityId", add?.cityId)
        setValue("cityNm", add?.cityNm)
        setSelectValue3([{ label: add.cityNm, value: add.cityId }])
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
          label="University Name *"
          placeholder="Enter University Name"
          rest={register("name")}
          error={errors?.name?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <Input
          label="Abbreviation *"
          placeholder="Enter Abbreviation"
          rest={register("abbreviation")}
          error={errors?.abbreviation?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />

        <div className="grid grid-cols-12 items-start gap-4">
          <div className="col-span-12">
            <Input
              label="Street *"
              placeholder="Enter Street"
              rest={register("street")}
              error={errors?.street?.message}
              disabled={loading}
              onKeyDown={(event) => onKeyDown(event)}
            />
          </div>
          <div className="col-span-6 flex items-end gap-3">
            <div className="w-full gap-2">
              <Dropdown
                isSearchable={false}
                placeholder="Select Country"
                className="w-full"
                label="Country *"
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
            </div>
          </div>
          <div className="col-span-6 flex items-end gap-3">
            <div className="w-full gap-2">
              <Dropdown
                placeholder="Select State"
                className="w-full"
                label="State *"
                id="StateId"
                isDisabled={loading}
                value={selectValue2}
                rest={register("stateId")}
                defaultOptions={stateOptions}
                loadOptions={getAllStates}
                onInputChange={onSelectInputChange2}
                onChange={(opt) => {
                  setValue("stateId", opt.value)
                  setValue("stateNm", opt.label)
                  clearErrors("stateId")
                }}
                error={errors?.stateId?.message}
                onKeyDown={(event) => onKeyDown(event)}
              />
            </div>
          </div>
          <div className="col-span-6 flex items-end gap-3">
            <div className="w-full gap-2">
              <Dropdown
                placeholder="Select City"
                className="w-full"
                label="City *"
                id="CityId"
                isDisabled={loading}
                value={selectValue3}
                rest={register("cityId")}
                defaultOptions={cityOptions}
                loadOptions={getAllCities}
                onInputChange={onSelectInputChange3}
                onChange={(opt) => {
                  setValue("cityId", opt.value)
                  setValue("cityNm", opt.label)
                  clearErrors("cityId")
                }}
                error={errors?.cityId?.message}
                onKeyDown={(event) => onKeyDown(event)}
              />
            </div>
          </div>
          <div className="col-span-6">
            <Input
              label="ZIP Code *"
              placeholder="Enter ZIP Code"
              rest={register("zipCode")}
              error={errors?.zipCode?.message}
              disabled={loading}
              onKeyDown={(event) => onKeyDown(event)}
            />
          </div>
        </div>
      </div>
    </DrawerWrapper>
  )
}

export default AddUniversity
