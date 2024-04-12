/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import commonApi from "api"
import EditIcon from "icons/editIcon"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import { useDropzone } from "react-dropzone"
import Toast from "utils/toast"
import getImgUrl from "utils/util"

const ProfilePhotoUploader = ({ image = {}, setImage = () => {} }) => {
  const { t } = useTranslation("common")

  const { getRootProps, getInputProps } = useDropzone({
    // eslint-disable-next-line consistent-return
    onDrop: async (acceptedFiles) => {
      const isJPG =
        acceptedFiles[0].type === "image/jpg" ||
        acceptedFiles[0].type === "image/jpeg" ||
        acceptedFiles[0].type === "image/png" ||
        acceptedFiles[0].type === "image/webp" ||
        acceptedFiles[0].type === "image/gif" ||
        acceptedFiles[0].type === "image/svg+xml"
      if (!isJPG) {
        return Toast(t("imageTypeUpload"), "error")
      }
      const isLt2M = acceptedFiles[0].size / 1024 / 1024 < 2
      if (!isLt2M) {
        return Toast(t("imageSizeUpload"), "error")
      }

      const file = acceptedFiles[0]?.name
      const payload = new FormData()
      payload.append("files", acceptedFiles[0], file)

      if (payload) {
        await commonApi({
          action: "imgUpload",
          data: payload,
          config: {
            contentType: "multipart/form-data",
          },
        }).then(async ([, { data = {} }]) => {
          // eslint-disable-next-line no-underscore-dangle
          setImage(data?.[0])
          return false
        })
      }
    },
  })
  return (
    <div {...getRootProps({ className: "dropzone" })} className="relative w-24 h-24 mx-auto my-6 md:mx-0">
      <img
        src={image?.uri ? getImgUrl(image.uri) : "/images/user.png"}
        className="object-cover w-24 h-24 rounded-full md:mx-auto"
        alt=""
      />
      <label
        htmlFor="file-upload"
        className="h-8 w-8 rounded-full flex items-center justify-center absolute -bottom-0.5 -right-0.5 z-[1] bg-primary shadow border-2 border-white cursor-pointer"
      >
        <input {...getInputProps()} />
        <EditIcon />
      </label>
    </div>
  )
}

export default ProfilePhotoUploader
