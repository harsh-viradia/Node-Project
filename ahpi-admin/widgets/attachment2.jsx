/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import DeleteModal from "components/DeleteModal"
import DeleteIcon from "icons/deleteIcon"
import DownloadIcon from "icons/downloadIcon"
import PdfIcon from "icons/pdfIcon"
import Link from "next/link"
import React from "react"
import ReactTooltip from "react-tooltip"

const Attachment2 = ({ docDetails = {}, handleImageDel = () => false, open, setOpen = () => false }) => {
  return (
    <div className="p-4 bg-secondary rounded-lg text-xs flex justify-between items-center">
      <div className="flex items-center justify-center gap-3">
        <PdfIcon />
        <p className="break-all cursor-pointer text-sm font-medium">
          <span className="hover:opacity-70">{docDetails?.oriNm}</span>
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 ml-3">
        <Link href="#">
          <a download href={docDetails.uri} target="_blank" rel="noreferrer">
            <span data-tip="Click To View">
              <DownloadIcon fill="#2697FF" />
            </span>
          </a>
        </Link>
        <span className="cursor-pointer" data-tip="Click To Delete">
          <DeleteIcon size="14px" className="text-red" onClick={() => setOpen(true)} />
        </span>
      </div>
      <ReactTooltip effect="solid" className="tooltips" multiline />
      <DeleteModal deleteModal={open} setDeleteModal={setOpen} handleConfirmation={handleImageDel} />
    </div>
  )
}

export default Attachment2
