/* eslint-disable no-underscore-dangle */
import useTranslation from "next-translate/useTranslation"
import React, { useContext, useState } from "react"
import AppContext from "utils/AppContext"
import { MATERIAL_TYPES, QUIZ_SUBMIT_STATUS } from "utils/constant"
import OrbitLink from "widgets/orbitLink"

import QuitQuiz from "./QuitQuiz"

const PreviewContent = () => {
  const { currentCourseContent = {}, setCurrentCourseContent } = useContext(AppContext)
  const [showQuizPopup, setShowQuizPopup] = useState(false)
  const { t } = useTranslation("courseDetail")
  const updateCall = () => {
    setCurrentCourseContent()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  return (
    <>
      <div className="border-b p-4 border-light-gray">
        <div className={`flex items-center justify-between `}>
          <OrbitLink
            onClick={() => {
              if (
                (currentCourseContent?.type === MATERIAL_TYPES.QUIZ ||
                  currentCourseContent?.type === MATERIAL_TYPES.QUIZ_CERTIFICATE) &&
                currentCourseContent?.quizStatus !== QUIZ_SUBMIT_STATUS.COMPLETED
              ) {
                setShowQuizPopup(true)
              } else updateCall()
            }}
            className={`font-semibold ${currentCourseContent?._id ? "" : "text-primary"}`}
          >
            {t("previewVideo")}
          </OrbitLink>
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

export default PreviewContent
