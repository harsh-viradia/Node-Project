/* eslint-disable simple-import-sort/imports */
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { getUserSchema } from "schema/common"
import LayoutWrapper from "shared/layout/wrapper"
import { SPACE_REMOVE_REGEX, SYSTEM_USERS } from "utils/constant"
import routes from "utils/routes"
import Button from "widgets/button"
import Input from "widgets/input"
import ChangePassword from "components/Profile/changePassword"
import useProfile from "components/Profile/hooks/useProfile"

const defaultValues = {
  id: undefined,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  companyNm: undefined,
}
const Profile = ({ permission = {}, user = {} }) => {
  const router = useRouter()

  const handleCancel = () => {
    router.push(routes.dashboard)
  }

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(getUserSchema(user?.role)),
  })

  const [loading2, setLoading2] = useState(false)
  const { loading, onEditDetails } = useProfile({ setValue, defaultValues, user, permission, setLoading2 })

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onEditDetails)()
    }
  }

  const handleEmailChange = (event) => {
    setValue("email", event.target.value.replace(SPACE_REMOVE_REGEX, ""))
  }

  return (
    <LayoutWrapper title="Profile" permission={permission} user={user} loading={loading}>
      <div className="p-4 border rounded-md border-primary-border bg-white">
        <p>Account Details</p>
        <div className="grid grid-cols-2 gap-3 mt-3 max-w-7xl">
          <Input
            label="First Name"
            placeholder="Enter First Name"
            mandatory
            rest={register("firstName")}
            error={errors?.firstName?.message}
            className="capitalize"
          />
          <Input
            label="Last Name"
            placeholder="Enter Last Name"
            mandatory={user?.role !== SYSTEM_USERS.INSTRUCTOR}
            rest={register("lastName")}
            error={errors?.lastName?.message}
            className="capitalize"
          />
          {user?.role === SYSTEM_USERS.INSTRUCTOR ? (
            <Input label="Company Name" placeholder="Enter Company Name" rest={register("companyNm")} />
          ) : (
            ""
          )}
          <Input
            label="Email"
            placeholder="Enter Email"
            rest={register("email", {
              onChange: (event) => {
                handleEmailChange(event)
              },
            })}
            error={errors.email?.message}
            disabled
            mandatory
            onKeyDown={(e) => onKeyDown(e)}
          />
          <div />
          <div className="flex items-center gap-3 justiy-center">
            <Button kind="dark-gray" hoverKind="white" title="Cancel" onClick={handleCancel} disabled={loading2} />
            <Button title="Save Changes" onClick={handleSubmit(onEditDetails)} loading={loading2} />
          </div>
        </div>
      </div>
      <ChangePassword email={watch("email")} />
    </LayoutWrapper>
  )
}

export default Profile
