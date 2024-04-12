/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import LockIcon from "icons/lockIcon"
import PlayIcon from "icons/playIcon"
import React, { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"
import { MATERIAL_TYPES, QUIZ_SUBMIT_STATUS } from "utils/constant"

import QuitQuiz from "./QuitQuiz"

const VideoContent = ({
  content = {},
  setVideoUrl = () => {},
  detail = {},
  itemIndex,
  sectionIndex,
  courseDetails = {},
  progressData = {},
  initialCurrentContent,
}) => {
  const canAccess = !content.isLocked
  const { currentCourseContent = {}, setCurrentCourseContent } = useContext(AppContext)
  const [showQuizPopup, setShowQuizPopup] = useState(false)
  const updateCall = () => {
    setVideoUrl({
      id: content?.vidId?._id,
      hslUrl: content?.vidId?.vidObj?.hslUrl,
      mpdUrl: content?.vidId?.vidObj?.mpdUrl,
      secId: detail._id,
      materialId: content._id,
      nextId:
        courseDetails?.[sectionIndex]?.materials?.[itemIndex + 1]?._id ||
        courseDetails?.[sectionIndex + 1]?.materials?.[0]?._id,
      playFrom:
        progressData.currentId === content._id && progressData.lastPlayTime ? progressData.lastPlayTime : "00:00",
      autoPlay: true,
      isPosterVideo: !content.isLast, // if isLast then progress will track
    })
    setCurrentCourseContent(content)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  useEffect(() => {
    if (initialCurrentContent) updateCall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])
  return (
    <>
      <div
        className={`rounded-lg ${
          currentCourseContent._id === content._id ? "bg-primary-max-light border border-primary" : ""
        }`}
      >
        <div className="flex items-center p-2 justify-between rounded-t-lg">
          <div className="flex gap-0.5 w-full">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                if (canAccess && currentCourseContent._id !== content._id) {
                  if (
                    (currentCourseContent?.type === MATERIAL_TYPES.QUIZ ||
                      currentCourseContent?.type === MATERIAL_TYPES.QUIZ_CERTIFICATE) &&
                    currentCourseContent?.quizStatus !== QUIZ_SUBMIT_STATUS.COMPLETED
                  )
                    setShowQuizPopup(true)
                  else updateCall()
                }
              }}
            >
              {canAccess ? (
                <PlayIcon size="20px" className="text-primary !min-w-[20px]" />
              ) : (
                <LockIcon size="20" className="text-gray !min-w-[20px]" />
              )}
              <h4 className={`text-sm font-semibold ${currentCourseContent._id === content._id && "text-primary"}`}>
                {content.nm}
              </h4>
            </div>
          </div>
        </div>
      </div>
      <QuitQuiz
        isOpen={showQuizPopup}
        close={() => setShowQuizPopup(false)}
        onClickConfirm={async () => {
          await setShowQuizPopup(false)
          await updateCall()
        }}
      />
    </>
  )
}

export default VideoContent
