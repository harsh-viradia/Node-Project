import commonApi from "api"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { SYSTEM_USERS } from "utils/constant"
import routes from "utils/routes"
import Toast from "utils/toast"
import { capitalizeFirstLetter } from "utils/util"

const useProfile = ({ setValue, defaultValues, setLoading2 }) => {
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getUser = async () => {
    // TODO change parameters id
    try {
      setLoading(true)
      await commonApi({ action: "getProfile" }).then(([, { data = {} }]) => {
        // eslint-disable-next-line no-underscore-dangle
        setUserData({ ...data, id: data?._id } || {})
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  const onEditDetails = async (values) => {
    setLoading2(true)
    // TODO Change payload for email
    const data = {
      firstName: capitalizeFirstLetter(values.firstName),
      lastName: capitalizeFirstLetter(values.lastName) || undefined,
      name: `${capitalizeFirstLetter(values.firstName)} ${capitalizeFirstLetter(values.lastName || "")}`,
      email: values.email,
      companyNm: values.companyNm || undefined,
    }
    await commonApi({
      action: "updateProfile",
      // TODO change parameters id
      parameters: [values.id],
      data,
    }).then(async ([error, { message = "" }]) => {
      setLoading2(false)
      if (error) return
      Toast(message, "success")
      // eslint-disable-next-line promise/no-nesting
      await fetch("/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          id: values.id,
          role: userData.roles?.[0]?.roleId?.code,
          courseApproval: userData.agreement?.isApproved,
          instructorLogo:
            userData.roles?.[0]?.roleId?.code === SYSTEM_USERS.INSTRUCTOR ? userData?.profileId?.uri : undefined,
        }),
      }).then(() => router.push(routes.profile))
      // eslint-disable-next-line consistent-return
      return false
    })
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    for (const [key, value] of Object.entries(defaultValues)) {
      setValue(key, userData?.[key] || value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  return {
    userData,
    loading,
    onEditDetails,
  }
}

export default useProfile
