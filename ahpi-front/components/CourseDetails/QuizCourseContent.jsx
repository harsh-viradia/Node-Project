import DocumentIcon from "icons/documentIcon"
import DownIcon from "icons/downicon"
import PlayIcon from "icons/playIcon"
import QuizIcon from "icons/quizIcon"
import TextIcon from "icons/textIcon"
import React, { useState } from "react"
import useCollapse from "react-collapsed"
import { MATERIAL_TYPES } from "utils/constant"

const QuizCourseContent = ({ detail = {} }) => {
  const [isExpanded, setExpanded] = useState(false)
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
  return (
    <div className="px-6 py-5 border-b border-light-gray">
      <div
        className="flex items-center justify-between"
        {...getToggleProps({
          onClick: () => setExpanded((previousExpanded) => !previousExpanded),
        })}
      >
        <p className="text-base font-semibold sm:text-lg">{detail?.nm}</p>

        {isExpanded ? (
          <div className="rotate-180">
            <DownIcon />
          </div>
        ) : (
          <DownIcon />
        )}
      </div>
      <section {...getCollapseProps()}>
        <div className="grid w-full gap-1 mt-3 text-xs sm:gap-1 text-dark-gray sm:text-sm">
          {detail?.materials?.map((item) => (
            <>
              {item?.type === MATERIAL_TYPES.VIDEO && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <PlayIcon size="24px" className="text-black" />
                    <p>{item.nm}</p>
                  </div>
                  {/* <p>{item.duration}</p> */}
                </div>
              )}
              {(item?.type === MATERIAL_TYPES.QUIZ || item?.type === MATERIAL_TYPES.QUIZ_CERTIFICATE) && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <QuizIcon size="24px" className="text-black" />
                    <p>{item.nm}</p>
                  </div>
                  <p>{item.duration}</p>
                </div>
              )}
              {item?.type === MATERIAL_TYPES.TEXT && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <TextIcon size="24px" className="text-black" />
                    <p>{item.nm}</p>
                  </div>
                </div>
              )}
              {item?.type === MATERIAL_TYPES.DOCS && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <DocumentIcon size="24px" className="text-black" />
                    <p>{item.nm}</p>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </section>
    </div>
  )
}

export default QuizCourseContent
