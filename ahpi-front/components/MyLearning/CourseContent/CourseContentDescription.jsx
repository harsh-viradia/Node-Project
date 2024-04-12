import DownIcon from "icons/downicon"
import React, { useEffect, useState } from "react"
import useCollapse from "react-collapsed"
import { MATERIAL_TYPES } from "utils/constant"

import DocumentContent from "./DocumentContent"
import QuizContentComp from "./QuizContentComp"
import TextContent from "./TextContent"
import VideoContent from "./VideoContent"

const CourseContentDescription = ({
  detail = {},
  setVideoUrl = () => {},
  updateProgress,
  sectionIndex,
  courseDetails = {},
  progressData = {},
  courseId,
  activeSection,
  initialCurrentContent,
}) => {
  const [isExpanded, setExpanded] = useState(activeSection)
  useEffect(() => {
    setExpanded(activeSection === sectionIndex)
  }, [activeSection])
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
  return (
    <div className="border-b  border-light-gray p-4">
      <div
        className="flex items-center justify-between"
        {...getToggleProps({
          onClick: () => setExpanded((previousExpanded) => !previousExpanded),
        })}
      >
        <p className="font-semibold">{detail.nm}</p>
        {isExpanded ? (
          <div className="rotate-180">
            <DownIcon />
          </div>
        ) : (
          <DownIcon />
        )}
      </div>
      <section {...getCollapseProps()}>
        <div className="grid w-full gap-0 text-xs sm:gap-. text-dark-gray sm:text-sm py-1">
          {detail?.materials?.map((item, index) => {
            return (
              <>
                {item?.type === MATERIAL_TYPES.VIDEO && (
                  <VideoContent
                    detail={detail}
                    sectionIndex={sectionIndex}
                    itemIndex={index}
                    courseDetails={courseDetails}
                    setVideoUrl={setVideoUrl}
                    content={item}
                    progressData={progressData}
                    updateProgress={updateProgress}
                    initialCurrentContent={initialCurrentContent && item.isLast}
                  />
                )}
                {(item?.type === MATERIAL_TYPES.QUIZ || item?.type === MATERIAL_TYPES.QUIZ_CERTIFICATE) && (
                  <QuizContentComp
                    detail={detail}
                    sectionIndex={sectionIndex}
                    itemIndex={index}
                    updateProgress={updateProgress}
                    courseDetails={courseDetails}
                    content={item}
                    courseId={courseId}
                    initialCurrentContent={initialCurrentContent && item.isLast}
                  />
                )}
                {item?.type === MATERIAL_TYPES.TEXT && (
                  <TextContent
                    detail={detail}
                    sectionIndex={sectionIndex}
                    itemIndex={index}
                    updateProgress={updateProgress}
                    courseDetails={courseDetails}
                    content={item}
                    initialCurrentContent={initialCurrentContent && item.isLast}
                  />
                )}
                {item?.type === MATERIAL_TYPES.DOCS && (
                  <DocumentContent
                    detail={detail}
                    sectionIndex={sectionIndex}
                    itemIndex={index}
                    updateProgress={updateProgress}
                    courseDetails={courseDetails}
                    content={item}
                    initialCurrentContent={initialCurrentContent && item.isLast}
                  />
                )}
              </>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default CourseContentDescription
