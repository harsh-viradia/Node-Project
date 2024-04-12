/* eslint-disable no-undef */
/* eslint-disable promise/no-nesting */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-underscore-dangle */
import { yupResolver } from "@hookform/resolvers/yup"
import commonApi from "api/index"
import { useForm } from "react-hook-form"
import { loginSchema } from "schema/common"
import useSession from "shared/useSession"

const useLogin = () => {
  const { storeSessionData, loading, setLoading } = useSession()
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
    setLoading(true)

    commonApi({ action: "login", data: values })
      .then(([error, { data = "", message = "" }]) => {
        if (error) {
          setLoading(false)
          return false
        }

        storeSessionData({
          token: data,
          message,
        })
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
    setValue,
    watch,
  }
}
export default useLogin
