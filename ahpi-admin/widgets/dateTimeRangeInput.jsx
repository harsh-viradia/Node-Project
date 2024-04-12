import "react-time-picker-input/dist/components/TimeInput.css"

import React from "react"

import DateInput from "./dateInput"
import TimeInput from "./timeInput"

const DateTimeRangeInput = ({
  startDate,
  endDate,
  mandatory,
  setStartDate = () => {},
  setEndDate = () => {},
  label,
  startError,
  endError,
  minDate,
  startDatePlaceholder = "Select Start Date",
  endDatePlaceholder = "Select End Date",
  disabled = false,
  setStartTime,
  setEndTime,
  startTime,
  endTime,
}) => {
  return (
    <div className="relative">
      {label && (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label className="inline-block mb-2 text-xs font-medium text-foreground">
          {label}
          {mandatory && <span className="text-red pl-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="flex flex-wrap gap-2">
          <div className="grid grid-cols-12 w-full gap-2">
            <div className="col-span-7">
              <DateInput
                date={startDate || undefined}
                setDate={setStartDate}
                error={startError}
                disabled={disabled}
                placeholder={startDatePlaceholder}
                minDate={minDate || undefined}
                maxDate={endDate || undefined}
              />
            </div>
            <div className="col-span-5">
              <TimeInput time={startTime} disabled={disabled} key="startDate" onChange={setStartTime} />
            </div>
          </div>
          <div className="grid grid-cols-12 w-full gap-2 ">
            <div className="col-span-7">
              <DateInput
                date={endDate || undefined}
                setDate={setEndDate}
                error={endError}
                minDate={startDate || minDate || undefined}
                placeholder={endDatePlaceholder}
                disabled={disabled || undefined}
              />
            </div>
            <div className="col-span-5">
              <TimeInput time={endTime} onChange={setEndTime} disabled={disabled} key="endDate" />
            </div>
          </div>
          <span className="date-range_arrow" />
        </div>
      </div>
    </div>
  )
}

export default DateTimeRangeInput
