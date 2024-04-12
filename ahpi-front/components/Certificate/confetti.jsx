import React from "react"
import Confetti from "react-confetti"

import useWindowSize from "./useWindowSize"

const CustomConfetti = () => {
  const { width, height } = useWindowSize()

  return <Confetti width={width} height={height} />
}

export default CustomConfetti
