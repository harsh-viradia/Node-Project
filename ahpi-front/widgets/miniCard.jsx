/* eslint-disable sonarjs/cognitive-complexity */
// import useTranslation from "next-translate/useTranslation"
import React from "react"

// import StarRatings from "react-star-ratings"
import OrbitLink from "./orbitLink"

const MiniCard = ({
  src,
  category,
  title,
  price,
  originalPrice,
  lecture,
  time,
  alignCenter,
  totalLength,
  // level,
  bestSeller,
  reviews = true,
  // totalReviews,
}) => {
  // const { t } = useTranslation("common")
  return (
    <OrbitLink className="flex gap-3 py-4 overflow-hidden rounded-lg ">
      <div className="shrink-0">
        <img
          src={src}
          className="min-h-[64px] h-16 min-w-[64px] w-16 object-contain rounded-md"
          alt=""
          loading="lazy"
        />
      </div>
      <div className="grid w-full gap-2">
        <div className="grid gap-1">
          <div className={alignCenter ? "flex items-center w-full gap-3" : "contents"}>
            {category && <p className="text-xs truncate text-dark-gray">{category}</p>}
            <div
              className={`${alignCenter ? "flex-col sm:flex-row gap-1.5" : "items-center"} flex justify-between w-full`}
            >
              <h4 className="font-semibold line-clamp-2">{title}</h4>
              <p className="text-xs text-dark-gray">{time}</p>
            </div>
          </div>
          {price === 0 || price || originalPrice ? (
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-primary whitespace-nowrap">{price === 0 ? "Free" : `₹ ${price}`}</h3>
              <p className="text-sm line-through text-dark-gray">₹ {originalPrice}</p>
            </div>
          ) : (
            ""
          )}
        </div>
        {lecture || totalLength ? (
          //  || level
          <span className="flex flex-wrap items-center text-xs gap-x-2 gap-y-1">
            <span>{lecture}</span>•<span>{totalLength}</span>Element
            {/* <span className="font-semibold text-primary">{level}</span>
              client requirements that level not be display   
            */}
          </span>
        ) : (
          ""
        )}

        {bestSeller || reviews ? (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
            {bestSeller && (
              <div className="bg-primary text-[10px] sm:text-xs py-1 px-2 text-white rounded">{bestSeller}</div>
            )}
            {/* {reviews && ( */}
            {/* {totalReviews > 0 && (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <StarRatings
                  rating={reviews && Number(reviews)}
                  numberOfStars={5}
                  starDimension="15px"
                  starSpacing="1px"
                  starRatedColor="#f0b831"
                />
                <p className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm font-medium text-yellow">{reviews}</span>
                  <span className="text-xs text-dark-gray">{`( ${totalReviews} )`}</span>
                </p>
              </div>
            )} 
             client requirements that review not be display   
            */}
            {/* )} */}
          </div>
        ) : (
          ""
        )}
      </div>
    </OrbitLink>
  )
}

export default MiniCard
