/* eslint-disable sonarjs/no-nested-template-literals */
const hourFormat = (duration) => {
  const dur = Number(duration)
  const hour = Math.floor((dur % 3600) / 60)
  const minutes = Math.floor((dur % 3600) % 60)
  return `${hour.toString().length === 1 ? `0${hour}` : hour}:${
    minutes.toString().length === 1 ? `0${minutes}` : minutes
  }:00`
}

const integerFormat = (duration) => {
  const dur = duration.split(":")
  return +dur[0] * 60 + +dur[1]
}

const inputClass =
  "otp-input flex items-center justify-center gap-4 w-10 h-10 font-bold text-center rounded-lg outline-none border border-light-gray focus:border-primary text-primary"

const decimalValue = (value) => {
  return value ? (Number.isInteger(value) ? value : Number.parseFloat(value).toFixed(2)) : 0
}
module.exports = {
  hourFormat,
  integerFormat,
  inputClass,
  decimalValue,
}
