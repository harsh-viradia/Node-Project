/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import commonApi from "api"
import CoverPhotoIcon from "icons/coverPhotoIcon"
import DeleteIcon from "icons/deleteIcon"
import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
import ConfirmPopOver from "shared/actions/confirmPopover"
import Toast from "utils/toast"
import OrbitLoader from "widgets/loader"

const Upload = ({
  label = "",
  setImg = () => {},
  resolution = false,
  mandatory,
  error,
  selectedImg,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false)
  const { getRootProps, getInputProps } = useDropzone({
    // eslint-disable-next-line consistent-return
    accept: "image/png, image/jpg, image/jpeg, image/webp, image/gif, image/svg+xml",
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        return Toast("You can upload only JPG, JPEG, PNG, WEBP, GIF OR SVG file!", "error")
      }
      const isJPG =
        acceptedFiles[0].type === "image/jpg" ||
        acceptedFiles[0].type === "image/jpeg" ||
        acceptedFiles[0].type === "image/png" ||
        acceptedFiles[0].type === "image/webp" ||
        acceptedFiles[0].type === "image/gif" ||
        acceptedFiles[0].type === "image/svg+xml"
      if (!isJPG) {
        return Toast("You can upload only JPG, JPEG, PNG, WEBP, GIF OR SVG file!", "error")
      }
      const isLt2M = acceptedFiles[0].size / 1024 / 1024 < 2
      if (!isLt2M) {
        return Toast("Image size must be smaller than 2MB!", "error")
      }

      const file = acceptedFiles[0]?.name
      const payload = new FormData()
      payload.append("files", acceptedFiles[0], file)
      setLoading(true)
      if (payload) {
        await commonApi({
          action: "imgUpload",
          data: payload,
          config: {
            contentType: "multipart/form-data",
          },
        }).then(async ([, { data = {} }]) => {
          // eslint-disable-next-line no-underscore-dangle
          setImg({ id: data?.[0]?._id, uri: data?.[0]?.uri })
          setLoading(false)
          return false
        })
      }
    },
  })
  const deleteImg = async () => {
    setImg()
    // await commonApi({
    //   action: "imgDelete",
    //   parameters: [selectedImg.id],
    // }).then(() => {
    //   setImg()
    //   return ""
    // })
  }
  return (
    <div className="relative mt-2">
      {loading && <OrbitLoader relative />}
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
      <div
        {...getRootProps({ className: "dropzone" })}
        className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-primary-border ${
          disabled ? "pointer-events-none !bg-disabled-gray" : ""
        }`}
      >
        <div>
          {!loading && (
            <>
              <input {...getInputProps()} />
              <div className="flex gap-4 text-center">
                <div className="w-12 h-12 mx-auto">
                  <CoverPhotoIcon />
                </div>
                <div className="self-center text-left text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative gap-4 font-medium text-center rounded-md cursor-pointer text-blue focus-within:outline-none"
                  >
                    <span>
                      Upload a file
                      <p className="inline pl-1 text-gray-500">or drag and drop</p>
                    </span>
                  </label>
                  <p className="pt-1 text-xs text-gray-500">JPG, JPEG, PNG, WEBP, GIF OR SVG up to 2MB</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red">{error}</p>}
      {selectedImg && (
        <div className="mt-4 flex items-center justify-center h-24 overflow-hidden border border-gray rounded-md single-profile-add w-40">
          <div className="">
            <div className="relative flex items-center justify-center h-20 choose-img w-36">
              <img
                src={selectedImg?.uri}
                className="relative object-cover h-20 overflow-hidden rounded-md border border-gray-200 w-36"
                alt="Logo"
              />
              {!disabled && (
                <div className="absolute transition delete-icon focus:outline-none">
                  <ConfirmPopOver onConfirm={() => deleteImg()} position="right">
                    <DeleteIcon className="w-5 h-5 cursor-pointer text-red" />
                  </ConfirmPopOver>
                </div>
              )}
            </div>
          </div>
        </div>
        // <img src={`${process.env.NEXT_PUBLIC_FETCH_URL}${selectedImg?.uri}`} alt="Logo" height="100px" width="100px" />
      )}
    </div>
  )
}

export default Upload
