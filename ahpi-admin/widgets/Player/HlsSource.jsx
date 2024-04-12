import Hls from "hls.js"
import React, { useEffect } from "react"

const HlsSource = ({ src, video, handleDashPlayer, type }) => {
  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        handleDashPlayer(hls)
        video.play()
      })
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // eslint-disable-next-line no-param-reassign
      video.src = src
      video.addEventListener("loadedmetadata", () => {
        // handleDashPlayer(this.dash)
        video.play()
      })
    }
  }, [])

  return <source src={src} type={type || "application/x-mpegURL"} />
}

export default HlsSource
