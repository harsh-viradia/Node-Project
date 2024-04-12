/* eslint-disable no-undef */
/* eslint-disable promise/no-nesting */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-underscore-dangle */
import { yupResolver } from "@hookform/resolvers/yup"
import commonApi from "api/index"
import { setCookie } from "cookies-next"
import { add } from "date-fns"
import getConfig from "next/config"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { loginSchema } from "schema/common"
import useLoginWithOrbit from "shared/Header/hook/useLoginWithOrbit"
import { KEYS, USER_NOT_VERIFIED } from "utils/constant"
import { LocalStorage } from "utils/localStorage"
import routes from "utils/routes"
import Toast from "utils/toast"

const { publicRuntimeConfig } = getConfig()

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const { storeSessionData, loading: loader } = useLoginWithOrbit()
  const router = useRouter()
  const defaultValues = {
    email: undefined,
    password: undefined,
  }
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (values) => {
    const forgetEmail = {
      email: values.email,
      process: "sign-up",
    }

    setLoading(true)

    commonApi({ action: "login", data: values })
      .then(([error, Data]) => {
        const { data = "", message = "" } = Data

        if (error?.response?.status === USER_NOT_VERIFIED) {
          return commonApi({ action: "forgotPassword", data: forgetEmail }).then(() => {
            LocalStorage.set(
              KEYS.otpExpireTime,
              add(new Date(), { seconds: publicRuntimeConfig.NEXT_PUBLIC_OTP_EXPIRE_TIME })
            )
            router.push({
              pathname: routes.otp,
              query: { isverify: true },
            })
            setCookie(KEYS.email, values.email)
            return false
          })
        }

        if (message) {
          Toast(message)
          const newData = {
            token: data,
          }
          return storeSessionData(newData)
        }
        setLoading(false)
        return false
      })
      .catch(() => {})
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
  }

  return {
    onSubmit,
    register,
    errors,
    handleSubmit,
    handleKeyPress,
    loading,
    loader,
    setValue,
    watch,
  }
}
export default useLogin
