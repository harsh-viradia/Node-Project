/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable sonarjs/no-duplicate-string */
import AddReview from "components/Reviews/AddReview"
import ReviewBlock from "components/Reviews/index"
import CloseIcon from "icons/closeIcon"
import DoubleTick from "icons/doubleTick"
import SmallRightIcon from "icons/smallRightIcon"
import WorldIcon from "icons/worldIcon"
import useTranslation from "next-translate/useTranslation"
// import { useRouter } from "node_modules/next/router"
import React, { useContext } from "react"
import { useMediaQuery } from "react-responsive"
// import StarRatings from "react-star-ratings"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import GoBackPopover from "shared/widget/goBacktoOGM"
import QuizResetPopover from "shared/widget/QuizResetPopover"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import AppContext from "utils/AppContext"
import routes from "utils/routes"
import getImgUrl, { dateDisplay } from "utils/util"
import OrbitLoader from "widgets/loader"
import OrbitLink from "widgets/orbitLink"
import ShowMoreContent from "widgets/showMoreContent"
import SocialMedia from "widgets/socialMedia"

import CourseContent from "./CourseContent"
import CurrentCourseContent from "./CurrentCourseContent"
import useCourseDetails from "./hook/useCourseDetails"
import ReviewPopup from "./reviewPopup"

