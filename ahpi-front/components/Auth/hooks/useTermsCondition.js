/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable camelcase */
import commonApi from "api"
import Router from "next/router"
import { useState } from "react"
import { routes } from "utils/routes"
import Toast from "utils/toast"

const useTermsCondition = () => {
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    setLoading(true)
    await fetch("/api/getRegisterData")
      .then((response) => response.json())
      .then(async ({ data = {} }) => {
        const response = await commonApi({ action: "employerCreate", data })
        if (response.code === "SUCCESS") {
          Router.push(routes.otp)
          Toast(response.message)
          setLoading(false)
        }
        return false
      })
      .finally(() => setLoading(false))
  }

  const handleDecline = () => {
    Router.push(routes.register)
  }

  return {
    loading,
    handleAccept,
    handleDecline,
  }
}

export default useTermsCondition
