/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable unicorn/no-null */
import { hasAccessOf, hasAccessTo } from "@knovator/can"
import { deleteCookie } from "cookies-next"
import dayjs from "dayjs"
import Router from "next/router"

import { DATE_FORMAT, KEYS } from "./constant"
// eslint-disable-next-line import/no-cycle
import { getAllPermissions } from "./handleAuth"
import routes from "./routes"

export const isArray = (data) => data.constructor.name === "Array"

export const isObject = (data) => data.constructor.name === "Object"

export const isBoolean = (data) => data.constructor.name === "Boolean"

export const isString = (data) => data.constructor.name === "String"

export const handleCode = (value = "") => value?.replaceAll?.(/ /g, "_")?.toUpperCase()

export const handleNumber = (event) => {
  const element = event || window.event
  const charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    return element.preventDefault()
  }
  return true
}
export const logout = async () => {
  // LocalStorage.clean(KEYS.adminPermission)
  await fetch("/api/logout")
  Router.push(routes.login)
  localStorage.clear()
  deleteCookie(KEYS.forgetEmail)
  deleteCookie(KEYS.email)
  window.location.href = "/login"
}
const routeAccess = async (route) => {
  return hasAccessOf(await getAllPermissions(), route)
}

const componentAccess = async (route, task) => {
  return hasAccessTo(await getAllPermissions(), route, task)
}

export const joinString = (text) => {
  return text.replace(/ /g, "_")
}

export const addTitleSpace = (string_) => {
  return string_.split(/(?=[A-Z])/).join(" ")
}

export const capitalizeFirstLetter = (string = "") => `${string.charAt(0)?.toUpperCase()}${string?.slice(1)}`

export const codeValidation = (string = "") =>
  `${string
    .replace(/[^\s\w]/gi, "")
    ?.toUpperCase()
    ?.replace(" ", "_")}`

export const isEmpty = (input) => {
  const type = input?.constructor?.name
  if ([undefined, null].includes(input)) return true
  if (type === "Array") return input.length === 0
  if (type === "Number") return Number.isNaN(input)
  if (type === "Object") return Object.keys(input).length === 0
  if (type === "String") return input.trim().length === 0
  return false
}

export const dateDisplay = (date, format = DATE_FORMAT) => {
  return date ? dayjs(date).format(format) : ""
}

export const debounce = (callback, wait = 1000) => {
  let timeout

  return function executedFunction(...parameters) {
    const later = () => {
      clearTimeout(timeout)
      callback(...parameters)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default isEmpty

export { componentAccess, routeAccess }

export const checkEmptyStringInsideObject = (object) => {
  return Object.fromEntries(Object.entries(object).filter(([_, v]) => v !== ""))
}

export const removeNullAndUndefinedFromObj = (object) => {
  for (const propertyName in object) {
    if (object[propertyName] === null || object[propertyName] === undefined || object[propertyName] === "") {
      delete object[propertyName]
    }
  }
  return object
}
export const reorder = (list, startIndex, endIndex) => {
  const result = [...list]
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
export const getLastdayOfLastMonth = () => {
  const d = new Date()
  d.setDate(1)
  d.setHours(-1)
  return d
}

export const addToUrl = (key, value) => {
  const url = new URL(window.location)
  url.searchParams.set(key, value)
  if (!value && value !== 0 && value !== false) {
    url.searchParams.delete(key)
  }

  window.history.pushState({}, "", url)
  return url
}
