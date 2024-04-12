/* eslint-disable react-hooks/rules-of-hooks */
import commonApi from "api/index"
import { deleteCookie, getCookie, setCookie } from "cookies-next"
import getConfig from "next/config"
import { v4 as uuidv4 } from "uuid"

import { KEYS } from "./constant"

const { publicRuntimeConfig } = getConfig()
export const setDeviceId = () => {
  const uuid = uuidv4()
  setCookie("deviceToken", `${uuid}`)
}

const handleLogout = async () => {
  await fetch(`${publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL}/api/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  await commonApi({
    action: "logout",
    data: {
      deviceToken: getCookie("deviceToken") || undefined,
      fcmToken: getCookie("fcmToken") || undefined,
    },
    logoutOnExpire: false,
  })
  deleteCookie("token")
  deleteCookie("fcmToken")
  deleteCookie("deviceToken")
  deleteCookie(KEYS.email)
  deleteCookie(KEYS.forgetEmail)
  if (typeof window !== "undefined") window.location.href = ""
}

export default handleLogout
