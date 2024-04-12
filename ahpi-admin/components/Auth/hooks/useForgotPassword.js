/* eslint-disable unicorn/consistent-function-scoping */
import { yupResolver } from "@hookform/resolvers/yup"
import commonApi from "api/index"
import { setCookie } from "cookies-next"
import add from "date-fns/add"
import getConfig from "next/config"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { emailSchema } from "schema/common"
import { KEYS } from "utils/constant"
import { LocalStorage } from "utils/localStorage"
import routes from "utils/routes"
import Toast from "utils/toast"

const { publicRuntimeConfig } = getConfig()

const useForgotPassword = () => {
  const defaultValues = {
    email: "",
  }
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(emailSchema),
  })

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (values) => {
    const email = values.email.toLowerCase()

    if (!email) return

    const data = {
      email,
      process: "reset-password",
    }

    setLoading(true)

    commonApi({ action: "forgotPassword", data })
      .then(([error, { message }]) => {
        if (error) {
          setLoading(false)
          return false
        }

        setCookie(KEYS.forgetEmail, email)
        LocalStorage.set(
          KEYS.otpExpireTime,
          add(new Date(), { seconds: publicRuntimeConfig.NEXT_PUBLIC_OTP_EXPIRE_TIME })
        )
        router.push(routes.resetPassword)
        Toast(message)
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
    setValue,
  }
}
export default useForgotPassword
