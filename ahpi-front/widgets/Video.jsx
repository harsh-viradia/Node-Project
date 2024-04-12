/* eslint-disable jsx-a11y/label-has-associated-control */
import getConfig from "next/config"
import React, { useEffect, useState } from "react"
import { checkIOSDevice, convertTimeToSeconds, VIDEO_FILE_STATUS } from "utils/constant"
import VideoPlayer from "widgets/Player"

const { publicRuntimeConfig } = getConfig()
const Video = ({
  url = "",
  id,
  setLoading = () => false,
  playFrom,
  poster,
  autoPlay,
  updateVideoProgress,
  isPosterVideo,
}) => {
  const [videoUrl, setVideoUrl] = useState()

  const getVideoStatus = async () => {
    const { token } = await fetch(`${publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL}/api/getToken`).then((response) =>
      response.json()
    )
    try {
      setLoading(true)
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
            setVideoUrl(checkIOSDevice() ? data?.data?.vidObj?.hslUrl : data?.data?.vidObj?.mpdUrl)
          } else {
            setVideoUrl()
          }
          return false
        })
        .catch((error_) => {
          console.log(error_)
        })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (url) {
      setVideoUrl(url)
      getVideoStatus()
    }
  }, [url])

  return videoUrl ? (
    <VideoPlayer
      srcUrl={videoUrl}
      poster={poster}
      startSeconds={convertTimeToSeconds(playFrom)}
      autoPlay={autoPlay}
      updateVideoProgress={updateVideoProgress}
      isPosterVideo={isPosterVideo}
    />
  ) : (
    <img
      className="w-full mt-7 lg:h-[410px] sm:h-[300px] h-[192px]"
      src="/images/logo.png"
      alt="Video Streaming is in progress."
      loading="lazy"
    />
  )
}
export default Video
