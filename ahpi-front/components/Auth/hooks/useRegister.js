/* eslint-disable promise/no-nesting */
import { yupResolver } from "@hookform/resolvers/yup"
import commonApi from "api/index"
import { setCookie } from "cookies-next"
import add from "date-fns/add"
import getConfig from "next/config"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { registerSchema } from "schema/common"
import checkPassword from "utils/checkPassword"
import { KEYS } from "utils/constant"
import { LocalStorage } from "utils/localStorage"
import routes from "utils/routes"
import Toast from "utils/toast"

const { publicRuntimeConfig } = getConfig()

const defaultValues = {
  firstName: undefined,
  lastName: undefined,
  mobNo: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
  university: undefined,
  course: undefined,
  organization: undefined,
  profession: undefined,
}

const useRegister = () => {
  const [loading, setLoading] = useState(false)
  const [numberCharacter, setNumberCharacter] = useState(false)
  const [upperAndLower, setUpperAndLower] = useState(false)
  const [numberOrSymbol, setNumberAndSymbol] = useState(false)
  const [role, setRole] = useState("")
  const router = useRouter()

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(registerSchema(role)),
  })

  const onSubmit = async (values) => {
    const {
      confirmPassword,
      password: pas,
      designation: Designation,
      course,
      university,
      organization,
      profession,
      ...data
    } = values
    const payload = {
      ...data,
      passwords: {
        pass: pas,
      },
      designation: {
        // eslint-disable-next-line no-underscore-dangle
        state: Designation?._id,
        place: university || organization,
        department: course || profession,
      },
    }
    await commonApi({
      action: "registration",
      data: payload,
    })
      .then(async ([error, { message = "" }]) => {
        if (error) {
          setLoading(false)
          return false
        }

        setCookie(KEYS.email, values.email)
        LocalStorage.set(
          KEYS.otpExpireTime,
          add(new Date(), { seconds: publicRuntimeConfig.NEXT_PUBLIC_OTP_EXPIRE_TIME })
        )
        Toast(message)
        router.push({
          pathname: routes.otp,
          query: { isverify: true },
        })
        reset({ ...defaultValues })
        return false
      })
      .catch(() => {})
  }

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
  }

  useEffect(() => {
    setValue("course", "")
    setValue("university", "")
    setValue("organization", "")
    setValue("profession", "")
  }, [role])

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
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    loading,
    defaultValues,
    onSubmit,
    numberCharacter,
    upperAndLower,
    numberOrSymbol,
    onKeyDown,
    setRole,
    role,
    getValues,
    clearErrors,
  }
}

export default useRegister
