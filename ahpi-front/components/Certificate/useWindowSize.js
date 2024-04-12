/* eslint-disable valid-typeof */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
import { useEffect, useState } from "react"

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window === undefined ? 0 : window.innerWidth - 20,
    height: typeof window === undefined ? 0 : window.innerHeight,
  })

  const resizeHandler = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener("resize", resizeHandler)
      return () => {
        window.removeEventListener("resize", resizeHandler)
      }
    }
  }, [windowSize])

  return windowSize
}

export default useWindowSize
