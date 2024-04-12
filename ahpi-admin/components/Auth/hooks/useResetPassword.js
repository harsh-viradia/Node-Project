/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/better-regex */
/* eslint-disable prefer-regex-literals */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import { yupResolver } from "@hookform/resolvers/yup"
import commonApi from "api/index"
import { deleteCookie, getCookie } from "cookies-next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { resetPasswordSchema } from "schema/common"
import checkPassword from "utils/checkPassword"
import { KEYS } from "utils/constant"
import routes from "utils/routes"
import Toast from "utils/toast"

const defaultValues = {
  password: undefined,
  confirmPassword: undefined,
}

const useResetPassword = () => {
  const {
    handleSubmit,
    register,
    getValues,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(resetPasswordSchema),
  })

  const email = getCookie(KEYS.forgetEmail)

  const router = useRouter()
  const [OTPToVerify, setOTPToVerify] = useState()
  const [loading, setLoading] = useState(false)
  const [numberCharacter, setNumberCharacter] = useState(false)
  const [upperAndLower, setUpperAndLower] = useState(false)
  const [numberOrSymbol, setNumberAndSymbol] = useState(false)

  const handleResetPassword = async (values) => {
    if (!email) return

    const data = {
      email,
      otp: OTPToVerify,
      newPassword: values?.password,
    }

    setLoading(true)

    commonApi({
      action: "resetPassword",
      data,
    })
      .then(async ([error, { message }]) => {
        if (error) {
          setLoading(false)
          return false
        }
        await Toast(message, "success")
        deleteCookie(KEYS.forgetEmail)
        deleteCookie(KEYS.email)
        router.push({
          pathname: routes.login,
        })
        setLoading(false)
        return false
      })
      .catch(() => {})
  }

  const handleOTPChange = async (otp) => {
    const regex = /^[0-9]*$/
    if (regex.test(otp)) setOTPToVerify(otp)
    setValue("code", otp, { shouldValidate: true })
  }

  const handleResendOtp = async () => {
    const data = {
      email,
      process: "sign-up",
    }
    await commonApi({
      action: "forgotPassword",
      data,
    })
      .then(async ([error, { message }]) => {
        if (error) return false
        Toast(message)
        return false
      })
      .catch(() => {})
  }

  const onKeyDown = (event) => {
    if (
      getValues("password") &&
      getValues("confirmPassword") &&
      OTPToVerify &&
      OTPToVerify.length === 6 &&
      event.key === "Enter"
    ) {
      handleSubmit(handleResetPassword)()
    }
  }

  useEffect(() => {
    const pass = watch("password")
    const complexityResults = checkPassword(pass)

    if (watch("confirmPassword")) {
      setValue("confirmPassword", watch("confirmPassword"), { shouldValidate: true })
    }

    setNumberCharacter(complexityResults.numberCharacter)
    setUpperAndLower(complexityResults.upperAndLower)
    setNumberAndSymbol(complexityResults.numberAndSymbol)
    if (!pass) {
      setNumberCharacter(false)
      setUpperAndLower(false)
      setNumberAndSymbol(false)
    }
  }, [watch("password")])

  return {
    handleOTPChange,
    OTPToVerify,
    handleResendOtp,
    register,
    errors,
    loading,
    handleSubmit,
    handleResetPassword,
    getValues,
    onKeyDown,
    numberCharacter,
    upperAndLower,
    numberOrSymbol,
    setOTPToVerify,
    reset,
  }
}

export default useResetPassword
