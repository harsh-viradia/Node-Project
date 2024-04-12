/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react"
import CreatableSelect from "react-select/creatable"

const Creatable = ({
  label = "",
  className = "",
  id,
  value,
  placeholder,
  defaultOptions,
  onChange = () => false,
  loadOptions,
  onCreateOption = () => false,
  onInputChange = () => false,
  ...other
}) => {
  return (
    <>
      <label className="text-xs mb-2 inline-block text-foreground">{label}</label>
      <div className={className}>
        <CreatableSelect
          isSearchable
          isClearable
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          onCreateOption={onCreateOption}
          onInputChange={onInputChange}
          options={loadOptions}
          defaultOptions={defaultOptions}
          {...other}
        />
      </div>
    </>
  )
}

export default Creatable
