/* eslint-disable unicorn/no-null */
import "dayjs/locale/id"

import dayjs from "dayjs"
import LevelIcon from "icons/levelIcon"
import React from "react"

const getImgUrl = (uri) => {
  return uri ? `${uri}` : ""
}

export const dateDisplay = (date) => {
  return dayjs(date).format("DD MMM YYYY")
}

export const fullDateTimeFormat = (date) => {
  return dayjs(date).format("DD MMM YYYY hh:mm A")
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
export const convertFloat = (number, precise = 2) => {
  return number ? Number.parseFloat(number).toFixed(precise) : 0
}
const LEVEL_COLOR_CLASSNAMES = {
  EASY: " text-green",
  MEDIUM: "text-yellow",
  DIFFICULT: "text-red",
  ALL_LEVEL: "text-primary",
  ADVANCED: "text-red",
}
export const getLevel = (name, code, showIcon = true) => {
  return name ? (
    <div className={`flex items-center gap-2 ${LEVEL_COLOR_CLASSNAMES[code] || "text-dark-gray"}`}>
      {showIcon && <LevelIcon />} {name}
    </div>
  ) : undefined
}

export const convertCurrency = (amount, languageTranslater = () => "Free", showNumberIfAmount0 = true) => {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number.isNaN(amount) ? 0 : amount)

  if (amount?.toString() === "0") {
    return showNumberIfAmount0 ? `Rp${formattedAmount.slice(3)}` : languageTranslater("freeCourse")
  }

  return `Rp${formattedAmount.slice(3)}`
}

const convert = (x) => {
  return x < 10 ? `0${x}` : x
}
export const getTimeFromSecond = (seconds) => {
  return `${convert(Number.parseInt(seconds / (60 * 60), 10))}:${convert(
    Number.parseInt((seconds / 60) % 60, 10)
  )}:${convert(Number.parseInt(seconds % 60, 10))}`
}
export default getImgUrl

export const eventTrack = (category, action, label) => {
  window.gtag?.("event", action, {
    event_category: category,
    event_label: label,
  })
}
