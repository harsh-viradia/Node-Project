/* eslint-disable promise/always-return */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-underscore-dangle */
import * as amplitude from "@amplitude/analytics-browser"
import { yupResolver } from "@hookform/resolvers/yup"
import commonApi from "api/index"
import useTranslation from "next-translate/useTranslation"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { profileSchema } from "schema/common"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT, DESIGNATION_TYPE } from "utils/constant"
import Toast from "utils/toast"

const defaultValues = {
  id: undefined,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  mobNo: undefined,
  university: undefined,
  course: undefined,
  organization: undefined,
  profession: undefined,
}

const useProfileSetting = () => {
  const [image, setImage] = useState()
  const [loading, setLoading] = useState()
  const { userData = {}, setUserData } = useContext(AppContext)
  const [role, setRole] = useState("")
  const { t } = useTranslation("profileSetting")
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors = {} },
    watch,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(profileSchema(t, role)),
  })

  const handleChange = (key, value) => {
    return value && setValue(key, value)
  }

  const onSubmit = async (values) => {
    const { university, organization, course, profession, firstName, lastName, id, designation: Designation } = values

    const designation = { state: Designation.value }

    if (Designation.label === "Student") {
      designation.place = university
      designation.department = course
    } else {
      designation.place = organization
      designation.department = profession
    }

    setLoading(true)
    const payload = {
      firstName,
      lastName,
      designation,
      profileId: image?._id || undefined,
    }
    try {
      await commonApi({ action: "userUpdateProfile", data: payload, parameters: [id] }).then(
        async ([error, response]) => {
          if (!error) {
            const { data, message } = response
            Toast(message)
            const sessionData = {
              ...userData,
              firstName: data.firstName,
              lastName: data?.lastName,
              name: `${data.firstName || ""} ${data?.lastName || ""}`,
              id: data?._id,
              email: data.email,
              isLogin: true,
              profileId: data.profileId,
              mobNo: data.mobNo,
              designation: data?.designation,
            }
            // eslint-disable-next-line promise/no-nesting
            await fetch("/api/updateUser", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(sessionData),
            }).then(() => {
              setUserData(sessionData)
              amplitude.track(ANALYTICS_EVENT.EDIT_PROFILE, {
                email: userData?.email,
                userId: userData?.id,
              })
              setLoading(false)
              if (Designation.label === "Student") {
                setValue("organization", "")
                setValue("profession", "")
              } else {
                setValue("course", "")
                setValue("university", "")
              }

              // setImage(data.profileId)
              // setValue("firstName", data.firstName)
              // setValue("lastName", data.lastName)
              // setValue("id", data._id)
              // setValue("email", data.email)
              // setValue("mobNo", data.mobNo)
              return false
            })
          }
        }
      )
    } finally {
      setLoading(false)
    }
    return false
  }

  useEffect(() => {
    setImage(userData.profileId)
    setValue("firstName", userData.firstName)
    setValue("id", userData.id)
    setValue("lastName", userData?.lastName)
    setValue("email", userData.email)
    setValue("mobNo", userData.mobNo)
    if (userData?.designation) {
      switch (userData.designation?.state?.code) {
        case DESIGNATION_TYPE.PROFESSION: {
          setValue("organization", userData.designation.place)
          setValue("profession", userData.designation.department)
          break
        }
        case DESIGNATION_TYPE.STUDENT: {
          setValue("university", userData.designation.place)
          setValue("course", userData.designation.department)
          break
        }
        default: {
          break
        }
      }
      setValue("designation", {
        label: userData.designation?.state?.name,
        value: userData.designation?.state?._id,
      })
    }
  }, [userData])

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    image,
    setImage,
    loading,
    setRole,
    role,
    clearErrors,
    setValue,
    handleChange,
    watch,
  }
}

export default useProfileSetting
