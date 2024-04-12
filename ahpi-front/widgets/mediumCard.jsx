import React from "react"

// import StarRatings from "react-star-ratings"
import OrbitLink from "./orbitLink"

const MediumCard = ({
  src,
  title,
  category,
  price,
  originalPrice,
  totalLessons,
  // level,
  //  totalReviews,
  // badge,
}) => {
  return (
    <OrbitLink className="h-full">
      <div>
        <img src={src} className="object-cover w-full h-36" alt="" loading="lazy" />
      </div>
      <div className="relative mid-card  w-11/12  p-4 mx-auto -mt-10 bg-white border rounded-lg border-primary-border hover:border-dark-border transition-shadow hover:shadow-md flex flex-col">
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-dark-gray line-clamp-1">{category}</p>
        </div>
        <h4 className="font-semibold line-clamp-2  mt-1.5">{title}</h4>
        <div className="mt-auto">
          <div className="flex items-center gap-3  mt-1.5">
            <h3 className="font-bold text-primary ">₹ {price}</h3>
            <p className="text-sm line-through text-dark-gray">₹ {originalPrice}</p>
          </div>
          {totalLessons ? (
            //  || level
            <span className="flex flex-wrap items-center text-xs gap-x-2 gap-y-1  mt-1.5">
              {/* <span>{totalLessons} lectures</span>•<span className="font-semibold text-primary">{level}</span>
                  client requirements that review not be display   
              */}
            </span>
          ) : (
            ""
          )}

          {/* {totalReviews ? (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-3  mt-1.5">
              {badge && <div className="bg-primary text-[10px] sm:text-xs py-1 px-2 text-white rounded">{badge}</div>}
              {totalReviews > 0 && (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <StarRatings
                    rating={totalReviews && Number(totalReviews)}
                    numberOfStars={5}
                    starDimension="15px"
                    starSpacing="1px"
                    starRatedColor="#f0b831"
                  />
                  <p className="flex items-center gap-1.5 mt-1">
                    <span className="text-sm font-medium text-yellow">{totalReviews}</span>
                    <span className="text-xs text-dark-gray">{`( ${totalReviews} )`}</span>
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
    </OrbitLink>
  )
}

export default MediumCard
