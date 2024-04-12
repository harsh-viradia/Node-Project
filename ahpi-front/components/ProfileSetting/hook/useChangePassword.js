/* eslint-disable prettier/prettier */
import * as amplitude from "@amplitude/analytics-browser"
import { yupResolver } from "@hookform/resolvers/yup"
import commonApi from "api/index"
import { getCookie } from "cookies-next"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import AppContext from "utils/AppContext"
import handleLogout from "utils/common"
import { ANALYTICS_EVENT, API_SUCCESS } from "utils/constant"
import { REGEX } from "utils/regex"

import { changePasswordSchema } from "../../../schema/common"
import Toast from "../../../utils/toast"

const defaultValues = {
  currentPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined,
}

const useChangePassword = () => {
  const [loading, setLoading] = useState(false)
  const [numberCharacter, setNumberCharacter] = useState(false)
  const [upperAndLower, setUpperAndLower] = useState(false)
  const [numberOrSymbol, setNumberAndSymbol] = useState(false)
  const deviceId = getCookie("deviceToken")

  const { userData } = useContext(AppContext)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    trigger,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(changePasswordSchema),
  })

  const onSubmit = async (values) => {
    const payload = {
      email: userData.email,
      oldPassword: values?.currentPassword,
      newPassword: values?.newPassword,
    }
    setLoading(true)
    try {
      await commonApi({ action: "changePassword", data: payload }).then(async (response) => {
        if (response[0]?.Error) {
          Toast(response[0].Error.response?.data?.message)
          setLoading(false)
        } else if (response[1]?.code === API_SUCCESS.OK) {
          Toast(response[1]?.message)
          amplitude.track(ANALYTICS_EVENT.CHANGE_PASSWORD, {
            userEmail: userData?.email,
            userId: userData?.id,
            deviceId,
          })
          await handleLogout()
          reset()
          setLoading(false)
        }
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const pass = watch("newPassword")
    if (watch("confirmPassword")) {
      setValue("confirmPassword", watch("confirmPassword"), { shouldValidate: true })
    }
    if (REGEX.EIGHTCHAR.test(pass)) {
      setNumberCharacter(true)
    } else {
      setNumberCharacter(false)
    }

    if (REGEX.UPPER_LOWER.test(pass)) {
      setUpperAndLower(true)
    } else {
      setUpperAndLower(false)
    }

    if (REGEX.NUMBER_SPECIALCHAR.test(pass)) {
      setNumberAndSymbol(true)
    } else {
      setNumberAndSymbol(false)
    }

    if (!pass) {
      setNumberCharacter(false)
      setUpperAndLower(false)
      setNumberAndSymbol(false)
    }
  }, [watch("newPassword")])

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    loading,
    control,
    setValue,
    watch,
    trigger,
    numberCharacter,
    upperAndLower,
    numberOrSymbol,
  }
}

export default useChangePassword
