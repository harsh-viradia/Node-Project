/* eslint-disable unicorn/no-null */
// import "./style.css"

import React, { createRef, useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import {
  BigPlayButton,
  ControlBar,
  ForwardControl,
  PlaybackRateMenuButton,
  Player,
  ReplayControl,
  Shortcut,
  VolumeMenuButton,
} from "video-react"

import BitrateButton from "./BitrateButton"
import DashSource from "./DashSource"
import { checkDash, checkHls, convertSeconds, shortCodes } from "./helper"
import HLSSource from "./HlsSource"

const VideoPlayer = ({
  srcUrl,
  startSeconds,
  poster,
  autoPlay = false,
  updateVideoProgress = () => {},
  isPosterVideo,
}) => {
  const [dashPlayer, setDashPlayer] = useState(null)
  const debounced = useDebouncedCallback((sts, time) => {
    updateVideoProgress(sts, time)
  }, 1000)
  const videoRef = createRef(null)

  function handleStateChange(state, prevState) {
    if (isPosterVideo || state.src !== prevState.src) return
    const currentTime = Math.round(state.currentTime)
    if (state.ended && prevState.currentTime !== state.currentTime) {
      debounced(2)
      return
    }
    if (state.paused && prevState.currentTime !== state.currentTime) {
      debounced(undefined, convertSeconds(currentTime))
    }
  }

  useEffect(() => {
    if (videoRef.current) videoRef.current.subscribeToStateChange(handleStateChange)
  }, [videoRef])

  function handleDashPlayer(player) {
    setDashPlayer(player)
  }
  // eslint-disable-next-line react/no-unstable-nested-components
  const ControlBarComponent = (dashedSource) => (
    <ControlBar autoHide autoHideTime={1000}>
      {/* <DurationDisplay order={7.1}/> */}

      <ReplayControl seconds={10} order={1} />
      <ForwardControl seconds={10} order={2} />
      <VolumeMenuButton vertical />
      <PlaybackRateMenuButton rates={[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]} order={9} className="playback-desk-btn" />
      {!dashedSource || <BitrateButton order={7.2} rates={["auto", 720, 360]} dashPlayer={dashPlayer} />}
      <Shortcut clickable={false} shortcuts={shortCodes} />
    </ControlBar>
  )

  if (checkDash(srcUrl)) {
    return (
      <Player
        ref={videoRef}
        className="myLearningVideo"
        playsInline
        preload="none"
        startTime={startSeconds || 0}
        poster={poster || ""}
      >
        <DashSource
          autoPlay={autoPlay}
          isVideoChild
          src={srcUrl}
          handleDashPlayer={(e) => handleDashPlayer(e)}
          dashPlayer={dashPlayer}
        />
        <BigPlayButton position="center" />
        {ControlBarComponent(true)}
      </Player>
    )
  }
  if (checkHls(srcUrl)) {
    return (
      <Player
        ref={videoRef}
        className="myLearningVideo"
        playsInline
        preload="none"
        startTime={startSeconds || 0}
        poster={poster || ""}
      >
        <HLSSource autoPlay={autoPlay} isVideoChild src={srcUrl} handleDashPlayer={(e) => handleDashPlayer(e)} />
        <BigPlayButton position="center" />
        {ControlBarComponent(true)}
      </Player>
    )
  }
  return (
    <Player
      ref={videoRef}
      className="myLearningVideo"
      preload="none"
      startTime={startSeconds || 0}
      playsInline
      poster={poster}
      src={srcUrl}
      autoPlay={autoPlay}
    >
      <BigPlayButton position="center" />
      {ControlBarComponent(false)}
    </Player>
  )
}

export default VideoPlayer
