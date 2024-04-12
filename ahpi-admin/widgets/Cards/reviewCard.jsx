import DeleteIcon from "icons/deleteIcon"
import React from "react"
import StarRatings from "react-star-ratings"
import ReactTooltip from "react-tooltip"
import OrbitLink from "widgets/orbitLink"

const ReviewCard = ({ item, remove = () => {} }) => {
  const { fullName, desc, stars, userId, value } = item
  return (
    <div className="grid grid-cols-1 gap-3 border border-primary-border rounded-lg p-4 sm:p-4 h-full">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <img
            src={userId?.profileId?.uri || "/images/logo.png"}
            className="h-[50px] w-[50px] object-cover rounded-full"
            alt="Profile"
          />
          <div>
            <p className="font-semibold text-primary capitalize">{fullName}</p>
            {/* <p className="text-dark-gray text-xs mt-1.5 sm:mt-1">Designer</p> */}
          </div>
        </div>
        {/* <p className="text-dark-gray text-xs pt-1.5">1 Month ago</p> */}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <StarRatings
            rating={stars && Number(stars)}
            numberOfStars={5}
            starDimension="17px"
            starSpacing="1px"
            starRatedColor="#f0b831"
          />
          <p className="text-xs text-dark-gray mt-1 mr-4">
            <span className="text-yellow">{stars}</span>
          </p>
          <OrbitLink onClick={() => remove(value)} className="self-center">
            <span data-tip="Remove" className="text-xs text-red">
              <DeleteIcon size="14" />
              <ReactTooltip effect="solid" />
            </span>
          </OrbitLink>
        </div>
        <p className="text-dark-gray text-xs font-medium leading-6 line-clamp-5">{desc}</p>
      </div>
    </div>
  )
}

export default ReviewCard
