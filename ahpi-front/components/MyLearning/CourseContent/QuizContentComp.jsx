/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import InfoIcon from "icons/infoIcon"
import LockIcon from "icons/lockIcon"
import QuizIcon from "icons/quizIcon"
import React, { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"
import { MATERIAL_TYPES, QUIZ_SUBMIT_STATUS } from "utils/constant"

import QuitQuiz from "./QuitQuiz"

const QuizContentComp = ({
  content = {},
  detail = {},
  itemIndex,
  sectionIndex,
  courseDetails = {},
  courseId,
  initialCurrentContent,
}) => {
  const { currentCourseContent = {}, setCurrentCourseContent } = useContext(AppContext)
  const canAccess = !content.isLocked
  const [showQuizPopup, setShowQuizPopup] = useState(false)
  const updateCall = () => {
    setCurrentCourseContent({
      ...content,
      quizId: content._id,
      secId: detail._id,
      materialId: content._id,
      nextId:
        courseDetails?.[sectionIndex]?.materials?.[itemIndex + 1]?._id ||
        courseDetails?.[sectionIndex + 1]?.materials?.[0]?._id,
      courseId,
    })
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
            <div className="flex items-center gap-3">
              {canAccess ? (
                <QuizIcon size="20px" className="text-primary !min-w-[20px]" />
              ) : (
                <LockIcon size="20" className="text-gray !min-w-[20px]" />
              )}

              <h4 className={`text-sm font-semibold ${currentCourseContent._id === content._id && "text-primary"}`}>
                {content.nm}
              </h4>
            </div>
          </div>
          <div className="flex">
            <p className="pr-2">{content.duration}</p>
            {content?.type === 5 && (
              <div className="relative group">
                <InfoIcon size="15px" className="text-primary" />
                <div className="absolute right-[-5px] z-20 hidden bottom-[2rem] w-40 group-hover:block">
                  <div className="flex flex-col gap-1.5 w-full py-2 text-sm bg-white rounded-md border border-primary-border primary-shadow p-2">
                    {content?.desc ? (
                      <div dangerouslySetInnerHTML={{ __html: content?.desc }} />
                    ) : (
                      <p>This is quiz with certificate, If you failed the test, you have to again give the test.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
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

export default QuizContentComp
