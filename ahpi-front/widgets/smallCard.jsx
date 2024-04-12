/* eslint-disable no-unused-vars */
import useTranslation from "next-translate/useTranslation"
import React from "react"

// import StarRatings from "react-star-ratings"
// import routes from "utils/routes"
import OrbitLink from "./orbitLink"

const SmallCard = ({
  src,
  category,
  title,
  price,
  originalPrice,
  lecture,
  reviews = true,
  RepeatOrder,
  totalLength,
  level,
  dateTime,
  totalReviews,
  href,
  onClick,
  badge,
  slug,
}) => {
  const { t } = useTranslation(["purchaseHistory", "common"])
  return (
    <div className="flex items-start gap-3 py-4 overflow-hidden rounded-lg ">
      <OrbitLink href={href}>
        <img
          src={src}
          className="lg:min-h-[118px] lg:h-[118px] lg:min-w-[210px] lg:w-[210px] min-h-[64px] h-16 min-w-[64px] w-16 object-cover rounded-md"
          alt=""
          loading="lazy"
        />
      </OrbitLink>
      <div className="grid gap-1.5 w-full">
        <div className="grid grid-cols-12 gap-x-3 gap-y-2">
          <div className="lg:col-span-9 col-span-12">
            <div className="flex items-center justify-between">
              {/* <OrbitLink href={`${routes.courseDetail}/${slug}`}> */}
              <p className="text-xs text-dark-gray">{category}</p>
              {/* </OrbitLink> */}
            </div>
            <OrbitLink href={href}>
              <h3 className="font-semibold line-clamp-2">{title}</h3>
            </OrbitLink>
          </div>
          <div className="flex flex-wrap items-center text-right lg:flex-col lg:items-end gap-y-1 gap-x-3 lg:col-span-3 col-span-12">
            <h3 className="font-bold text-primary whitespace-nowrap">{price === 0 ? "Free" : `₹ ${price}`}</h3>
            <p className="text-sm line-through text-dark-gray">₹ {originalPrice}</p>
          </div>
        </div>

        {lecture || totalLength ? (
          //  || level
          <span className="flex flex-wrap items-center text-xs font-medium gap-x-2 gap-y-1">
            <span>{lecture}</span>•<span>{totalLength}</span>
            {/* <span className="font-semibold text-primary">{level}</span>
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
        <div className="flex flex-wrap items-center gap-3">
          {badge && <div className="px-2 py-1 text-xs text-white rounded bg-primary">{badge}</div>}
          {/* {totalReviews > 0 && (
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
                  client requirements that review not be display   
          */}
        </div>
      </div>
    </div>
  )
}

export default SmallCard
