/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import commonApi from "api"
import CoverPhotoIcon from "icons/coverPhotoIcon"
import DeleteIcon from "icons/deleteIcon"
import React, { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import Toast from "utils/toast"
import OrbitLoader from "widgets/loader"

const CourseImageUploader = ({
  keyId = "file",
  label = "",
  mandatory,
  resolution = false,
  setValue,
  clearErrors,
  fileData,
  error,
  disabled,
}) => {
  const [imgData, setImgData] = useState(fileData)
  const [loader, setLoader] = useState(false)
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/png, image/jpg, image/jpeg, image/webp, image/gif, image/svg+xml",
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles?.length > 0) {
        const file = acceptedFiles[0]?.name
        const payload = new FormData()
        payload.append("files", acceptedFiles[0], file)

        if (payload) {
          setLoader(true)
          await commonApi({
            action: "imgUpload",
            data: payload,
            config: {
              contentType: "multipart/form-data",
            },
          }).then(([, { data = {} }]) => {
            const oriData = data?.[0]
            setValue(keyId, oriData._id)
            clearErrors(keyId)
            setImgData(oriData)
            Toast("Image uploaded successfully.")
            return setLoader(false)
          })
        }
      } else if (rejectedFiles?.[0]?.errors?.[0]?.message === "File is larger than 10485760 bytes") {
        Toast("File is larger than 10mb", "error")
      } else {
        Toast("You can upload only JPG, JPEG, PNG, WEBP, GIF OR SVG file!", "error")
      }
    },
  })
  const handleImageDel = () => {
    setValue(keyId, "")
    setImgData({})
  }

  useEffect(() => {
    setImgData(fileData)
  }, [fileData])

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6">
        <div className=" group w-full min-h-full p-2 border rounded-lg border-light-gray relative">
          {imgData?.uri ? (
            <div>
              <img src={imgData?.uri} className="object-cover w-full rounded h-52" alt={imgData.name} />
              {!disabled && !loader && (
                <div className="absolute transition-all inset-0 bg-black bg-opacity-50 rounded backdrop-blur-sm hidden group-hover:flex items-center justify-center">
                  <button type="button" className="text-white hover:text-red transition-all">
                    <DeleteIcon size="24" onClick={() => handleImageDel()} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="object-cover bg-light-gray flex items-center justify-center w-full rounded h-52">
              {!loader && (
                <div className="flex flex-col gap-1 text-center">
                  <span>Not uploaded any file</span>
                  <p className="text-xs text-gray-500">
                    Please Upload JPG, JPEG, PNG, WEBP, GIF OR SVG up to 2MB file.
                  </p>
                </div>
              )}
            </div>
          )}
          {loader && <OrbitLoader relative />}
        </div>
      </div>
      <div className="flex items-center col-span-6">
        <div className="relative w-full">
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
              disabled ? "pointer-events-none !bg-disabled-gray " : ""
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex gap-4 text-left">
              <div className="w-12 h-12 mx-auto">
                <CoverPhotoIcon />
              </div>
              <div className="self-center text-sm text-gray-600">
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
          </div>
          {error && <p className="text-xs font-medium mt-1 text-red">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default CourseImageUploader
