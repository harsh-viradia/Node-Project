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
import { KEYS } from "utils/constant"
import { REGEX } from "utils/regex"
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
  const { process } = router.query

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
        setLoading(false)
        router.push({
          pathname: routes.login,
        })
        return false
      })
      .catch(() => {})
  }

  const handleOTPChange = async (otp) => {
    const regex = new RegExp("^[0-9]*$")
    if (regex.test(otp)) setOTPToVerify(otp)
    setValue("code", otp, { shouldValidate: true })
  }

  const handleResendOtp = async () => {
    const data = {
      email,
      process: process || "sign-up",
    }
    await commonApi({
      action: "forgotPassword",
      data,
    }).then(async ([error, Data]) => {
      if (error) return false
      const { message } = Data
      Toast(message)
      return false
    })
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
