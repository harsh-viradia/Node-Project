/* eslint-disable jsx-a11y/label-has-associated-control */
import "react-date-range/dist/styles.css" // main style file
import "react-date-range/dist/theme/default.css" // theme css file

import dayjs from "dayjs"
import CloseIcon from "icons/closeIcon"
import React, { useEffect, useRef, useState } from "react"
import { DateRange } from "react-date-range"
import { dateDisplay } from "utils/util"

import Input from "./input"
import OrbitLink from "./orbitLink"

const DateRangeInput = ({
  label,
  error,
  placeholder = "Start Date - End Date",
  mandatory = false,
  startDate,
  endDate,
  isClear = true,
  setDateRange = () => {},
  format,
  selectMonth = false,
  className = "top-11 right-0",
  ...rest
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
            type="text"
            value={startDate ? `${dateDisplay(startDate, format)}-${dateDisplay(endDate, format)}` : ""}
            placeholder={placeholder}
            readOnly
          />
        </OrbitLink>
        {isClear && startDate ? (
          <OrbitLink
            className="absolute cursor-pointer right-[10px] bottom-[9px]"
            onClick={() => {
              setDateRange({
                startDate: undefined,
                endDate: undefined,
                key: "selection",
              })
            }}
          >
            <CloseIcon className="text-gray-300  hover:text-dark-gray" />
          </OrbitLink>
        ) : (
          ""
        )}
        {showDateRange && (
          <div
            className={`absolute z-50 border border-light-gray rounded-lg overflow-hidden ${className}`}
            ref={wrapperReference}
          >
            <DateRange
              className="rounded-lg overflow-hidden"
              ranges={[
                {
                  startDate: startDate || new Date(),
                  endDate: endDate || new Date(),
                  key: "selection",
                  showDateDisplay: false,
                },
              ]}
              onChange={(event_) => {
                if (selectMonth)
                  setDateRange([
                    new Date(event_.selection?.startDate).setDate(1),
                    new Date(event_.selection?.endDate).setDate(dayjs(event_.selection?.endDate).daysInMonth()),
                  ])
                else setDateRange([event_.selection?.startDate, event_.selection?.endDate])
              }}
              {...rest}
            />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red">{error}</p>}
    </div>
  )
}

export default DateRangeInput
