import React, { useEffect, useState } from "react"
import { MenuButton } from "video-react"

const BitrateButton = ({ dashPlayer, className = "" }) => {
  const [index, setIndex] = useState(0)
  const [bitrates, setBitrates] = useState([
    {
      label: "Auto",
      value: "auto",
    },
  ])

  const handleSelectItem = (itemIndex) => {
    const autoIndex = bitrates.findIndex((index__) => index__.value === "auto")
    const indexValue = bitrates[itemIndex] && bitrates[itemIndex].value ? bitrates[itemIndex].value : 0
    if (dashPlayer) {
      if (itemIndex !== autoIndex) {
        dashPlayer.setQualityFor("video", indexValue)
      }
      dashPlayer.setAutoSwitchQualityFor("video", itemIndex === autoIndex)
      setIndex(itemIndex)
    }
  }

  useEffect(() => {
    let dashBitrates = dashPlayer ? dashPlayer.getBitrateInfoListFor("video") : []
    dashBitrates = dashBitrates.map((index_) => ({
      label: `${index_.height}p`,
      value: index_.qualityIndex,
    }))
    dashBitrates = [
      {
        label: "Auto",
        value: "auto",
      },
      ...dashBitrates,
    ]
    dashBitrates = dashBitrates.reverse()
    const selectedIndex = dashBitrates.findIndex((index_) => index_.value === "auto")
    setIndex(selectedIndex)
    setBitrates(dashBitrates)
  }, [dashPlayer])

  return (
    <MenuButton
      className={`video-reacct-plyaback-rate ${className}`}
      onSelectItem={(e) => handleSelectItem(e)}
      items={bitrates}
      selectedIndex={index}
    >
      <span className="video-react-control-text">Quality</span>
      <div className="video-react-playback-rate-value">{bitrates[index] ? bitrates[index].label : ""}</div>
    </MenuButton>
  )
}

// BitrateButton.defaultProps = defaultProps;
export default BitrateButton
