/* eslint-disable unicorn/prefer-spread */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable promise/no-nesting */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import commonApi from "api"
import CoverPhotoIcon from "icons/coverPhotoIcon"
import getConfig from "next/config"
import React, { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { checkIOSDevice, VIDEO_FILE_STATUS } from "utils/constant"
import Toast from "utils/toast"
import { debounce } from "utils/util"
import OrbitLoader from "widgets/loader"

import VideoPlayer from "./Player"
import { uploadparts } from "./Player/helper"

const { publicRuntimeConfig } = getConfig()

const FILE_CHUNK_SIZE = 5242880

const VideoUpload = ({
  label = "",
  error = "",
  setValue = () => false,
  fileData = "",
  keyId = "",
  mandatory = false,
  resolution = false,
  videoId = "",
  disabled,
}) => {
  const [videoStatus, setVideoStatus] = useState("")
  const [videoUrl, setVideoUrl] = useState(fileData?.hslUrl)
  const [loader, setLoader] = useState(false)
  // to track video upload progress
  const [progress, setProcess] = useState(0)
  const [progressInterval, setprogressInterval] = useState(0)

  let interval
  const videoStatusCheck = (vid) => {
    switch (vid?.status) {
      case VIDEO_FILE_STATUS.UPLOADED: {
        setVideoUrl(checkIOSDevice() ? vid?.hslUrl : vid?.mpdUrl)
        setVideoStatus(VIDEO_FILE_STATUS.UPLOADED)
        break
      }
      case VIDEO_FILE_STATUS.FAILED: {
        setVideoUrl()
        setVideoStatus(VIDEO_FILE_STATUS.FAILED)
        break
      }
      case VIDEO_FILE_STATUS.PROCESSING: {
        setVideoUrl()
        setVideoStatus(VIDEO_FILE_STATUS.PROCESSING)
        break
      }
      default: {
        setVideoUrl()
        setVideoStatus()
      }
    }
  }

  const getVideoStatus = async (id) => {
    const { token } = await fetch("/api/getToken").then((response) => response.json())
    fetch(`${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/file/status/${id}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `jwt ${token}`,
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.data?.vidObj?.status === VIDEO_FILE_STATUS.UPLOADED) {
          videoStatusCheck(data?.data?.vidObj)
          clearInterval(interval)
        }
        return false
      })
      .catch((error_) => {
        // eslint-disable-next-line no-console
        console.log(error_)
      })
  }

  // to track video upload progress
  const callBackFunction = debounce(
    (totalTime) => setProcess(progress + totalTime >= 100 ? 100 : progress + totalTime),
    250
  )
  const { getRootProps, getInputProps } = useDropzone({
    accept: "video/mp4",
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        try {
          setLoader(true)
          setProcess(1)
          setValue("videoProgress", "uploading")
          const file = acceptedFiles[0]
          if (!file) throw new Error("File not found!")
          const totalParts = file.size / FILE_CHUNK_SIZE
          const { name } = file
          if (name && name.match(/\./g).length > 1) {
            return Toast("Video name should not contain more than one dots", "error")
          }
          const value = name
            .toLowerCase()
            .trim()
            .replace(/["#$%&'()*+,/:<>?\\{}~]/g, " ")
            .replace(/  +/g, " ")
            .replace(/ /g, "_")
          const stringArray = value.split(".")
          const fileName = [stringArray[0].concat(Date.now()), stringArray[1]].join(".")
          const startDate = Date.now() // to track video upload progress
          await commonApi({ action: "videoUrls", data: { parts: totalParts, object_name: fileName } }).then(
            async ([, { data = {} }]) => {
              const { uploadId, urls = {} } = data
              // to track video upload progress
              const totalTime = Math.round(25 / (((Object.keys(urls)?.length || 1) * (Date.now() - startDate)) / 1000))
              callBackFunction(totalTime) // to track video upload progress
              setprogressInterval(totalTime) // to track video upload progress
              const parts = await uploadparts(file, urls)
              await commonApi({ action: "completeUpload", data: { uploadId, object_name: fileName, parts } }).then(
                async ([error1, { data: newData = {} }]) => {
                  setValue("videoProgress", "", { shouldValidate: true })
                  if (error1) return false
                  Toast("Video uploaded successfully, streaming is in progress.")
                  setVideoStatus(VIDEO_FILE_STATUS.PROCESSING)
                  await setValue(keyId, newData?._id, { shouldValidate: true })
                  return false
                }
              )
              return false
            }
          )
        } finally {
          setLoader(false)
          setProcess(0)
        }
      } else {
        Toast("Please upload only MP4 file.", "error")
      }
      return false
    },
  })

  useEffect(() => {
    videoStatusCheck(fileData)
  }, [fileData])

  // to track video upload progress
  useEffect(() => {
    if (progress > 1 && progress < 100) callBackFunction(progressInterval)
  }, [progress])
  useEffect(() => {
    if (videoId && videoStatus === VIDEO_FILE_STATUS.PROCESSING) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      interval = setInterval(() => getVideoStatus(videoId), 5000)
    }
    if (videoId && videoStatus === VIDEO_FILE_STATUS.UPLOADED) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      getVideoStatus(videoId)
    }
    return () => clearInterval(interval)
  }, [videoId, videoStatus])
  // const handleDeleteVideo = () => {
  //   setVideoUrl()
  //   setValue(keyId)
  // }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6">
        <div className="group w-full min-h-full p-2 border rounded-lg border-light-gray relative">
          {videoStatus === VIDEO_FILE_STATUS.UPLOADED ? (
            <div>
              <VideoPlayer src={videoUrl} />
              {/* {!loader && (
                <div className="absolute transition-all inset-0 bg-black bg-opacity-50 rounded backdrop-blur-sm hidden group-hover:flex items-center justify-center">
                  <button type="button" className="text-white hover:text-red transition-all">
                    <DeleteIcon size="24" onClick={() => handleDeleteVideo()} />
                  </button>
                </div>
              )} */}
            </div>
          ) : (
            <div className="object-cover bg-light-gray flex items-center justify-center w-full rounded h-52">
              {!loader &&
                (videoStatus === VIDEO_FILE_STATUS.PROCESSING ? (
                  <div className="flex flex-col gap-1 text-center">
                    <span>Video streaming is in progress...</span>
                    <p className="text-xs text-gray-500">Please reload page after sometime and check video status.</p>
                  </div>
                ) : videoStatus === VIDEO_FILE_STATUS.FAILED ? (
                  <div className="flex flex-col gap-1 text-center">
                    <span>Video streaming is failed.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 text-center px-4">
                    <span>Not uploaded any video.</span>
                    <p className="text-xs text-gray-500">
                      Please make sure video file format is MP4 and has audio in it,you can upload upto 1GB of size.
                    </p>
                  </div>
                ))}
            </div>
          )}
          {loader && <OrbitLoader relative text={`Uploading ${progress}%`} />}
        </div>
      </div>
      <div className="flex items-center col-span-6">
        <div className="col-span-12">
          <div>
            {(label || resolution) && (
              <div className="flex items-center gap-2 justify-between">
                {label && (
                  <label className="text-xs font-medium mb-2 inline-block text-foreground">
                    {label} {mandatory ? <span className="text-red">*</span> : ""}
                  </label>
                )}
                {resolution && (
                  <span className="text-xs font-medium mb-2 inline-block text-red">Size must be {resolution}</span>
                )}
              </div>
            )}
            <div
              {...getRootProps({ className: "dropzone" })}
              className={`flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-dashed rounded-md border-primary-border ${
                disabled ? "pointer-events-none !bg-disabled-gray" : ""
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex items-center space-x-4">
                <CoverPhotoIcon size="h-12 w-12 min-w-[48px]" />
                <div className="grid grid-cols-1 gap-1  text-left">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative gap-4 font-medium rounded-md cursor-pointer text-blue focus-within:outline-none"
                    >
                      <span>
                        Upload a video
                        <p className="inline pl-1 text-gray-500">or drag and drop</p>
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Please make sure video file format is MP4 and has audio in it, you can upload upto 1GB of size.
                  </p>
                </div>
              </div>
            </div>
            {error && <p className="text-xs font-medium mt-1 text-red">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoUpload
