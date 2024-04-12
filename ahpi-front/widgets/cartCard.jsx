/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable write-good-comments/write-good-comments */
import CoinIcon from "icons/coinIcon"
import useTranslation from "next-translate/useTranslation"
import React from "react"

// import StarRatings from "react-star-ratings"
import OrbitLink from "./orbitLink"

const CartCard = ({
  src,
  category,
  title,
  price,
  originalPrice,
  removeCartItem = () => {},
  courseId,
  handleClickCart = () => false,
  cartData,
  lectures,
  // totalReviews,
  canRemove = true,
  // avgStars = 0,
  elements,
  isBuyXGetX = false,
}) => {
  const { t } = useTranslation("cart")
  const handleCart = (courseId) => {
    removeCartItem(courseId, title)
  }
  return (
    <div className="overflow-hidden border rounded-lg border-primary-border">
      <div className="flex lg:items-center">
        <div className="xl:min-h-[90px] xl:h-[90px] lg:min-h-[116px] min-h-[68px] h-16">
          <img
            key={courseId}
            src={src}
            className="xl:min-h-[90px] xl:h-[90px] lg:min-h-[116px] min-h-[68px] h-16  min-w-[68px] lg:w-32 w-16 object-cover"
            alt=""
            loading="lazy"
          />
        </div>
        <div className="w-full px-3 py-3 lg:py-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-dark-gray">{category}</p>
          </div>
          <div className="flex-wrap items-center justify-between gap-1 lg:flex">
            <p
              className={`font-semibold ${canRemove && "cursor-pointer"} line-clamp-2`}
              onClick={handleClickCart(cartData?.slug)}
            >
              {title}
            </p>
            <div className="flex items-center gap-3">
              <h4 className="font-bold text-primary">{isBuyXGetX ? "Free" : `₹ ${price}`}</h4>
              {originalPrice && <p className="text-sm line-through text-dark-gray">₹ {originalPrice}</p>}
            </div>
            <div className="w-full gap-5 lg:flex lg:items-center">
              {/* {totalReviews > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <StarRatings
                      rating={avgStars}
                      numberOfStars={5}
                      starDimension="17px"
                      starSpacing="1px"
                      starRatedColor="#f0b831"
                    />
                    <p className="text-xs text-dark-gray">
                      <span className="text-yellow">{avgStars}</span> ({totalReviews})
                    </p>
                  </div>
                </div>
              )} 
             client requirements that review not be display   
              */}
              {/* <div className="flex text-xs text-dark-gray">{lectures} lectures | 150h total length</div> */}
              <div className="flex text-xs text-dark-gray">
                {lectures} {elements}{" "}
              </div>

              {canRemove && !isBuyXGetX && (
                <OrbitLink
                  onClick={() => handleCart(courseId)}
                  className="text-xs transition text-primary hover:text-dark-primary hover:underline"
                >
                  {t("removeCourse")}
                </OrbitLink>
              )}
              {cartData?.rewardPoints > 0 ? (
                <div className="flex items-center gap-2">
                  <CoinIcon size="15" />
                  <span className="text-orange text-xs">
                    {t("courseDetail:earn")} {cartData?.rewardPoints} Reward {t("courseDetail:coins")}
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartCard
