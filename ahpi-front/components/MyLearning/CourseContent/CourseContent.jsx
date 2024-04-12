/* eslint-disable jsx-a11y/click-events-have-key-events */
import getConfig from "next/config"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"
import OrbitLink from "widgets/orbitLink"

import CourseContentDescription from "./CourseContentDescription"

const { publicRuntimeConfig } = getConfig()

const CourseContent = ({
  section = [],
  setVideoUrl = () => {},
  progressData = {},
  updateProgress = () => {},
  courseId,
  activeSection,
  showGoBackLink,
  initialCurrentContent,
  isFromAdmin,
  isFromOgm,
}) => {
  const { t } = useTranslation("courseDetail")
  const [sectionLength, setSectionLength] = useState()
  const router = useRouter()
  useEffect(() => {
    const sc = sectionLength || 4
    if (activeSection > sc) setSectionLength(activeSection + 1)
    if (activeSection < sc) setSectionLength(sc)
  }, [activeSection])
  return (
    <div className="border border-light-gray rounded-md w-full">
      <div className="flex justify-between flex-row items-center py-4 sm:py-5 px-5 sm:px-6 border-b border-light-gray">
        <h3>{t("courseContent")}</h3>
        {!isFromAdmin &&
          showGoBackLink &&
          (isFromOgm ? (
            <OrbitLink
              className="text-primary text-sm underline flex items-center gap-3"
              href={`${publicRuntimeConfig.NEXT_PUBLIC_OGM_URL}/${router.locale}`}
            >
              {t("common:goBackTo")}
              <img src="https://www.ogmapp.id/images/Logo.png" className="h-16" alt="" />
            </OrbitLink>
          ) : (
            <OrbitLink
              className="text-primary text-sm underline flex items-center gap-3"
              href={`${progressData?.redirectUrl}/${router.locale}`}
            >
              {t("common:goBackToOsc")}
            </OrbitLink>
          ))}
      </div>
      {!isFromAdmin && (
        <div className="py-4 sm:py-5 px-5 sm:px-6 border-b border-light-gray">
          <div className="grid gap-3 w-full text-xs">
            <div className="flex items-center gap-3 justify-between">
              <p className="text-sm">{t("courseCompletion")}</p>
              <p className="text-primary">{progressData.progress}%</p>
            </div>
            <div className="w-full h-1 bg-light-gray">
              <div style={{ width: `${progressData.progress || 0}%` }} className="h-1 bg-primary left-0 top-0" />
            </div>
          </div>
        </div>
      )}
      {/* <PreviewContent /> */}
      {section?.length
        ? section
            ?.slice(0, sectionLength)
            ?.map((detail, index) => (
              <CourseContentDescription
                key={courseId}
                sectionIndex={index}
                updateProgress={updateProgress}
                setVideoUrl={setVideoUrl}
                detail={detail}
                courseDetails={section}
                courseId={courseId}
                progressData={progressData}
                activeSection={activeSection}
                initialCurrentContent={initialCurrentContent}
                isFromAdmin={isFromAdmin}
              />
            ))
        : ""}
      {section?.length > sectionLength ? (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div onClick={() => setSectionLength(sectionLength + 4)} className="px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-base font-semibold text-center sm:text-lg">
            {`+${section.length - sectionLength} ${t("common:moreSections")}`}
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default CourseContent
