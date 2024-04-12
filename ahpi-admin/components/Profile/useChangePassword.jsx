/* eslint-disable no-unused-expressions */
/* eslint-disable promise/always-return */
import { yupResolver } from "@hookform/resolvers/yup"
import commonApi from "api"
// import getConfig from "next/config"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { changePasswordSchema } from "schema/common"
import checkPassword from "utils/checkPassword"
import Toast from "utils/toast"
import { logout } from "utils/util"

const defaultValues = {
  currentPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined,
}

const useChangePassword = ({ email }) => {
  const [loading, setLoading] = useState()
  const [numberCharacter, setNumberCharacter] = useState(false)
  const [upperAndLower, setUpperAndLower] = useState(false)
  const [numberOrSymbol, setNumberAndSymbol] = useState(false)
  // const { publicRuntimeConfig } = getConfig()
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
      email,
      oldPassword: values?.currentPassword,
      newPassword: values?.newPassword,
      // redirectUrl: publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL,
    }
    try {
      setLoading(true)
      await commonApi({
        action: "changePassword",
        data: payload,
        config: {
          headers: { lng: "en" },
        },
      }).then(async ([error, { code, message = "" }]) => {
        if (error) return false
        if (code === "SUCCESS") {
          reset()
          Toast(message, "success")
          logout()
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
    const complexityResults = checkPassword(pass)
    setNumberCharacter(complexityResults.numberCharacter)
    setUpperAndLower(complexityResults.upperAndLower)
    setNumberAndSymbol(complexityResults.numberAndSymbol)

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
    numberCharacter,
    upperAndLower,
    numberOrSymbol,
    reset,
    trigger,
  }
}

export default useChangePassword
