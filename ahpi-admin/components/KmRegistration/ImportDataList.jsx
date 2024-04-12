/* eslint-disable sonarjs/no-duplicate-string */
import Table from "hook/table/useTable"
import React from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import OrbitLoader from "widgets/loader"

import ignoreColumn from "./ignoreColumn"

const ImportDataList = ({ open, setOpen, title, applicantsList, setApplicantsList, loading2 }) => {
  const closeModal = () => {
    setOpen(false)
    setApplicantsList([])
  }

  return (
    <DrawerWrapper
      title={`${title} (${applicantsList?.length})`}
      modalFooter={<Button onClick={() => closeModal()} title="Close" kind="dark-gray" hoverKind="white" />}
      open={open}
      setOpen={closeModal}
      width="max-w-2xl"
    >
      <div className="flex flex-col gap-0.5">
        {loading2 && <OrbitLoader />}
        <Table showPagination={false} columns={ignoreColumn({ title })} data={applicantsList} />
      </div>
    </DrawerWrapper>
  )
}

export default ImportDataList
