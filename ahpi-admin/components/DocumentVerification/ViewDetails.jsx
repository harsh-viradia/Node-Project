/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-unused-vars */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from "react"
import DrawerWrapper from "shared/drawer"
import Toast from "utils/toast"
import Button from "widgets/button"
import Textarea from "widgets/textarea"

import useVerifyDocument from "./hooks/useVerifyDocument"

const ViewDetails = ({ open, setOpen, userDetails = {}, getList, pagination }) => {
  const { onSubmit, closeModal, documentDetails, setReason, loading, reason, paginate, documentList } =
    useVerifyDocument({
      userDetails,
      setOpen,
      getList,
      pagination,
    })

  useEffect(() => {
    setReason(documentDetails?.reason)
  }, [documentDetails])

  return (
    <DrawerWrapper
      title={`${paginate + 1}. ${documentDetails?.fileId?.[0]?.name}` || "Document Verification"}
      width="max-w-2xl"
      modalFooter={<Button onClick={() => closeModal()} title="Close" kind="dark-gray" hoverKind="white" />}
      open={open}
      setOpen={closeModal}
    >
      <div className="flex flex-col h-full gap-4 ">
        <div className="flex-1 ">
          {documentDetails?.fileId?.[0]?.uri.split(".").pop() === "doc" ||
          documentDetails?.fileId?.[0]?.uri.split(".").pop() === "docx" ? (
            <iframe
              className="w-full modal-view"
              title={documentDetails?.fileId?.[0]?.name}
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${documentDetails?.fileId?.[0]?.uri}`}
              width="100%"
              height="100%"
              frameBorder="0"
            />
          ) : (
            <iframe
              title={documentDetails?.fileId?.[0]?.name}
              src={documentDetails?.fileId?.[0]?.uri}
              width="100%"
              height="100%"
            />
          )}
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Textarea
            label="Reason"
            className="w-full"
            onChange={(event) => setReason(event.target.value)}
            disabled={loading}
            value={reason || ""}
          />
          <div className="flex justify-end gap-4">
            <Button
              title={`Reject${
                documentList?.length > paginate + 1 ? ` and Next ${documentList?.length - (paginate + 1)}` : ""
              }`}
              kind="dark-gray"
              hoverKind="white"
              onClick={() => (reason ? onSubmit(false) : Toast("Reason is required.", "error"))}
              loading={loading}
            />
            <Button
              title={`Verify${
                documentList?.length > paginate + 1 ? ` and Next ${documentList?.length - (paginate + 1)}` : ""
              }`}
              loading={loading}
              onClick={() => onSubmit(true)}
            />
          </div>
        </div>
      </div>
    </DrawerWrapper>
  )
}

export default ViewDetails
