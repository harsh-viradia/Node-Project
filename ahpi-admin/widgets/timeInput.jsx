/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react"
import TimePicker from "react-time-picker-input"

const TimeInput = ({ time, key, onChange = () => {}, disabled = false }) => {
  return (
    <div className="text-left w-full">
      <TimePicker
        key={key}
        value={time}
        onChange={onChange}
        hour12Format
        manuallyDisplayDropdown
        fullTimeDropdown
        disabled={disabled}
      />
    </div>
  )
}

export default TimeInput
