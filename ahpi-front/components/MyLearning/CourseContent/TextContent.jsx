/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-danger */
import LockIcon from "icons/lockIcon"
import TextIcon from "icons/textIcon"
import React, { useContext, useEffect, useState } from "react"
import useCollapse from "react-collapsed"
import AppContext from "utils/AppContext"
import { MATERIAL_TYPES, QUIZ_SUBMIT_STATUS } from "utils/constant"

import QuitQuiz from "./QuitQuiz"

const TextContent = ({
  content = {},
  detail = {},
  itemIndex,
  sectionIndex,
  courseDetails = {},
  initialCurrentContent,
}) => {
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded: false })
  const canAccess = !content.isLocked
  const { currentCourseContent = {}, setCurrentCourseContent } = useContext(AppContext)
  const [showQuizPopup, setShowQuizPopup] = useState(false)
  const updateCall = () => {
    setCurrentCourseContent({
      ...content,
      secId: detail._id,
      materialId: content._id,
      nextId:
        courseDetails?.[sectionIndex]?.materials?.[itemIndex + 1]?._id ||
        courseDetails?.[sectionIndex + 1]?.materials?.[0]?._id,
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
        <div className="flex items-center justify-between p-2 rounded-t-lg ">
          <div className="flex items-center justify-between gap-2 w-full">
            <div
              className="flex items-center gap-3"
              {...getToggleProps({
                onClick: () => {
                  if (canAccess && currentCourseContent._id !== content._id) {
                    if (
                      (currentCourseContent?.type === MATERIAL_TYPES.QUIZ ||
                        currentCourseContent?.type === MATERIAL_TYPES.QUIZ_CERTIFICATE) &&
                      currentCourseContent?.quizStatus !== QUIZ_SUBMIT_STATUS.COMPLETED
                    )
                      setShowQuizPopup(true)
                    else updateCall()
                  }
                  // setExpanded((previousExpanded) => (canAccess ? !previousExpanded : false))
                },
              })}
            >
              {canAccess ? (
                <TextIcon size="20px" className="text-primary !min-w-[20px]" />
              ) : (
                <LockIcon size="20" className="text-gray !min-w-[20px]" />
              )}
              <h4 className={`text-sm font-semibold ${currentCourseContent._id === content._id && "text-primary"}`}>
                {content.nm}
              </h4>
            </div>
            {/* <div>
            {isExpanded ? (
              <div className="rotate-180">
                <DownIcon />
              </div>
            ) : (
              <DownIcon />
            )}
          </div> */}
          </div>
        </div>
        <div className="bg-gray-50 rounded-b-lg" {...getCollapseProps()}>
          <div className="p-4">
            <div className="gap-3 py-2 text-xs">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.text }} />
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

export default TextContent
