/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import DeleteModal from "components/DeleteModal"
import CloseCircleIcon from "icons/closeCircleIcon"
import DeleteIcon from "icons/deleteIcon"
import DownloadIcon from "icons/downloadIcon"
import PdfIcon from "icons/pdfIcon"
import VerifyIcon from "icons/verifyIcon"
import Link from "next/link"
import React from "react"
import ReactTooltip from "react-tooltip"

const Attachment = ({ getValues = () => false, index, handleImageDel = () => false, open, setOpen = () => false }) => {
  return (
    <div className="p-4 bg-secondary rounded-lg text-xs flex justify-between items-center">
      <div className="flex items-center justify-center gap-3">
        <PdfIcon />
        <p
          className={`${
            !getValues(`data.${index}.documentId`)?.newUpload
              ? getValues(`data.${index}.documents`)?.[0]?.isVerified === false
                ? "text-red"
                : getValues(`data.${index}.documents`)?.[0]?.isVerified
                ? "text-green"
                : ""
              : ""
          } break-all cursor-pointer text-sm font-medium`}
        >
          {getValues(`data.${index}.documents`)?.[0]?.reason ? (
            <span className="hover:opacity-70" data-tip={getValues(`data.${index}.documents`)?.[0]?.reason}>
              {getValues(`data.${index}.documentId`)?.name}
            </span>
          ) : (
            <span className="hover:opacity-70">{getValues(`data.${index}.documentId`)?.name}</span>
          )}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 ml-3">
        <Link href="#">
          <a
            download={getValues(`data.${index}.documentId`)?.name}
            href={getValues(`data.${index}.documentId`)?.uri}
            target="_blank"
            rel="noreferrer"
          >
            <span data-tip="Click To View">
              <DownloadIcon fill="#2697FF" />
            </span>
          </a>
        </Link>
        {!getValues(`data.${index}.documentId`)?.newUpload && getValues(`data.${index}.documents`)?.[0]?.isVerified && (
          <span data-tip="Document Is Verified.">
            <VerifyIcon />
          </span>
        )}
        {!getValues(`data.${index}.documentId`)?.newUpload &&
          getValues(`data.${index}.documents`)?.[0]?.isVerified === false && (
            <span data-tip="Document Is Rejected.">
              <CloseCircleIcon />
            </span>
          )}
        {/* {!getValues(`data.${index}.documents`)?.[0]?.isVerified && ( */}
        <span className="cursor-pointer" data-tip="Click To Delete">
          <DeleteIcon size="14px" onClick={() => setOpen(true)} />
        </span>
        {/* )} */}
      </div>
      <ReactTooltip effect="solid" className="tooltips" multiline />
      <DeleteModal deleteModal={open} setDeleteModal={setOpen} handleConfirmation={handleImageDel} />
    </div>
  )
}

export default Attachment
