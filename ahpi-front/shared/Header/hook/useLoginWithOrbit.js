/* eslint-disable consistent-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable no-underscore-dangle */
import * as amplitude from "@amplitude/analytics-browser"
import commonApi from "api/index"
import { getCookie, setCookie } from "cookies-next"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT } from "utils/constant"
import routes from "utils/routes"

const updateDeviceToken = async (id, callback = () => {}) => {
  await commonApi({
    action: "userUpdateProfile",
    data: {
      deviceToken: getCookie("deviceToken") || undefined,
      fcmToken: getCookie("fcmToken") || undefined,
    },
    parameters: [id],
  })
  await callback()
}

const useLoginWithOrbit = () => {
  const router = useRouter()
  const { userData, setUserData } = useContext(AppContext)
  const [loading, setLoading] = useState(true)
  const getLoginDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/getSession")
      const { data = {} } = await response.json()
      if (data.id) {
        setUserData(data)
      } else setUserData()
    } catch (error) {
      console.error("Error while fetching session data:", error)
    } finally {
      setLoading(false)
    }
  }

  const storeSessionData = async (loginDetails) => {
    const { token } = loginDetails
    const deviceId = getCookie("deviceToken")

    commonApi({
      action: "getProfile",
      config: { token },
    })
      .then(async ([error, response = {}]) => {
        if (error) return false

        const { data = {} } = response
        const user = {
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName || ""} ${data.lastName || ""}`,
          id: data?._id,
          email: data.email,
          mobNo: data.mobNo,
          isLogin: true,
          profileId: data.profileId,
          address: data.address,
          designation: data?.designation,
        }
        amplitude.track(ANALYTICS_EVENT.LOGIN, {
          userEmail: user.email,
          userId: user.id,
          deviceId,
        })

        await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            user,
            permission: data.permissions,
          }),
        })
        const redirectURL = localStorage.getItem("redirectFromLogin")
        if (redirectURL) {
          localStorage.removeItem("redirectFromLogin")
          router.push(redirectURL)
        } else router.push(routes.home)
        setCookie("token", token)
        setUserData(user)
        await updateDeviceToken(data?._id)
        return false
      })
      .catch(() => {})
  }

  useEffect(() => {
    getLoginDetails()
  }, [])

  return { userData, loading, storeSessionData, setLoading }
}

export default useLoginWithOrbit
