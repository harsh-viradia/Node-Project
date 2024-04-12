/* eslint-disable jsx-a11y/label-has-associated-control */
import CloseIcon from "icons/closeIcon"
import React, { useEffect, useRef, useState } from "react"
import { Calendar } from "react-date-range"
import { dateDisplay } from "utils/util"

import Input from "./input"
import OrbitLink from "./orbitLink"

const DateInput = ({
  date,
  label,
  placeholder = "Select Date",
  mandatory = false,
  setDate = () => false,
  minDate = "",
  disabled = false,
  popupAtTop = false,
  error,
  maxDate = "",
  format = "DD MMM YYYY",
  shownDate = "",
}) => {
  const [showDateRange, setShow] = useState(false)

  const wrapperReference = useRef(null)
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperReference.current && !wrapperReference.current.contains(event.target)) {
        setShow(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [wrapperReference])

  return (
    <div className="relative">
      {label && (
        <label className="inline-block mb-2 text-xs font-medium text-foreground">
          {label}
          {mandatory && <span className="text-red pl-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <OrbitLink onClick={() => setShow(!showDateRange)}>
          <Input
            disabled={disabled}
            type="text"
            value={`${dateDisplay(date, format)}`}
            placeholder={placeholder}
            readOnly
          />
        </OrbitLink>
        {date && !disabled ? (
          <OrbitLink
            className="absolute cursor-pointer right-[10px] bottom-[9px]"
            onClick={() => {
              setDate()
            }}
          >
            <CloseIcon className="text-gray-300  hover:text-dark-gray" />
          </OrbitLink>
        ) : (
          ""
        )}
      </div>
      {!disabled && showDateRange && (
        <div
          className={`absolute left-0 z-50 ${
            popupAtTop ? "bottom-full mb-1" : "top-full mt-1"
          } border border-light-gray rounded-lg overflow-hidden bg-white`}
          ref={wrapperReference}
        >
          <Calendar
            onChange={(value) => {
              setDate(value)
              setShow(!showDateRange)
            }}
            date={date || undefined}
            minDate={minDate || undefined}
            maxDate={maxDate || undefined}
            shownDate={shownDate || undefined}
          />
        </div>
      )}
      {error && <p className="mt-1 text-xs font-medium text-red">{error}</p>}
    </div>
  )
}

export default DateInput
