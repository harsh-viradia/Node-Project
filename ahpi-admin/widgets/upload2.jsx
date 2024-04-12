/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-empty */
/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable jsx-a11y/label-has-associated-control */
import commonApi from "api"
import CoverPhotoIcon from "icons/coverPhotoIcon"
import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
import Toast from "utils/toast"
import OrbitLoader from "widgets/loader"

import Attachment2 from "./attachment2"

const Upload2 = ({
  label = "",
  error,
  resolution = false,
  setValue = () => false,
  formats = "PDF, DOC, EXCEL, PPT or DOCX",
  getValues = () => false,
  mandatory = false,
  docId,
  index,
  userDetails,
  setDeletedData = () => false,
  deletedData = [],
  formikKey = "documentId",
  docDetails: documentDetails = {},
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept:
      "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        return Toast("You can upload only PDF, DOC, PPT, EXCEL OR DOCX file!", "error")
      }
      const fileType = acceptedFiles[0].name.split(".").pop()
      const isJPG =
        fileType === "docx" ||
        fileType === "doc" ||
        fileType === "pdf" ||
        fileType === "ppt" ||
        fileType === "pptx" ||
        fileType === "PPT" ||
        fileType === "PPTX" ||
        fileType === "xlsx" ||
        fileType === "xls"
      if (!isJPG) {
        return Toast("You can upload only PDF, DOC, PPT, EXCEL OR DOCX file!", "error")
      }

      const isLt2M = acceptedFiles[0].size / 1024 / 1024 < 25
      if (!isLt2M) {
        return Toast("File size must be smaller than 10MB!", "error")
      }
      const file = acceptedFiles[0]?.name
      const payload = new FormData()
      payload.append("files", acceptedFiles[0], file)
      setLoading(true)
      if (payload) {
        try {
          await commonApi({
            action: "imgUpload",
            data: payload,
            config: {
              contentType: "multipart/form-data",
            },
          }).then(async ([, { data = {} }]) => {
            const newData = {
              userId: userDetails?._id,
              newUpload: true,
              ...data,
            }
            setLoading(false)
            setValue(`${formikKey}`, newData?.[0]?._id, { shouldValidate: true })
            setValue(`docDetails`, newData?.[0])
            return false
          })
        } finally {
        }
      }
    },
  })

  const handleImageDel = () => {
    setDeletedData([...deletedData, getValues(`data.${index}`)])
    setValue(`${formikKey}`, "", { shouldValidate: true })
    setValue("docDetails", "")
    setOpen(false)
  }

  return (
    <div>
      {(label || resolution) && (
        <div className="flex items-center gap-2 justify-between">
          {label && (
            <label className="text-xs font-medium mb-2 inline-block text-foreground">
              {label} {mandatory ? <span className="text-red">*</span> : ""}
            </label>
          )}
          {resolution && (
            <span className="text-xs font-medium mb-2 inline-block text-red">Size must be in {resolution}</span>
          )}
        </div>
      )}
      {!docId ? (
        <div className="relative">
          <div
            {...getRootProps({ className: "dropzone" })}
            className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-dashed rounded-md border-primary-border"
          >
            {!loading && (
              <>
                <input {...getInputProps()} />
                <div className="flex items-center space-x-4">
                  <CoverPhotoIcon size="h-12 w-12" />
                  <div className="grid grid-cols-1 gap-1">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative font-medium rounded-md cursor-pointer text-blue focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                      </label>
                      <p className="pl-1 text-gray-500">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">{formats}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          {loading && <OrbitLoader relative />}
        </div>
      ) : (
        <Attachment2
          docDetails={documentDetails}
          field={formikKey}
          index={index}
          handleImageDel={handleImageDel}
          open={open}
          setOpen={setOpen}
        />
      )}
      {error && <p className="mt-1 text-xs font-medium text-red">{error}</p>}
    </div>
  )
}

export default Upload2
