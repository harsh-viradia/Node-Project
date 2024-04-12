import useTranslation from "next-translate/useTranslation"
import devTools from "node_modules/devtools-detect/index"
import React, { useEffect, useState } from "react"
import DevToolsPopup from "widgets/alertPopup"

const TrackDevTools = () => {
  const [popup, setPopup] = useState(false)
  const { t } = useTranslation("common")
  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    // Disable right-click
    document.addEventListener("contextmenu", (e) => e.preventDefault())
    function ctrlShiftKey(even, keyCode) {
      return even.ctrlKey && even.shiftKey && even.key === keyCode
    }
    document.addEventListener("keydown", (e) => {
      // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + Shift + C, Ctrl + U,  ctrl + S,
      if (
        e.key === "F12" ||
        ctrlShiftKey(e, "I") ||
        ctrlShiftKey(e, "i") ||
        ctrlShiftKey(e, "J") ||
        ctrlShiftKey(e, "j") ||
        ctrlShiftKey(e, "C") ||
        ctrlShiftKey(e, "c") ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.key === "S") ||
        (e.ctrlKey && e.key === "s")
      )
        e.preventDefault()
    })
    if (window.self === window.top && devTools.isOpen) setPopup(true)
    window.addEventListener("devtoolschange", (event) => {
      if (window.self === window.top && event.detail.isOpen) setPopup(true)
      else setPopup(false)
    })
  }, [])
  return <DevToolsPopup open={popup}>{t("closeDevTools")}</DevToolsPopup>
}
export default TrackDevTools
