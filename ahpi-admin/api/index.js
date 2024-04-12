import fetchUrl, { setAPIConfig } from "@knovator/api"
import getConfig from "next/config"
import routes from "utils/routes"
import Toast from "utils/toast"

import apiList from "./list"

const { publicRuntimeConfig } = getConfig()

const makeResponse = (response) => {
  const code = response.code || ""
  if (code === "ERROR") {
    Toast(response.message || "Oops, something went wrong !", "error")
  }
  return [undefined, response]
}

const makeError = (error) => {
  return [error || true, {}]
}

const handleError = (errorToast) => (error) => {
  const { status = "", data = {} } = error.response || {}
  if (status === 401) {
    localStorage.clear()
    fetch("/api/logout")
    window.location.href = routes.login
  }
  if (errorToast && status !== 403) Toast(data.message || "Oops, something went wrong !", "error")
}

const commonApi = async ({
  parameters = [],
  action,
  module = "",
  data,
  config = {},
  common = false,
  errorToast = true,
}) => {
  const api = common ? apiList.commonUrl(module)[action] : apiList[`${action}${module}`]
  const { token } = await fetch("/api/getToken").then((response) => response.json())

  if (api) {
    setAPIConfig({
      getToken: config?.token || token,
      onError: handleError(errorToast),
      tokenPrefix: "jwt",
    })
    return fetchUrl({
      type: api.method,
      url: api.url(...parameters),
      data,
      config: {
        headers: {
          ...config.headers,
        },
      },
    })
      .then((response) => {
        return makeResponse(response)
      })
      .catch((error) => {
        return makeError(error)
      })
  }
  return Promise.reject(new Error("Oops!, I guess its a wrong url."))
}

setAPIConfig({
  tokenPrefix: "jwt",
  baseUrl: `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}`,
})

export default commonApi