// eslint-disable-next-line sonarjs/cognitive-complexity
const ContinueCourse = ({ courseDetails = {}, section, reviewWithPagination, token, isFromAdmin }) => {
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 })
  const { t } = useTranslation("courseDetail")
  // const { locale } = useRouter()
  const {
    loading,
    progressData = {},
    updateProgress,
    setLoading,
    sectionData,
    videoURL = {},
    setVideoUrl,
    updateVideoProgress,
    showAddReviewBlock,
    setShowAddReviewBlock,
    activeSection,
    closeReviewBox,
    goBackToOGM,
    setGoBackToOGM,
    getSectionByCourse,
    quizReset,
    setQuizReset,
    learnerMarks,
  } = useCourseDetails({
    courseDetails,
    section,
    token,
    isFromAdmin,
  })
  const { currentCourseContent } = useContext(AppContext)

  return (
    <LayoutWrapper
      meta={{
        title: courseDetails.title,
        briefdesc: courseDetails.briefDesc,
        imguri: courseDetails.imgId.uri,
        vidId: courseDetails?.vidId?.vidObj.mp4Url,
        slug: courseDetails.slug,
      }}
    >
      <div className="restrict-copy container mb-9">
        {loading && <OrbitLoader />}
        <div className="grid grid-cols-12 gap-6 mt-9">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex flex-wrap items-center gap-1 text-sm text-dark-gray sm:gap-3">
              <OrbitLink className="cursor-pointer text-primary hover:text-dark-primary" href={routes.home}>
                {t("home")}
              </OrbitLink>{" "}
              {!isFromAdmin && (
                <>
                  <SmallRightIcon />{" "}
                  <OrbitLink className="cursor-pointer text-primary hover:text-dark-primary" href={routes.myLearning}>
                    {t("myLearning")}
                  </OrbitLink>{" "}
                </>
              )}
              <SmallRightIcon /> <p>{courseDetails.title}</p>
            </div>
            <div className="object-cover w-full my-4 mb-6 sm:my-7 current-content">
              {currentCourseContent?._id ? (
                <CurrentCourseContent
                  videoURL={videoURL}
                  setLoading={setLoading}
                  updateVideoProgress={updateVideoProgress}
                  updateProgress={updateProgress}
                  poster={courseDetails.imgId?.uri}
                  content={currentCourseContent}
                  getSectionByCourse={getSectionByCourse}
                  progressData={progressData}
                  setShowAddReviewBlock={setShowAddReviewBlock}
                  isFromAdmin={isFromAdmin}
                  t={t}
                />
              ) : (
                ""
              )}
            </div>
            <Tabs>
              <TabList className="my-3 react-tabs__tab-list">
                {isTabletOrMobile && <Tab>{t("courseContent")}</Tab>}
                <Tab>{t("overView")}</Tab>
                <Tab>{t("reView")}</Tab>
              </TabList>
              {isTabletOrMobile && (
                <TabPanel className="mb-3">
                  <CourseContent
                    progressData={progressData}
                    updateProgress={updateProgress}
                    setVideoUrl={setVideoUrl}
                    section={sectionData}
                    courseId={courseDetails}
                    activeSection={activeSection}
                    isFromOgm={progressData?.isFromOgm}
                    showGoBackLink={progressData.sts === 2 && (progressData?.isFromOgm || progressData?.isFromOsc)}
                    initialCurrentContent={showAddReviewBlock === 1 || isFromAdmin}
                    isFromAdmin={isFromAdmin}
                  />
                </TabPanel>
              )}
              <TabPanel>
                <div className="my-3">
                  <h1 className="font-bold">{courseDetails.title}</h1>
                  <div className="flex flex-wrap">
                    <div className="flex flex-wrap items-center gap-6 my-4">
                      {courseDetails.badgeId?.name && (
                        <div className="inline-block px-2 py-1 text-xs text-white rounded bg-primary">
                          {/* {locale === "en" ? courseDetails.badgeId?.names?.en : courseDetails.badgeId?.names?.id} */}
                          {courseDetails.badgeId?.name}
                        </div>
                      )}
                      {/* {courseDetails.totalReviews > 0 && (
                        <div className="flex items-center gap-2">
                          <StarRatings
                            rating={courseDetails.avgStars || 0}
                            numberOfStars={5}
                            starDimension="20px"
                            starSpacing="1px"
                            starRatedColor="#f0b831"
                          />
                          <p className="text-xs text-dark-gray">
                            <span className="text-yellow">{courseDetails.avgStars || 0}</span> (
                            {courseDetails.totalReviews})
                          </p>
                        </div>
                      )} 
                      client requirements that review not be display   
                      */}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 ml-auto">
                      <div className="flex flex-wrap items-center gap-y-4 gap-x-6">
                        <div className="flex items-center gap-2 text-dark-gray">
                          <DoubleTick /> {t("upDate")} {dateDisplay(courseDetails.updatedAt)}
                        </div>
                        <div className="flex items-center gap-2 text-dark-gray">
                          <WorldIcon /> {courseDetails.lang?.name}
                        </div>
                        {/* <div className="flex items-center gap-2 text-dark-gray">
                          {getLevel(courseDetails?.levelId?.name, courseDetails.levelId?.code)}
                        </div> 
                                client requirements that level not be display   
                        */}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-dark-gray mt-9">
                      <ShowMoreContent content={courseDetails.briefDesc} />
                    </p>
                  </div>
                  <div className="mt-9">
                    <h2 className="font-bold">{t("description")}</h2>
                    <ShowMoreContent content={courseDetails.desc} />
                  </div>
                  <div className="mt-9">
                    <h2 className="font-bold">{t("Whatlearn")}</h2>
                    <ShowMoreContent content={courseDetails.about} />
                  </div>

                  <div className="mt-9">
                    <h2 className="font-bold">{t("courseIncluded")}</h2>
                    <ShowMoreContent content={courseDetails.includes} />
                  </div>
                  <div className="mt-9">
                    <h2 className="font-bold">{t("requirements")}</h2>
                    <ShowMoreContent content={courseDetails.require} />
                  </div>

                  <div className="mt-9">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h2 className="font-bold">{t("offeredBy")}</h2>
                      <div className="flex items-center gap-4">
                        <SocialMedia links={courseDetails.userId?.socialLinks} />
                      </div>
                    </div>
                    <div className="mt-3 text-dark-gray">
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={
                            courseDetails.userId?.profileId?.uri
                              ? getImgUrl(courseDetails.userId?.profileId?.uri)
                              : "/images/orbitLogo.png"
                          }
                          className="object-contain w-16 h-16"
                          alt=""
                          loading="lazy"
                        />
                        <p className="text-lg font-semibold text-primary">
                          {courseDetails.userId?.companyNm || courseDetails.userId?.name}
                        </p>
                      </div>
                      <ShowMoreContent content={courseDetails.userId?.bio} />
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel className="mb-3">
                <ReviewBlock
                  courseDetails={courseDetails}
                  canAdd={progressData.sts === 2}
                  showAddReviewBlock={showAddReviewBlock}
                  reviewWithPagination={reviewWithPagination}
                />
              </TabPanel>
            </Tabs>
          </div>
          <div className="hidden col-span-4 lg:block">
            <div>
              <CourseContent
                progressData={progressData}
                updateProgress={updateProgress}
                setVideoUrl={setVideoUrl}
                section={sectionData}
                courseId={courseDetails}
                activeSection={activeSection}
                isFromAdmin={isFromAdmin}
                isFromOgm={progressData?.isFromOgm}
                showGoBackLink={progressData.sts === 2 && (progressData?.isFromOgm || progressData?.isFromOsc)}
                initialCurrentContent={showAddReviewBlock === 1 || isFromAdmin}
              />
            </div>
          </div>
        </div>
      </div>
      {!isFromAdmin && showAddReviewBlock >= 2 && progressData.sts === 2 && (
        <ReviewPopup close={closeReviewBox}>
          <div>
            <div onClick={closeReviewBox} className="absolute right-0 flex p-4 cursor-pointer top-1">
              <CloseIcon size={15} />
            </div>
            <h4 className="font-bold">{t("addYourReview")}</h4>
            <AddReview
              setShowAddReviewBlock={closeReviewBox}
              courseId={courseDetails._id}
              courseName={courseDetails.title}
            />
          </div>
        </ReviewPopup>
      )}
      <GoBackPopover
        progressData={progressData}
        isFromOgm={progressData?.isFromOgm}
        isOpen={goBackToOGM}
        close={() => setGoBackToOGM(false)}
      />
      {quizReset && (
        <QuizResetPopover
          isOpen={quizReset}
          close={() => setQuizReset(false)}
          passingScore={currentCourseContent?.passingScore}
          learnerMarks={learnerMarks}
        />
      )}
    </LayoutWrapper>
  )
}

export default ContinueCourse
