/* eslint-disable unicorn/consistent-function-scoping */
import { yupResolver } from "@hookform/resolvers/yup"
import commonApi from "api"
import Router from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { changePasswordSchema } from "schema/common"
import checkPassword from "utils/checkPassword"
import { KEYS } from "utils/constant"
import { LocalStorage } from "utils/localStorage"
import { routes } from "utils/routes"
import Toast from "utils/toast"

const useNewPass = () => {
  const [numberCharacter, setNumberCharacter] = useState(false)
  const [upperAndLower, setUpperAndLower] = useState(false)
  const [numberOrSymbol, setNumberAndSymbol] = useState(false)
  const [loading, setLoading] = useState(false)

  const defaultValues = () => ({
    password: undefined,
    newPassword: undefined,
    confirmPassword: undefined,
  })
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(changePasswordSchema),
  })

  const onSubmit = async (values = {}) => {
    const payload = {
      password: values?.password,
      newPassword: values?.newPassword,
    }

    setLoading(true)

    commonApi({ action: "changePassword", data: payload })
      .then(({ message }) => {
        Router.push(routes.passwordChangeSuccessfully)
        LocalStorage.remove(KEYS.email)
        Toast(message)
        return false
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
  }

  useEffect(() => {
    const pass = watch("newPassword")
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
    onSubmit,
    register,
    errors,
    handleSubmit,
    handleKeyPress,
    setValue,
    numberCharacter,
    upperAndLower,
    numberOrSymbol,
    loading,
  }
}
export default useNewPass
