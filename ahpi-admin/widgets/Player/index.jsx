// import "./style.css"

import React, { useState } from "react"
import { BigPlayButton, ControlBar, PlaybackRateMenuButton, Player, Shortcut, VolumeMenuButton } from "video-react"

import BitrateButton from "./BitrateButton"
import DashSource from "./DashSource"
import { checkDash, checkHls, shortCodes } from "./helper"
import HLSSource from "./HlsSource"

const VideoPlayer = ({ src, startSeconds, poster }) => {
  // eslint-disable-next-line unicorn/no-null
  const [dashPlayer, setDashPlayer] = useState(null)

  function handleDashPlayer(player) {
    setDashPlayer(player)
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  const ControlBarComponent = (dashedSource) => (
    <ControlBar autoHide autoHideTime={1000}>
      {/* <DurationDisplay order={7.1}/> */}
      <VolumeMenuButton vertical />
      <PlaybackRateMenuButton rates={[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]} order={9} className="playback-desk-btn" />
      {!dashedSource || <BitrateButton order={7.2} rates={["auto", 720, 360]} dashPlayer={dashPlayer} />}
      <Shortcut clickable={false} shortcuts={shortCodes} />
    </ControlBar>
  )

  if (checkDash(src)) {
    return (
      <Player playsInline preload="none" startTime={startSeconds || 0} poster={poster || ""}>
        <DashSource isVideoChild src={src} handleDashPlayer={(e) => handleDashPlayer(e)} />
        <BigPlayButton position="center" />
        {ControlBarComponent(true)}
      </Player>
    )
  }
  if (checkHls(src)) {
    return (
      <Player playsInline preload="none" startTime={startSeconds || 0} poster={poster || ""}>
        <HLSSource isVideoChild src={src} handleDashPlayer={(e) => handleDashPlayer(e)} />
        <BigPlayButton position="center" />
        {ControlBarComponent(true)}
      </Player>
    )
  }
  return (
    <Player preload="none" startTime={startSeconds || 0} playsInline poster={poster} src={src}>
      <BigPlayButton position="center" />
      {ControlBarComponent(false)}
    </Player>
  )
}

export default VideoPlayer
