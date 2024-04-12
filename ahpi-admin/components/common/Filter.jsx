import React from "react"
import DrawerWrapper from "shared/drawer"
import { FILTER_OPTION } from "utils/constant"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"

const Filter = ({ openFilter, setOpenFilter, title = "Filter", filter, setFilter, handleApplyFilter, Component }) => {
  const closeModal = () => {
    setOpenFilter(false)
  }

  return (
    <DrawerWrapper
      title={title}
      modalFooter={
        <>
          <Button onClick={closeModal} title="Close" kind="dark-gray" hoverKind="white" />
          <Button onClick={handleApplyFilter} title={`Apply ${title}`} />
        </>
      }
      open={openFilter}
      setOpen={closeModal}
    >
      <div className="grid grid-cols-1 items-start gap-4">
        <Dropdown
          defaultOptions={FILTER_OPTION}
          label="Status"
          placeholder="Select Status"
          onChange={setFilter}
          value={filter}
          isClearable
          isSearch={false}
        />
        {Component && <Component />}
      </div>
    </DrawerWrapper>
  )
}

export default Filter
