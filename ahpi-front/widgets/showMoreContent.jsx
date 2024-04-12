/* eslint-disable react/no-danger */
import DownIcon from "icons/downicon"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useRef, useState } from "react"

const ShowMoreContent = ({ content, className }) => {
  const [showMore, setShowMore] = useState(false)
  const [height, setHeight] = useState(false)
  const { t } = useTranslation("courseDetail")
  const ref = useRef(null)

  useEffect(() => {
    setHeight(ref.current.clientHeight)
  }, [content])
  return (
    <div
      className={`relative ${
        height < 224 ? "h-max-content" : showMore ? "h-max-content pb-10" : "h-56 overflow-hidden"
      } mt-3 text-dark-gray ${className}`}
    >
      <div ref={ref} className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      {height > 224 ? (
        showMore === false ? (
          <div className="absolute bottom-0 left-0 flex items-center justify-center w-full h-32 text-sm bg-gradient-to-t from-white to-transparent text-primary">
            <button
              type="button"
              onClick={() => setShowMore(true)}
              className="flex items-center justify-center gap-2 mt-auto font-medium focus:outline-none"
            >
              <span>{t("showMore")}</span>
              <DownIcon />
            </button>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 flex items-center justify-center w-full h-32 text-sm from-white to-transparent text-primary">
            <button
              type="button"
              onClick={() => setShowMore(false)}
              className="flex items-center justify-center gap-2 mt-auto font-medium focus:outline-none"
            >
              <span>{t("showLess")}</span>
              <div className="rotate-180">
                <DownIcon />
              </div>
            </button>
          </div>
        )
      ) : (
        ""
      )}
    </div>
  )
}

export default ShowMoreContent
