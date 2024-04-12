/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { userSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import { SPACE_REMOVE_REGEX } from "utils/constant"
import { capitalizeFirstLetter } from "utils/util"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"
import PhoneInput from "widgets/phoneInput"

import useSyncUser from "./hooks/useSyncUser"

const defaultValues = {
  id: undefined,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  countryCode: undefined,
  mobNo: undefined,
  roleId: undefined,
}

const AddUser = ({ open, setOpen, title = "Add User", getList, data, pagination, permission, rolesList }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(userSchema),
  })
  const { onSubmit, loading } = useSyncUser({
    open,
    setOpen,
    getList,
    reset,
    defaultValues,
    pagination,
    permission,
  })

  useEffect(() => {
    reset({ ...defaultValues })
    if (open && data) {
      setValue("id", data?._id)
      setValue("firstName", data?.firstName)
      setValue("lastName", data?.lastName)
      setValue("email", data?.email)
      setValue("countryCode", data?.countryCode)
      setValue("mobNo", data?.mobNo)
      setValue("roleId", data?.roles?.[0]?.roleId?._id)
      setValue("roleNm", data?.roles?.[0]?.roleId?.name)
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
          label="First Name"
          mandatory
          placeholder="Enter First Name"
          rest={register("firstName", {
            onChange: (event) => {
              setValue("firstName", capitalizeFirstLetter(event.target.value))
            },
          })}
          error={errors.firstName?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <Input
          label="Last Name"
          mandatory
          placeholder="Enter Last Name"
          rest={register("lastName", {
            onChange: (event) => {
              setValue("lastName", capitalizeFirstLetter(event.target.value))
            },
          })}
          error={errors.lastName?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <Input
          label="Email"
          mandatory
          placeholder="Enter Email"
          rest={register("email", {
            onChange: (event) => {
              setValue("email", event.target.value?.replace(SPACE_REMOVE_REGEX, "")?.toLowerCase())
            },
          })}
          error={errors.email?.message}
          disabled={getValues("id") || loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <PhoneInput
          label="Phone Number"
          placeholder="Enter Phone Number"
          mandatory
          type="number"
          rest={register("mobNo", {
            onChange: (event) => {
              if (event.target.value.length > 10) {
                event.target.value = event.target.value.slice(0, 10)
              }
              return event.target.value
            },
          })}
          error={errors?.mobNo?.message}
          countryCode={watch("countryCode")}
          setValue={setValue}
          disabled={watch("id") || loading}
        />
        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <Dropdown
              isClearable
              isDisabled={loading}
              placeholder="Select Role"
              className="w-full"
              label="Role"
              mandatory
              id="roleId"
              value={watch("roleId") ? { label: watch("roleNm"), value: watch("roleId") } : undefined}
              rest={register("roleId")}
              defaultOptions={rolesList}
              onChange={(opt) => {
                setValue("roleNm", opt?.label)
                setValue("roleId", opt?.value, { shouldValidate: true })
              }}
              onKeyDown={(event) => onKeyDown(event)}
              error={errors?.roleId?.message}
              isSearch={false}
            />
          </div>
        </div>
      </div>
    </DrawerWrapper>
  )
}

export default AddUser
