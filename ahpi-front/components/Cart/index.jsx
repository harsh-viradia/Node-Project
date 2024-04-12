/* eslint-disable sonarjs/cognitive-complexity */
import InfoIcon from "icons/infoIcon"
import SmallCloseIcon from "icons/smallCloseIcon"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import routes from "utils/routes"
import getImgUrl from "utils/util"
import Input from "widgets/input"
import OrbitLoader from "widgets/loader"
import OrbitLink from "widgets/orbitLink"

import SmallRightIcon from "../../icons/smallRightIcon"
import LayoutWrapper from "../../shared/wrapper/layoutWrapper"
import Button from "../../widgets/button"
import CartCard from "../../widgets/cartCard"
import useCart from "./hook/useCart"

const CartDetail = ({ cartList, couponAndRewardApply, rewardPointValue, userRewardPoints }) => {
  const { t } = useTranslation("cart")

  const {
    cartData = {},
    loading,
    couponCode,
    couponApplied,
    discountAmount,
    couponAmount,
    loading2,
    couponPercentage,
    couponError,
    getCourseCount,
    removeCartItem,
    doCheckout,
    handleClickCart,
    setCouponCode,
    applyCoupon,
    removeCouponCode,
    userData,
    couponDisabled,
    rewardDisabled,
    applyRewardPoints,
    rewardApplied,
    rewardDiscount,
    usedRewardPoints,
    getCourseTotalPrice,
  } = useCart({ cartList, couponAndRewardApply, rewardPointValue, userRewardPoints, t })

  const onKeyDown = (e) => {
    if (e?.keyCode === 13 && couponCode && !couponApplied) {
      applyCoupon()
    }
  }

  return (
    <LayoutWrapper>
      <div className="container relative">
        {loading && <OrbitLoader relative />}
        <div className="grid grid-cols-12 gap-6 mt-6 mb-16 lg:mt-9">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex flex-wrap items-center gap-1 text-sm text-dark-gray sm:gap-3">
              <OrbitLink className="cursor-pointer text-primary hover:text-dark-primary" href={routes.home}>
                {t("home")}
              </OrbitLink>{" "}
              <SmallRightIcon /> <p>{t("cart")}</p>
            </div>

            <h1 className="mt-6 font-bold">{t("shoppingCart")}</h1>
            <h3 className="my-5 font-semibold py-3 px-5 bg-light-gray/30 rounded-md">
              {cartData.courses?.length ? `${cartData.courses.length} ${t("coursesInCart")}` : `${t("emptyCart")}`}
            </h3>
            <div className="grid gap-3">
              {cartData.courses?.map((item = {}) => {
                return (
                  <CartCard
                    // eslint-disable-next-line no-underscore-dangle
                    courseId={item._id}
                    elements={t("elements")}
                    category={item.parCategory?.[0]?.name}
                    title={item.title}
                    price={item.price?.sellPrice}
                    isBuyXGetX={item.price?.isBuyXGetX}
                    originalPrice={item.price?.MRP}
                    src={getImgUrl(item.imgId?.uri)}
                    removeCartItem={removeCartItem}
                    handleClickCart={handleClickCart}
                    cartData={item}
                    totalReviews={item.totalReviews}
                    avgStars={item.avgStars}
                    lectures={item.totalLessons}
                  />
                )
              })}
            </div>
          </div>
          {cartData.courses?.length ? (
            <div className="col-span-12 lg:col-span-4">
              <div>
                <div className="p-8 border rounded-lg border-light-gray">
                  <div className="hidden mb-3 sm:block">
                    <p className="font-semibold text-dark-gray">{t("total")}</p>
                    <div className="flex items-center gap-4 ">
                      <h1 className="font-bold text-primary">₹ {getCourseTotalPrice()}</h1>
                      <p className="text-sm line-through text-dark-gray">
                        ₹ {cartData.courses.map((a) => a?.price?.MRP || 0).reduce((x, y) => x + y)}
                      </p>
                    </div>
                    {userData?.id ? (
                      !couponAndRewardApply.isBothApplied && userRewardPoints > 0 ? (
                        <div className="flex gap-2 items-center mt-5">
                          <InfoIcon size="18" className="text-primary" />
                          <p className="text-xs"> {t("couponAndRewardBoth")}</p>
                        </div>
                      ) : (
                        ""
                      )
                    ) : (
                      <div className="flex gap-2 items-center mt-5">
                        <InfoIcon size="16" className="text-primary" />
                        <p className="text-xs"> {t("logIntoRedeem")}</p>
                      </div>
                    )}
                    <div className="relative mt-5">
                      <div className="relative flex items-center">
                        {loading2 && <OrbitLoader relative />}
                        <Input
                          placeholder={t("enterCoupon")}
                          className="pr-20"
                          value={couponCode || ""}
                          disabled={couponApplied || couponDisabled}
                          onChange={(event) => setCouponCode(event.target.value?.replaceAll(/\W+/g, "").toUpperCase())}
                          onKeyDown={onKeyDown}
                        />
                        <OrbitLink
                          disabled={!couponCode || couponApplied || couponDisabled}
                          onClick={() => !couponDisabled && couponCode && !couponApplied && applyCoupon()}
                          className={`absolute text-sm font-semibold right-4 ${
                            !couponCode || couponApplied || couponDisabled
                              ? "text-dark-gray cursor-default"
                              : "text-primary"
                          }`}
                        >
                          {t("apply")}
                        </OrbitLink>
                      </div>
                      {couponError && <p className="mt-1 text-xs font-medium text-red">{couponError}</p>}
                    </div>
                    {couponApplied ? (
                      <div className="flex items-center gap-2 mt-3 text-xs">
                        <p>
                          <span className="text-primary">{couponCode}</span> is applied.
                        </p>
                        <OrbitLink onClick={() => removeCouponCode()}>
                          <SmallCloseIcon />
                        </OrbitLink>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {userRewardPoints > 0 && (
                    <div
                      className={`border border-gray p-3 mb-3 ${
                        rewardDisabled ? "bg-light-gray/30 text-dark-gray" : ""
                      }`}
                    >
                      <p className="text-sm font-bold mb-2">{t("RedeemRewards")}</p>
                      <div className="flex items-center mb-2 justify-between text-dark-gray !text-sm font-medium">
                        <p>{t("balance")}</p>
                        <p>
                          {userRewardPoints} {t("points")}
                        </p>
                      </div>
                      <div className="flex items-center mb-2 justify-between text-dark-gray !text-sm font-medium">
                        <p>{t("Discount")}</p>
                        <p>₹ {(userRewardPoints * rewardPointValue.price) / rewardPointValue.reward || 0}</p>
                      </div>
                      <OrbitLink
                        disabled={rewardDisabled}
                        onClick={() => !rewardDisabled && applyRewardPoints()}
                        className={`w-full flex justify-right text-sm font-semibold ${
                          rewardDisabled ? "text-dark-gray cursor-default" : "text-primary"
                        }`}
                      >
                        {rewardApplied ? t("clear") : t("redeem")}
                      </OrbitLink>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold">{t("Summary")}</h3>
                    <div className="grid gap-3 pb-3 mt-4 mb-3 border-b border-primary-gray">
                      <div className="flex items-center justify-between text-dark-gray !text-sm font-medium">
                        <p>{t("TotalItem")}</p>
                        <p>{cartData.courses?.length}</p>
                      </div>
                      <div className="flex items-center justify-between text-dark-gray !text-sm font-medium">
                        <p>{t("OriginalPrice")}</p>
                        <p>₹ {cartData.courses?.map((a) => a?.price?.sellPrice || 0)?.reduce((x, y) => x + y)}</p>
                      </div>
                      {couponApplied && (
                        <div className="flex items-center justify-between text-dark-gray !text-sm font-medium">
                          <p>{t("couponDiscount")}</p>
                          <p>
                            - ₹ {couponAmount || 0}
                            {couponPercentage ? ` (${couponPercentage}%)` : ""}
                            {getCourseCount ? ` (${getCourseCount} Course(s) Free)` : ""}
                          </p>
                        </div>
                      )}
                      {rewardApplied && (
                        <>
                          <div className="flex items-center justify-between text-dark-gray !text-sm font-medium">
                            <p>{t("rewardPointDiscount")}</p>
                            <p>- ₹ {rewardDiscount || 0}</p>
                          </div>
                          <div className="flex justify-end text-dark-gray !text-sm font-medium">
                            <p>{`(${usedRewardPoints} ${t("rewardPointsRedeemed")})`}</p>
                          </div>
                        </>
                      )}
                      <div className="flex items-center justify-between text-dark-gray !text-sm font-medium">
                        <p>{t("Tax")}</p>
                        <p>{0}%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between !text-base font-semibold">
                      <p>{t("total")}</p>
                      <p>
                        ₹{" "}
                        {couponApplied
                          ? rewardApplied
                            ? ((discountAmount || 0) - (rewardDiscount || 0) < 0
                                ? 0
                                : (discountAmount || 0) - (rewardDiscount || 0)
                              ).toFixed(2)
                            : discountAmount.toFixed(2)
                          : (getCourseTotalPrice() - (rewardDiscount || 0)).toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-4">
                      <Button onClick={doCheckout} title={t("Checkout")} size="w-full" primaryShadowBTN />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default CartDetail
