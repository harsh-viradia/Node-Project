import StarIcon from "icons/starIcon"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import StarRatings from "react-star-ratings"

const RatingKeys = [
  { key: "5Stars", value: 5 },
  { key: "4Stars", value: 4 },
  { key: "3Stars", value: 3 },
  { key: "2Stars", value: 2 },
  { key: "1Stars", value: 1 },
]
const AvgRating = ({ courseDetails = {} }) => {
  const { avgStars, ratings = {}, totalReviews = 0 } = courseDetails
  const { t } = useTranslation("courseDetail")
  return (
    <div className="mt-9">
      <h2 className="font-bold">{t("studentFeedback")}</h2>
      <div className="grid grid-cols-10 sm:grid-cols-12 mt-6 gap-y-4 gap-x-8">
        <div className="col-span-10 sm:col-span-3 flex sm:flex-col items-center justify-between sm:justify-center sm:gap-4">
          <div className="flex sm:flex-col items-center gap-4">
            <h1 className="font-bold text-[30px] sm:text-[40px] sm:text-7xl">{avgStars || 0}</h1>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <StarRatings
                rating={avgStars || 0}
                numberOfStars={5}
                starDimension="20px"
                starSpacing="1px"
                starRatedColor="#f0b831"
              />
            </div>
          </div>
          <p className=" text-sm sm:text-base text-dark-gray">{t("courseRating")}</p>
        </div>
        <div className="col-span-10 sm:col-span-9">
          <div className="grid gap-2">
            {RatingKeys.map((rating) => (
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2 xl:col-span-1 gap-2 flex items-center justify-around">
                  <p className="font-medium">{rating.value}</p>
                  <StarIcon size="18" />
                </div>
                <div className="col-span-8 sm:col-span-9 xl:col-span-10 relative w-full h-3 rounded-full bg-primary-light">
                  <div
                    style={{ width: `${(ratings[rating.key] * 100) / totalReviews}%` }}
                    className="bg-primary rounded-full h-full absolute left-0 top-0"
                  />
                </div>
                <p className="col-span-2 sm:col-span-1 text-center font-medium">{ratings[rating.key] || 0}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvgRating
