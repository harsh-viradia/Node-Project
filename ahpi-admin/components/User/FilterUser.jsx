import { hasAccessTo } from "@knovator/can"
import React from "react"
import DrawerWrapper from "shared/drawer"
import { FILTER_OPTION, MODULE_ACTIONS, MODULES } from "utils/constant"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"

const FilterUser = ({
  open,
  setOpen,
  title = "Filter",
  permission,
  userData,
  getUsersList,
  userId,
  setUserId,
  loading,
  activeFilter,
  setActiveFilter,
  applyFilter,
}) => {
  const closeModal = () => {
    setOpen(false)
  }

  return (
    <DrawerWrapper
      title={title}
      modalFooter={
        <>
          <Button onClick={() => closeModal()} title="Close" kind="dark-gray" hoverKind="white" disabled={loading} />
          <Button onClick={() => applyFilter()} title={`Apply ${title}`} loading={loading} />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid grid-cols-1 items-start gap-4">
        <Dropdown
          isClearable
          isSearchable={hasAccessTo(permission, MODULES.ROLE, MODULE_ACTIONS.GETALL)}
          placeholder="Search Role"
          label="Role"
          id="selectRole"
          className="w-full"
          defaultOptions={userData}
          loadOptions={getUsersList}
          value={userId}
          onChange={(opt) => {
            setUserId(opt)
          }}
          isDisabled={loading}
          isSearch={false}
        />
        <Dropdown
          isDisabled={loading}
          isClearable
          isSearchable={false}
          placeholder="Select Status"
          className="w-full"
          id="status"
          label="Status"
          value={activeFilter}
          defaultOptions={FILTER_OPTION}
          onChange={(opt) => {
            setActiveFilter(opt)
          }}
          isSearch={false}
        />
      </div>
    </DrawerWrapper>
  )
}

export default FilterUser
