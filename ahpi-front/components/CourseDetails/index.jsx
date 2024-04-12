/* eslint-disable write-good-comments/write-good-comments */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-underscore-dangle */
import ReviewBlock from "components/Reviews/index"
import CoinIcon from "icons/coinIcon"
import DoubleTick from "icons/doubleTick"
import SmallRightIcon from "icons/smallRightIcon"
import WorldIcon from "icons/worldIcon"
import dynamic from "next/dynamic"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"
// import StarRatings from "react-star-ratings"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import { checkIOSDevice } from "utils/constant"
import routes from "utils/routes"
import getImgUrl, { dateDisplay } from "utils/util"
import OrbitLoader from "widgets/loader"
import OrbitLink from "widgets/orbitLink"
import ShowMoreContent from "widgets/showMoreContent"

import SocialMedia from "../../widgets/socialMedia"
import useCourseDetails from "./hook/useCourseDetails"
import PricingSidebar from "./PricingSidebar"
import QuizCourseContent from "./QuizCourseContent"

const Video = dynamic(() => import("widgets/Video"), {
  ssr: false,
})

// eslint-disable-next-line sonarjs/cognitive-complexity
const CourseDetail = ({ courseDetails = {}, section, reviewWithPagination }) => {
  const { t } = useTranslation("courseDetail")
  const [sectionLength, setSectionLength] = useState(4)
  const { loggedIn, loading, addToCart, addToWishList, setLoading, inWishList, isBuyNowLoading, setIsBuyNowLoading } =
    useCourseDetails({ courseDetails })
  return (
    <LayoutWrapper
      meta={{
        title: courseDetails.title,
        briefdesc: courseDetails.briefDesc,
        imguri: courseDetails.imgId.uri,
        vidId: courseDetails?.vidId?.vidObj?.mp4Url,
        slug: courseDetails.slug,
      }}
    >
      <div className="restrict-copy container mb-9">
        {loading && <OrbitLoader />}
        <div className="grid grid-cols-12 gap-6 mt-6 lg:mt-9">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex flex-wrap items-center text-sm text-dark-gray">
              <OrbitLink className="transition-all hover:text-primary mr-2" href={routes.home}>
                {t("home")}
              </OrbitLink>
              <SmallRightIcon className="mr-2" />
              <OrbitLink
                className="transition-all hover:text-primary mr-1"
                href={`${routes.category}/${courseDetails?.parCategory?.[0]?.slug}?name=${courseDetails?.parCategory?.[0]?.name}`}
              >
                {courseDetails?.parCategory?.[0]?.name},
              </OrbitLink>
              {courseDetails?.category?.map((category, index) => (
                <OrbitLink
                  className="transition-all hover:text-primary mr-1"
                  href={`${routes.category}/${category.slug}?name=${category.name}`}
                >
                  {category.name}
                  {index + 1 === courseDetails?.category?.length ? "" : ","}
                </OrbitLink>
              ))}
            </div>

            <div className="mt-5 mb-3">
              {courseDetails.badgeId?.name && (
                <div className="inline-block px-2 py-1 text-xs text-white rounded bg-primary">
                  {/* {locale === "en" ? courseDetails.badgeId?.names?.en : courseDetails.badgeId?.names?.id} */}
                  {courseDetails.badgeId?.name}
                </div>
              )}
            </div>
            <h1 className="font-bold">{courseDetails.title}</h1>
            <div className="mt-4 text-dark-gray">
              <ShowMoreContent content={courseDetails.briefDesc} />
            </div>
            <div className="object-cover w-full my-4 mb-6 sm:my-7">
              {courseDetails?.vidId?._id ? (
                <Video
                  url={checkIOSDevice() ? courseDetails?.vidId?.vidObj?.hslUrl : courseDetails?.vidId?.vidObj?.mpdUrl}
                  id={courseDetails?.vidId?._id}
                  setLoading={setLoading}
                  // url={checkIOSDevice() ? videoURL.hslUrl : videoURL.mpdUrl}
                  // id={videoURL.id}
                  // setLoading={setLoading}
                  // playFrom={videoURL.playFrom}
                  // updateVideoProgress={updateVideoProgress}
                />
              ) : (
                <img
                  className="w-full mt-7 lg:h-[410px] sm:h-[300px] h-[192px]"
                  src={getImgUrl(courseDetails.imgId?.uri)}
                  alt="Video Streaming is in progress."
                  loading="lazy"
                />
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <div className="flex flex-wrap items-center gap-4">
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
                      <span className="text-yellow">{courseDetails.avgStars || 0}</span> ({courseDetails.totalReviews})
                    </p>
                  </div>
                )}
                                  client requirements that review not be display   
                */}

                {courseDetails?.rewardPoints > 0 ? (
                  <OrbitLink className="flex items-center gap-2">
                    <CoinIcon />
                    <span className="text-orange">
                      {t("earn")} {courseDetails?.rewardPoints || 0} Reward {t("coins")}
                    </span>
                  </OrbitLink>
                ) : (
                  ""
                )}
              </div>
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6">
                <div className="flex items-center gap-2 text-dark-gray">
                  <DoubleTick /> {t("upDate")} {dateDisplay(courseDetails.updatedAt)}
                </div>
                <div className="flex items-center gap-2 text-dark-gray">
                  <WorldIcon /> {courseDetails.lang?.name}
                </div>
                {/* {getLevel(
                  courseDetails.levelId?.name,
                  courseDetails.levelId?.code
                )}
                        client requirements that level not be display   
                */}
              </div>
            </div>
            <div className="block lg:hidden">
              <PricingSidebar
                inWishList={inWishList}
                addToWishList={addToWishList}
                loggedIn={loggedIn}
                addToCart={addToCart}
                courseDetails={courseDetails}
                isBuyNowLoading={isBuyNowLoading}
                setIsBuyNowLoading={setIsBuyNowLoading}
              />
            </div>
            <div className="mt-9">
              <h2 className="font-bold">{t("description")}</h2>
              <ShowMoreContent content={courseDetails.desc || t("nothingToShow")} />
            </div>
            <div className="mt-9">
              <h2 className="font-bold">{t("courseIncluded")}</h2>
              <div className="grid gap-3 mt-4 text-dark-gray">
                <ShowMoreContent content={courseDetails.includes || t("nothingToShow")} />
                {/* <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: courseDetails.includes }} /> */}
              </div>
            </div>
            <div className="mt-9">
              <h2 className="font-bold">{t("courseContent")}</h2>
              {courseDetails.totalSections ? (
                <p className="mt-2 capitalize text-dark-gray">
                  {courseDetails.totalSections} {t("secTions")} &#124; {courseDetails.totalLessons} {t("eleMents")}
                </p>
              ) : (
                ""
              )}
            </div>
            {section?.length ? (
              <div className="mt-4 border rounded-md border-light-gray">
                {section?.length > 0
                  ? section?.slice(0, sectionLength)?.map((detail) => <QuizCourseContent detail={detail} />)
                  : ""}
                {section?.length > sectionLength ? (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                  <OrbitLink onClick={() => setSectionLength(sectionLength + 4)} className="px-5 py-4 sm:px-6 sm:py-5">
                    <p className="text-base font-semibold text-center sm:text-lg">
                      +{section.length - sectionLength} More sections
                    </p>
                  </OrbitLink>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div className="mt-3 text-dark-gray"> {t("nothingToShow")}</div>
            )}
            <div className="mt-9">
              <h2 className="font-bold">{t("requirements")}</h2>
              <ShowMoreContent content={courseDetails.require || t("nothingToShow")} />
              {/* <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: courseDetails.require }} /> */}
            </div>

            {/* <div className="mt-9">
              <h2 className="font-bold">Students also bought</h2>
              <div className="mt-3 mdSliderVisible md:!overflow-visible">
                <Slider {...settings}>
                  {cardData.map((item) => {
                    return (
                      <div className="slidePadding">
                        <MiniCard
                          category={item.category}
                          title={item.title}
                          lecture={item.lecture}
                          price={item.price}
                          originalPrice={item.originalPrice}
                          src={item.src}
                          totalLength={item.totalLength}
                          level={item.level}
                        />
                      </div>
                    )
                  })}
                </Slider>
              </div>
            </div> */}
            <div className="mt-9">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-bold">{t("offeredBy")}</h2>
                <div className="flex items-center gap-4">
                  <SocialMedia links={courseDetails.userId?.socialLinks} />
                </div>
              </div>
              {courseDetails.userId?.name ? (
                <div className="mt-3 text-dark-gray">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={
                        courseDetails.userId?.profileId?.uri
                          ? getImgUrl(courseDetails.userId?.profileId?.uri)
                          : "/images/orbitLogo.png"
                      }
                      className="object-contain w-16 h-16"
                      alt="Instructor"
                      loading="lazy"
                    />
                    <p className="text-lg font-semibold text-primary">
                      {courseDetails.userId?.companyNm || courseDetails.userId?.name}
                    </p>
                  </div>
                  <ShowMoreContent content={courseDetails.userId?.bio} />
                </div>
              ) : (
                <div className="mt-3 text-dark-gray"> {t("nothingToShow")}</div>
              )}
            </div>
            <ReviewBlock
              courseDetails={courseDetails}
              canAdd={courseDetails.isPurchased}
              reviewWithPagination={reviewWithPagination}
            />
          </div>
          <div className="hidden col-span-4 lg:block">
            <PricingSidebar
              inWishList={inWishList}
              addToWishList={addToWishList}
              loggedIn={loggedIn}
              addToCart={addToCart}
              courseDetails={courseDetails}
              isBuyNowLoading={isBuyNowLoading}
              setIsBuyNowLoading={setIsBuyNowLoading}
            />
          </div>
        </div>
      </div>
      {/* <div className="my-9">
        <ExploreCourses t={t} />
      </div> */}
    </LayoutWrapper>
  )
}

export default CourseDetail
