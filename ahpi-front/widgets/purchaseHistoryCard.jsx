/* eslint-disable no-unused-vars */
import useTranslation from "next-translate/useTranslation"
import React from "react"
// import StarRatings from "react-star-ratings"
import routes from "utils/routes"

import OrbitLink from "./orbitLink"

const PurchaseHistoryCard = ({
  src,
  category,
  title,
  price,
  originalPrice,
  lecture,
  reviews = true,
  tag = true,
  RepeatOrder,
  totalLength,
  level,
  dateTime,
  totalReviews,
  href,
  onClick,
  slug,
}) => {
  const { t } = useTranslation(["purchaseHistory", "common"])
  return (
    <div className="flex gap-3 py-4 overflow-hidden rounded-lg ">
      <OrbitLink href={href} className="self-center">
        <img
          src={src}
          className="lg:min-h-[118px] lg:h-[118px] lg:min-w-[210px] lg:w-[210px] min-h-[64px] h-16 min-w-[64px] w-16 object-cover rounded-md"
          alt=""
          loading="lazy"
        />
      </OrbitLink>
      <div className="grid gap-1.5 w-full">
        <div className="grid items-center justify-between gap-3 lg:flex">
          <div>
            <div className="flex items-center justify-between">
              {/* <OrbitLink href={`${routes.courseDetail}/${slug}`}> */}
              <p className="text-xs text-dark-gray">{category}</p>
              {/* </OrbitLink> */}
            </div>
            <OrbitLink href={href}>
              <h3 className="font-semibold line-clamp-2">{title}</h3>
            </OrbitLink>
          </div>
          {(price || originalPrice || dateTime) && (
            <div className="flex flex-wrap items-center text-right lg:flex-col lg:items-end gap-y-1 gap-x-3">
              {price && <h3 className="font-bold text-primary whitespace-nowrap">₹ {price}</h3>}
              {originalPrice && <p className="text-sm line-through text-dark-gray">₹ {originalPrice}</p>}
              {dateTime && <p className="text-xs sm:text-sm text-dark-gray whitespace-nowrap">{dateTime}</p>}
            </div>
          )}
        </div>
        {lecture || totalLength ? (
          //  || level
          <span className="flex flex-wrap items-center text-xs font-medium gap-x-2 gap-y-1">
            {lecture && <span>{lecture}</span>}
            {totalLength && (
              <>
                • <span>{totalLength}</span>
              </>
            )}
            {/* {level && <>| {level}</>}
                           client requirements that level not be display   
            */}
          </span>
        ) : (
          ""
        )}
        {RepeatOrder && (
          <OrbitLink
            href={href}
            onClick={onClick}
            className="inline-flex text-sm font-medium underline transition text-primary hover:text-black"
          >
            {t("purchaseHistory:RepeatOrder")}
          </OrbitLink>
        )}

        {/* {tag ? (
          <div className="flex flex-wrap items-center gap-3">
            {tag && <div className="px-2 py-1 text-xs text-white rounded bg-primary">{t("common :bestSeller")}</div>}
            {totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <StarRatings
                  rating={reviews && Number(reviews)}
                  numberOfStars={5}
                  starDimension="15px"
                  starSpacing="1px"
                  starRatedColor="#f0b831"
                />
                <p className="text-xs text-dark-gray">
                  <span className="text-yellow">{reviews}</span> {`( ${totalReviews} )`}
                </p>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
                 client requirements that review not be display   
        */}
      </div>
    </div>
  )
}

export default PurchaseHistoryCard
