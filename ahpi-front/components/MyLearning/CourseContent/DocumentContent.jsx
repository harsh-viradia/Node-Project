/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-danger */
import DocumentIcon from "icons/documentIcon"
import DownloadIcon from "icons/downloadIcon"
import ExcelIcon from "icons/excelIcon"
import LockIcon from "icons/lockIcon"
import PPTIcon from "icons/pptIcon"
import React, { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"
import { MATERIAL_TYPES, QUIZ_SUBMIT_STATUS } from "utils/constant"
import getImgUrl from "utils/util"
import DocumentViewer from "widgets/documentViewer"
import OrbitLink from "widgets/orbitLink"

import QuitQuiz from "./QuitQuiz"

const DocumentContent = ({
  content = {},
  detail = {},
  itemIndex,
  sectionIndex,
  courseDetails = {},
  initialCurrentContent,
}) => {
  const [viewDoc, setViewDoc] = useState(false)
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

  const getIcon = (url) => {
    const extension = url.split(".").pop()
    switch (extension) {
      case "xls":
      case "xlsx": {
        return <ExcelIcon size="20px" className="text-primary !min-w-[20px]" />
      }
      case "ppt":
      case "pptx": {
        return <PPTIcon size="20px" className="text-primary !min-w-[20px]" />
      }
      default: {
        return <DocumentIcon size="20px" className="text-primary !min-w-[20px]" />
      }
    }
  }
  return (
    <>
      <div
        className={`rounded-lg ${
          currentCourseContent._id === content._id ? "bg-primary-max-light border border-primary" : ""
        }`}
      >
        <div className="flex items-center justify-between p-2 rounded-t-lg">
          <div className="flex items-center justify-between gap-2 w-full">
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
                // setViewDoc(canAccess)
              }}
            >
              {canAccess ? getIcon(content.docId?.uri) : <LockIcon size="20" className="text-gray !min-w-[20px]" />}
              <h4 className={`text-sm font-semibold ${currentCourseContent._id === content._id && "text-primary"}`}>
                {content.nm}
              </h4>
            </div>
            {canAccess && content.canDownload && (
              <OrbitLink download href={content.docId?.uri} target="_blank">
                <DownloadIcon className="mt-2 w-4 h-4 cursor-pointer" />
              </OrbitLink>
            )}
          </div>
        </div>
      </div>
      {viewDoc && (
        <DocumentViewer
          name={content.docId?.oriNm}
          url={getImgUrl(content.docId?.uri)}
          close={() => setViewDoc(false)}
          show={viewDoc}
        />
      )}
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

export default DocumentContent
