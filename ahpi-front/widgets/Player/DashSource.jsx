import dashjs from "dashjs"
import React, { useEffect, useState } from "react"

import { checkDash } from "./helper"

const DashSource = ({ src, video, handleDashPlayer, dashPlayer }) => {
  const [type, setType] = useState("video/mp4")

  function load() {
    // load dash video source base on dash.js
    if (checkDash(src)) {
      setType("application/x-mpegURL")
      const dash = dashjs.MediaPlayer().create()
      dash.initialize(video, src, false)
      dash.getDebug().setLogToBrowserConsole(false)
      dash.setXHRWithCredentialsForType("", true)
      dash.setFastSwitchEnabled(true)
      dash.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
        handleDashPlayer(dash)
        dash.setFastSwitchEnabled(true)
      })
      dash.on(dashjs.MediaPlayer.events.ERROR, () => {
        const videoSource = video.getAttribute("src")
        if (checkDash(videoSource)) {
          video.load()
        }
      })
    }
  }

  useEffect(() => {
    load()
    if (dashPlayer) {
      dashPlayer.reset()
    }
    // return () => video.removeAttribute("src")
  }, [src])

  // useEffect(() => {
  //   load()
  //   return () => video.removeAttribute("src")
  // }, [])

  return <source src={src} type={type} />
}

export default DashSource
