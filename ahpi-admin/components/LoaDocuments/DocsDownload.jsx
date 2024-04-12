/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/prevent-abbreviations */
import DownloadIcon from "icons/downloadIcon"
import PdfIcon from "icons/pdfIcon"
import getConfig from "next/config"
import qs from "qs"
import React from "react"
import ReactTooltip from "react-tooltip"
import OrbitLoader from "widgets/loader"
import OrbitLink from "widgets/orbitLink"

const { publicRuntimeConfig } = getConfig()

const DocsDownload = ({ documentsList, loading, courseValue }) => {
  const downloadZip = (id) => {
    const payload = {
      courseId: courseValue?.value,
      documentId: id,
    }
    window.open(
      `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/admin/loa/document-export?${qs.stringify(payload)}`,
      "_blank"
    )
  }

  return (
    <div className="loa-box-height overflow-auto overflow-x-hidden bg-white border rounded-lg border-thin-gray">
      <h2 className="text-md font-semibold text-black border-b border-thin-gray py-4 px-5">Download Documents</h2>
      <div className="grid grid-cols-1 gap-4 p-4 relative">
        {loading && <OrbitLoader relative />}
        {courseValue && documentsList?.length ? (
          documentsList?.map((x) => (
            <div className="p-4 bg-secondary rounded-lg text-xs flex justify-between items-center">
              <div className="flex items-center justify-center gap-3">
                <PdfIcon />
                <p className=" text-sm font-medium break-all">{x.name}</p>
              </div>
              <div className="flex items-center justify-center gap-3 ml-3">
                <OrbitLink onClick={() => downloadZip(x._id)}>
                  <span data-tip="Click To Download">
                    <DownloadIcon fill="#2697FF" />
                    <ReactTooltip effect="solid" />
                  </span>
                </OrbitLink>
              </div>
            </div>
          ))
        ) : (
          <div className="font-semibold text-center py-20">Select course and submit and download ZIP.</div>
        )}
      </div>
    </div>
  )
}

export default DocsDownload
