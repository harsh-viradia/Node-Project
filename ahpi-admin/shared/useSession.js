/* eslint-disable consistent-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable no-underscore-dangle */
import commonApi from "api/index"
import { setCookie } from "cookies-next"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import AppContext from "utils/appContext"
import { SYSTEM_USERS } from "utils/constant"
import routes from "utils/routes"
import Toast from "utils/toast"

const useSession = () => {
  const router = useRouter()
  const { userData, setUserData } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const getLoginDetails = async () => {
    try {
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
    const { token, message } = loginDetails
    setLoading(true)
    commonApi({
      action: "getProfile",
      config: { token },
    })
      .then(async ([error, response = {}]) => {
        if (error) {
          setLoading(false)
          return false
        }

        const { data = {} } = response
        if (data.roles?.[0]?.roleId?.code && data.roles?.[0]?.roleId?.code === SYSTEM_USERS.LEARNER) {
          Toast("You are not allowed to access this site.", "error")
          setLoading(false)
          return
        }
        Toast(message)
        const user = {
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName || ""} ${data?.lastName || ""}`,
          id: data._id,
          role: data.roles?.[0]?.roleId?.code,
          courseApproval: data.agreement?.isApproved,
          instructorLogo: data.roles?.[0]?.roleId?.code === SYSTEM_USERS.INSTRUCTOR ? data?.profileId?.uri : undefined,
        }

        await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            user,
          }),
        })
        setCookie("orbit-skills-admin", JSON.stringify(data.permissions))
        router.push(routes.dashboard)
        setLoading(false)

        return false
      })
      .catch(() => {})
  }

  useEffect(() => {
    getLoginDetails()
  }, [])

  return { userData, loading, setLoading, storeSessionData }
}

export default useSession
