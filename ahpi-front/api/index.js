import fetchUrl, { setAPIConfig } from "@knovator/api"
import { getCookie } from "cookies-next"
import getConfig from "next/config"
import getT from "next-translate/getT"
import handleLogout from "utils/common"
import Toast from "utils/toast"

import { apiGuestList, apiList } from "./list"

const { publicRuntimeConfig } = getConfig()

const makeResponse = (response, commonError) => {
  const code = response.code || ""
  if (code === "ERROR") {
    Toast(response.message || commonError, "error")
  }
  const error = undefined
  return [error, response || {}]
}
const makeError = (error, notShowToast) => {
  return [error || true, {}, notShowToast]
}

const handleError = (error = {}, commonError = "", logoutOnExpire = true) => {
  const { status = "", data = {} } = error.response || {}
  if ((status === 401 || error.noToken) && logoutOnExpire) {
    handleLogout()
  }

  if (data?.data?.statusCode === "2023") {
    return
  }

  if (!error.noToken) Toast(data.message || commonError, "error", { id: "ERROR" })
}

const commonApi = async ({ parameters = [], action, data, config = {}, logoutOnExpire = true }) => {
  const token = config?.token || getCookie("token")
  const lng = "en"
  const t = await getT(lng, "common")
  const api = token ? apiList[`${action}`] : apiGuestList[`${action}`]
  if (api) {
    setAPIConfig({
      getToken: token,
      onError: (error) => handleError(error, t("commonError"), logoutOnExpire),
    })
    return fetchUrl({
      type: api.method,
      url: `${api.noPrefix ? "" : "web/api/v1/"}${api.url(...parameters)}`,
      data,
      config: {
        headers: {
          ...config.headers,
          lng,
        },
      },
    })
      .then((response) => {
        return makeResponse(response, t("commonError"))
      })
      .catch((error) => {
        return makeError(error)
      })
  }
  return handleError({ noToken: true }, t("commonError"))
}

setAPIConfig({
  tokenPrefix: "jwt",
  baseUrl: `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}`,
})

export default commonApi
