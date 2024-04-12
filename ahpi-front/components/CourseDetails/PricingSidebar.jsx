/* eslint-disable react/no-danger */
import HeartFillIcon from "icons/heartFillIcon"
import HeartIcon from "icons/heartIcon"
import ShareIcon from "icons/shareIcon"
import getConfig from "next/config"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import { RWebShare } from "react-web-share"
import routes from "utils/routes"
import Button from "widgets/button"
import OrbitLink from "widgets/orbitLink"
import ShowMoreContent from "widgets/showMoreContent"

const { publicRuntimeConfig } = getConfig()
const PricingSidebar = ({
  loggedIn,
  courseDetails = {},
  addToCart = () => {},
  addToWishList = () => {},
  inWishList,
  isBuyNowLoading,
  setIsBuyNowLoading,
}) => {
  const router = useRouter()
  const { t } = useTranslation("courseDetail")
  return (
    <div className="mt-4 rounded-lg lg:border lg:mt-0 border-light-gray">
      <div className="p-0 lg:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <p className="font-bold text-primary text-[30px]">
              {courseDetails.price?.sellPrice ? `₹ ${courseDetails.price?.sellPrice}` : "Free"}
            </p>
            <p className="text-sm line-through text-dark-gray">₹ {courseDetails.price?.MRP || 0}</p>
          </div>
          {loggedIn ? (
            <OrbitLink
              onClick={() => addToWishList()}
              className="flex items-center justify-center w-10 h-10 transition-all border rounded-lg border-light-gray text-light-gray hover:text-white color-light-gray hover:bg-primary hover:border-primary"
            >
              {inWishList ? <HeartFillIcon /> : <HeartIcon />}
            </OrbitLink>
          ) : (
            ""
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-1">
          {courseDetails?.inCart ? (
            <Button
              size="w-full"
              onClick={() => router.push(routes.cart)}
              title={t("alreadyInCart")}
              primaryShadowBTN
            />
          ) : (
            <Button size="w-full" onClick={() => addToCart(false)} title={t("addToCart")} primaryShadowBTN />
          )}
          <Button
            size="w-full"
            loading={isBuyNowLoading}
            disabled={isBuyNowLoading}
            onClick={() => {
              addToCart(true)
              setIsBuyNowLoading(true)
            }}
            title={t("buyNow")}
            outlineShadowBTN
          />
        </div>
      </div>
      <div className="py-6 lg:border-y border-light-gray lg:px-6">
        <div className="grid grid-cols-1 border rounded-lg lg:grid-cols-1 xl:grid-cols-1 border-light-gray">
          <RWebShare
            data={{
              text: t("shareMessage"),
              url: `${publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL}${routes.courseDetail}/${courseDetails.slug}/`,
            }}
            // onClick={() => Toast("Link Copied!")}
          >
            <div className="cursor-pointer flex items-center justify-center gap-3 px-1 py-4 text-sm border-b-0 border-r sm:py-3 md:py-4 lg:border-b xl:border-b-0 lg:border-r-0 xl:border-r border-light-gray">
              <ShareIcon />
              <span>{t("share")}</span>
            </div>
          </RWebShare>
          {/* <OrbitLink href="#" className="flex items-center justify-center gap-3 px-1 py-4 text-sm sm:py-3 md:py-4">
            <CouponIcon />
            <span>{t("applyCoupon")}</span>
          </OrbitLink> */}
        </div>
      </div>
      <div className="p-0 lg:p-6">
        <h2 className="font-bold">{t("Whatlearn")}</h2>
        <div className="grid gap-4 mt-4 text-dark-gray">
          <ShowMoreContent content={courseDetails?.about || t("nothingToShow")} className="w-full" />
          {/* <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: courseDetails.about }} /> */}
        </div>
      </div>
    </div>
  )
}

export default PricingSidebar
