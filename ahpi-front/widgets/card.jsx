/* eslint-disable sonarjs/cognitive-complexity */
import * as amplitude from "@amplitude/analytics-browser"
import DownloadIcon2 from "icons/downloadIcon2"
import EyeIcon from "icons/eyeIcon"
import HeartFillIcon from "icons/heartFillIcon"
import HeartIcon from "icons/heartIcon"
import useTranslation from "next-translate/useTranslation"
import React, { useContext } from "react"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT } from "utils/constant"
// import StarRatings from "react-star-ratings"
import routes from "utils/routes"

import OrbitLink from "./orbitLink"

const Card = ({
  src,
  title,
  category,
  price,
  originalPrice,
  // star = true,
  process,
  completed,
  status,
  showCertificate,
  className,
  bestSeller = false,
  // reviews,
  // totalReviews,
  showProcess = false,
  slug = "",
  addToWishList = () => {},
  wishList,
  isSaved,
  fromMyLearning = false,
  certiCode,
  certiUri,
  courseId,
}) => {
  const { t } = useTranslation("common")
  const { userData } = useContext(AppContext)

  return (
    <div
      className={`overflow-hidden border rounded-lg border-primary-border hover:border-dark-border hover:shadow-md transition-shadow flex flex-col h-full ${className}`}
    >
      <div>
        <img src={src} className="object-cover w-full h-[200px]" alt="" loading="lazy" />
      </div>
      <div className="grid gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-xs text-dark-gray truncate ${bestSeller ? "w-2/4" : "w-full"} `}>{category}</p>
          {bestSeller ? <div className="px-2 py-1 text-xs text-white rounded bg-primary ">{bestSeller}</div> : <div />}
        </div>
        <OrbitLink href={`${fromMyLearning ? routes.myLearning : routes.courseDetail}/${slug}`}>
          <h4 className="font-semibold line-clamp-2">{title}</h4>
        </OrbitLink>
        <div className="flex flex-row items-center justify-between">
          <div>
            {/* {star && totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <StarRatings
                  rating={Number(reviews)}
                  numberOfStars={5}
                  starDimension="15px"
                  starSpacing="1px"
                  starRatedColor="#f0b831"
                />
                <p className="mt-1 text-xs text-dark-gray">
                  <span className="text-yellow">{reviews}</span>
                  {` (${totalReviews})`}
                </p>
              </div>
            )} 
          client requirements that review not be display   
            */}
            {price === 0 || price || originalPrice ? (
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-primary">{price === 0 ? "Free" : `₹ ${price}`}</h3>
                <p className="text-sm line-through text-dark-gray">₹ {originalPrice}</p>
              </div>
            ) : (
              ""
            )}
          </div>
          {wishList && (
            <div className="ml-auto">
              <OrbitLink
                onClick={() => addToWishList()}
                className="flex items-center justify-center w-10 h-10 transition-all border rounded-lg border-light-gray text-light-gray hover:text-white color-light-gray hover:bg-primary hover:border-primary"
              >
                {isSaved ? <HeartFillIcon /> : <HeartIcon />}
              </OrbitLink>
            </div>
          )}
        </div>
      </div>
      {showProcess || status || completed || showCertificate ? (
        <div className="px-4 pb-4 mt-auto">
          {showProcess && (
            <div className="relative w-full h-1 mb-2 bg-light-gray">
              <div style={{ width: `${process}%` }} className="absolute top-0 left-0 h-full bg-primary" />
            </div>
          )}
          {!completed && (
            <OrbitLink
              href={`${fromMyLearning ? routes.myLearning : routes.courseDetail}/${slug}`}
              onClick={() => {
                if (status && status.sts === 2 ? undefined : status.progress) {
                  amplitude.track(ANALYTICS_EVENT.CONTINUE_COURSE, {
                    userEmail: userData?.email,
                    userId: userData?.id,
                    courseName: title,
                    courseId,
                  })
                } else {
                  amplitude.track(ANALYTICS_EVENT.START_COURSE, {
                    userEmail: userData?.email,
                    userId: userData?.id,
                    courseName: title,
                    courseId,
                  })
                }
              }}
              className="flex flex-wrap items-center justify-between text-sm"
            >
              {status && (
                <span className="text-primary">
                  {status.sts === 2 ? undefined : status.progress ? t("continue") : t("start")}
                </span>
              )}
              {process > 0 && (
                <span className="text-dark-gray">
                  {process}% {t("completed")}
                </span>
              )}
            </OrbitLink>
          )}
          {showCertificate ? (
            <div className="flex flex-wrap items-center justify-between gap-3 font-medium text-xs">
              {certiCode && (
                <OrbitLink
                  href={`${routes.certificate}/${certiCode}`}
                  className="flex items-center gap-2 text-dark-gray"
                >
                  <EyeIcon />
                  {t("viewCertificate")}
                </OrbitLink>
              )}
              {certiUri && (
                <OrbitLink
                  href={certiUri}
                  onClick={() => {
                    amplitude.track(ANALYTICS_EVENT.DOWNLOAD_CERTIFICATE, {
                      userEmail: userData?.email,
                      userId: userData?.id,
                      CertificateId: certiCode,
                      courseId,
                    })
                  }}
                  download
                  target="_blank"
                  className="flex items-center gap-2 text-primary"
                >
                  <DownloadIcon2 />
                  {t("certiFicate")}
                </OrbitLink>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default Card
