/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-danger */
import DocumentIcon from "icons/documentIcon"
import ExcelIcon from "icons/excelIcon"
import PlayIcon from "icons/playIcon"
import PPTIcon from "icons/pptIcon"
import QuizIcon from "icons/quizIcon"
import TextIcon from "icons/textIcon"
import dynamic from "next/dynamic"
import React, { useEffect, useState } from "react"
import useCollapse from "react-collapsed"
import { checkIOSDevice, MATERIAL_TYPES } from "utils/constant"
import OrbitLoader from "widgets/loader"
import OrbitLink from "widgets/orbitLink"

import QuizContentCurrent from "./QuizContentCurrent"

const Video = dynamic(() => import("widgets/Video"), {
  ssr: false,
})
const getDocIcon = (url) => {
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
const getIcon = (type, url) => {
  switch (type) {
    case MATERIAL_TYPES.TEXT: {
      return <TextIcon size="20px" className="text-primary" />
    }
    case MATERIAL_TYPES.VIDEO: {
      return <PlayIcon size="20px" className="text-primary" />
    }
    case MATERIAL_TYPES.DOCS: {
      return getDocIcon(url)
    }
    case MATERIAL_TYPES.QUIZ: {
      return <QuizIcon size="20px" className="text-primary" />
    }
    case MATERIAL_TYPES.QUIZ_CERTIFICATE: {
      return <QuizIcon size="20px" className="text-primary" />
    }

    default: {
      break
    }
  }
  return false
}
const CurrentCourseContent = ({
  content = {},
  videoURL,
  setLoading,
  updateVideoProgress,
  courseDetails,
  updateProgress,
  progressData,
  setShowAddReviewBlock,
  isFromAdmin,
  t,
}) => {
  const [loader, setLoader] = useState(true)
  useEffect(() => {
    setLoader(true)
  }, [content.docId?.uri])
  const getContent = (type) => {
    switch (type) {
      case MATERIAL_TYPES.TEXT: {
        return (
          <div className="gap-3 text-xs">
            <div className="prose ql-editor max-w-none" dangerouslySetInnerHTML={{ __html: content.text }} />
          </div>
        )
      }
      case MATERIAL_TYPES.VIDEO: {
        return (
          <Video
            url={checkIOSDevice() ? videoURL.hslUrl : videoURL.mpdUrl}
            id={videoURL.id}
            setLoading={setLoading}
            playFrom={videoURL.playFrom}
            updateVideoProgress={updateVideoProgress}
            poster={courseDetails?.imgId?.uri}
            autoPlay={videoURL.autoPlay}
            isPosterVideo={videoURL.isPosterVideo}
          />
        )
      }
      case MATERIAL_TYPES.DOCS: {
        return (
          <div onContextMenu="return false;" className="h-[500px]">
            {loader && (
              <div className=" w-[900px] h-[530px] absolute">
                <OrbitLoader relative />
              </div>
            )}
            {content.docId?.uri?.split(".").pop() === "pdf" ? (
              <iframe
                onContextMenu="return false"
                title={content.docId?.oriNm}
                src={`${content.docId?.uri}#toolbar=0&navpanes=0&statusbar=0`}
                width="100%"
                height="100%"
                sandbox
                loading={loader}
                onLoad={() => setLoader(false)}
              />
            ) : (
              <iframe
                onContextMenu="return false"
                title={content.docId?.oriNm}
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${content.docId?.uri}`}
                width="100%"
                height="100%"
                loading={loader}
                onLoad={() => setLoader(false)}
              />
            )}
          </div>
        )
      }
      case MATERIAL_TYPES.QUIZ: {
        return (
          <QuizContentCurrent
            setShowAddReviewBlock={setShowAddReviewBlock}
            progressData={progressData}
            updateProgress={updateProgress}
            content={content}
            isFromAdmin={isFromAdmin}
          />
        )
      }
      // eslint-disable-next-line sonarjs/no-duplicated-branches
      case MATERIAL_TYPES.QUIZ_CERTIFICATE: {
        return (
          <QuizContentCurrent
            setShowAddReviewBlock={setShowAddReviewBlock}
            progressData={progressData}
            updateProgress={updateProgress}
            content={content}
            isFromAdmin={isFromAdmin}
          />
        )
      }

      default: {
        break
      }
    }
    return false
  }
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded: true })
  const [markComplete, setMarkComplete] = useState(content.isLast)

  useEffect(() => {
    setMarkComplete(content.isLast && progressData.sts !== 2)
  }, [content])
  const markAsComplete = () => {
    updateProgress({
      secId: content.secId,
      materialId: content.materialId,
      nextId: content.nextId,
      sts: 2, // send ony if material progress complete
      callback: () => setMarkComplete(false),
    })
  }
  return (
    <div className="rounded-lg border-light-gray">
      <div className="flex items-center justify-between p-2 rounded-t-lg ">
        <div className="flex items-center justify-between gap-2 w-full" {...getToggleProps()}>
          <div className="flex items-center gap-3">
            {getIcon(content?.type, content.docId?.uri)}
            <h4 className="text-sm font-semibold">{content.nm}</h4>
          </div>
          {markComplete && (content.type === MATERIAL_TYPES.TEXT || content.type === MATERIAL_TYPES.DOCS) && (
            <OrbitLink onClick={markAsComplete}>
              <p className="font-semibold text-primary text-base underline">{t("markAsComplete")}</p>
            </OrbitLink>
          )}
        </div>
      </div>
      <div className="bg-gray-50 rounded-b-lg border rounded-lg !h-auto" {...getCollapseProps()}>
        {getContent(content?.type)}
      </div>
    </div>
  )
}

export default CurrentCourseContent
