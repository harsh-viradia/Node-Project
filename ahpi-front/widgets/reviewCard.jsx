import React from "react"
import StarRatings from "react-star-ratings"

const ReviewCard = ({ className, mdBottomName = false, fullName, desc, stars, profile }) => {
  return (
    <div className={`grid grid-cols-1 gap-3 border border-primary-border rounded-lg p-4 sm:p-9 h-full ${className}`}>
      <div className={`flex justify-between ${mdBottomName && "order-2 sm:order-1"}`}>
        <div className="flex items-center gap-4">
          <img
            src={profile || "/images/orbitLogo.png"}
            className="h-[50px] w-[50px] object-cover rounded-full"
            alt="Profile"
            loading="lazy"
          />
          <div>
            <p className="font-semibold capitalize text-primary">{fullName}</p>
            {/* <p className="text-dark-gray text-xs mt-1.5 sm:mt-1">Designer</p> */}
          </div>
        </div>
        {/* <p className="text-dark-gray text-xs pt-1.5">1 Month ago</p> */}
      </div>
      <div className={`flex flex-col gap-3 ${mdBottomName && "order-1 sm:order-2"}`}>
        <div className="flex items-center gap-2">
          <StarRatings
            rating={stars && Number(stars)}
            numberOfStars={5}
            starDimension="17px"
            starSpacing="1px"
            starRatedColor="#f0b831"
          />
          <p className="mt-1 text-xs text-dark-gray">
            <span className="text-yellow">{stars}</span>
          </p>
        </div>
        <p className="text-xs font-medium leading-6 text-dark-gray line-clamp-5">{desc}</p>
      </div>
    </div>
  )
}

export default ReviewCard
