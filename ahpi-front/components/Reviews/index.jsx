/* eslint-disable no-underscore-dangle */
import useTranslation from "next-translate/useTranslation"
import React from "react"
import getImgUrl from "utils/util"
import AvgRating from "widgets/avgRating"
import OrbitLink from "widgets/orbitLink"
import ReviewCard from "widgets/reviewCard"

import AddReview from "./AddReview"
import useReview from "./hook/useReview"

const ReviewBlock = ({ courseDetails, canAdd = false, reviewWithPagination, showAddReviewBlock }) => {
  const { t } = useTranslation("courseDetail")
  const {
    reviewList = [],
    getReviewList,
    showYourReview = {},
    showNext,
    page,
  } = useReview({ showAddReviewBlock, courseId: courseDetails._id, reviewWithPagination })
  return (
    <>
      {" "}
      {courseDetails.totalReviews > 0 && <AvgRating courseDetails={courseDetails} />}
      <div className="mt-9">
        <h2 className="font-bold">{t("reviews")}</h2>
        <div className="mt-3">
          <div className="grid gap-3">
            {reviewList.length > 0 ? (
              reviewList?.map((review = {}) => {
                return (
                  <ReviewCard
                    profile={
                      review.userId?.profileId?.uri ? getImgUrl(review.userId?.profileId?.uri) : "/images/orbitLogo.png"
                    }
                    fullName={review.fullName}
                    desc={review.desc}
                    stars={review.stars}
                    className="!p-4"
                  />
                )
              })
            ) : (
              <div>{t("noOfReview")}</div>
            )}
          </div>
          {showNext ? (
            <div className="border mt-4 rounded-lg border-primary-border">
              <OrbitLink
                onClick={() => getReviewList(page + 1)}
                className="cursor-pointer flex items-center justify-center gap-3 px-1 py-4 text-sm border-b-0 border-r sm:py-3 md:py-4 lg:border-b xl:border-b-0 lg:border-r-0 xl:border-r border-light-gray"
              >
                <span>{t("seeMoreReviews")}</span>
              </OrbitLink>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {showYourReview.fullName && (
        <div className="mt-9">
          <h4 className="font-bold">Your Review</h4>
          <ReviewCard
            profile={showYourReview.userId?.profileId?.uri ? getImgUrl(showYourReview.userId?.profileId?.uri) : ""}
            fullName={showYourReview.fullName}
            desc={showYourReview.desc}
            stars={showYourReview.stars}
            className="!p-4 border-none"
          />
        </div>
      )}
      {!showYourReview.fullName && canAdd && (
        <div className="mt-9">
          <h4 className="font-bold">{t("addYourReview")}</h4>
          <AddReview getReviewList={getReviewList} courseId={courseDetails._id} courseName={courseDetails.title} />
        </div>
      )}
    </>
  )
}
export default ReviewBlock
