/* eslint-disable no-underscore-dangle */
/* eslint-disable write-good-comments/write-good-comments */
import AddIcon from "icons/addIcon"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"
import DrawerWrapper from "shared/drawer"
import { LocalStorage } from "utils/localStorage"
import routes from "utils/routes"
import getImgUrl from "utils/util"
import AddAddress from "widgets/addAddressDrawer"

import LockIcon from "../../icons/lockIcon"
import SmallRightIcon from "../../icons/smallRightIcon"
import LayoutWrapper from "../../shared/wrapper/layoutWrapper"
import Button from "../../widgets/button"
import CartCard from "../../widgets/cartCard"
import OrbitLink from "../../widgets/orbitLink"
import RadioButton from "../../widgets/radioButton"
import useCheckOut from "./hook/useCheckout"

const Checkout = ({ cartData, addressData, rewardPointValue = {} }) => {
  const { t } = useTranslation("checkout")
  const [open, setOpen] = useState(false)
  const [editAddress, setEditaddress] = useState("")
  const [isNewAddress, setIsNewAddress] = useState(true)
  const grandTotal = cartData?.grandTotal < 0 ? 0 : cartData?.grandTotal
  const formattedGrandTotal = grandTotal.toFixed(2)

  const {
    loading,
    onSubmit,
    defaultAddress = {},
    addressPopup,
    handlePopup,
    setDefaultAddress,
  } = useCheckOut({ cartData, addressData, t })
  const router = useRouter()
  return (
    <LayoutWrapper>
      <div className="container">
        {/* {loading && <OrbitLoader relative />} */}
        <div className="grid grid-cols-12 gap-6 mt-6 mb-16 lg:mt-9 lg:mb-20">
          <div className="col-span-12">
            <div className="flex flex-wrap items-center gap-1 text-sm text-dark-gray sm:gap-3">
              <OrbitLink className="cursor-pointer text-primary hover:text-dark-primary" href={routes.home}>
                {t("home")}
              </OrbitLink>{" "}
              <SmallRightIcon />{" "}
              <OrbitLink className="cursor-pointer text-primary hover:text-dark-primary" href={routes.cart}>
                {t("cart")}
              </OrbitLink>{" "}
              <SmallRightIcon /> <p>{t("Checkout")}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <h1 className="">{t("Checkout")}</h1>
              <OrbitLink href={routes.cart} className="transition-all hover:text-primary">
                {t("canCel")}
              </OrbitLink>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <h3 className="mb-5 font-semibold">{t("billingAddress")}</h3>
            {defaultAddress._id && (
              <div className="flex flex-col flex-1 border rounded-lg border-gray-300">
                <div className="flex flex-col p-5">
                  <p> {defaultAddress.addrLine1}</p>
                  <p> {defaultAddress.addrLine2}</p>
                  <p>{`${defaultAddress.cityNm}, ${defaultAddress.zipcode}`}</p>
                  <p>{defaultAddress.stateNm}</p>
                  <p>{defaultAddress.countryNm}</p>
                </div>
                <div className="pl-5 flex gap-3 mt-auto mb-5">
                  {defaultAddress?.isDefault ? (
                    ""
                  ) : (
                    <>
                      <OrbitLink
                        onClick={() => {
                          LocalStorage.set(
                            "addressRedirection",
                            `${routes.checkout}/${router.query?.orderNo || ""}?selection=${addressPopup}`
                          )
                          setOpen(true)
                          setEditaddress(defaultAddress)
                          setIsNewAddress(false)
                          // router.push(`${routes.addAddress}?id=${defaultAddress._id}`)
                        }}
                        className="text-primary hover:text-red"
                      >
                        {t("address:edit")}
                      </OrbitLink>{" "}
                      |
                    </>
                  )}
                  <OrbitLink onClick={handlePopup} className="text-primary hover:text-red">
                    {t("change")}
                  </OrbitLink>
                </div>
              </div>
            )}
            <OrbitLink
              // eslint-disable-next-line sonarjs/no-identical-functions
              onClick={() => {
                LocalStorage.set(
                  "addressRedirection",
                  `${routes.checkout}/${router.query?.orderNo || ""}?selection=${addressPopup}`
                )
                setOpen(true)
                setEditaddress("")
                setIsNewAddress(true)
                // router.push(`${routes.addAddress}`)
              }}
              className="text-primary hover:text-dark-primary flex items-center mt-6"
            >
              <AddIcon className="w-4 h-4 mr-2" /> {t("addNewAddress")}
            </OrbitLink>
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold ">{t("paymentMethod")}</h3>
                <span className="flex items-center gap-1.5 text-sm text-dark-gray">
                  <LockIcon />
                  {t("Secured")}
                </span>
              </div>
              <div className="mt-3 border rounded-lg border-light-gray">
                <div className="flex items-center justify-between p-4 border-b border-light-gray">
                  <RadioButton defaultChecked title="Paytm" name="Paytm" id="Paytm" />
                  <img src="images/midtrans.png" alt="" />
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-semibold ">{t("orderSummary")}</h3>
              <div className="grid gap-3 mt-3">
                {cartData.courses?.map((item = {}) => {
                  return (
                    <CartCard
                      cartData={item}
                      elements={t("elements")}
                      // eslint-disable-next-line no-underscore-dangle
                      courseId={item._id}
                      category={item.parCategory?.[0]?.name}
                      title={item.nm}
                      price={item.price}
                      isBuyXGetX={item.price === 0}
                      originalPrice={item.price?.MRP}
                      src={getImgUrl(item.imgId?.uri)}
                      // removeCartItem={removeCartItem}
                      canRemove={false}
                      lectures={item?.totalLessons}
                      totalReviews={item?.totalReviews}
                      avgStars={item.avgStars}
                    />
                  )
                })}
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 ">
            <div>
              <div className="p-0 rounded-lg sm:p-8 sm:border border-light-gray">
                <div>
                  <h3 className="font-bold">{t("summary")}</h3>
                  <div className="grid gap-3 pb-3 mt-4 mb-3 border-b border-primary-gray">
                    <div className="flex items-center justify-between text-dark-gray">
                      <p className="font-medium sm:text-sm">{t("totalItem")}</p>
                      <p className="font-medium sm:text-sm">{cartData.courses?.length}</p>
                    </div>
                    <div className="flex items-center justify-between text-dark-gray">
                      <p className="font-medium sm:text-sm">{t("originalPrice")}</p>
                      <p className="font-medium sm:text-sm">₹ {cartData?.subTotal || 0}</p>
                    </div>
                    <div className="flex items-center justify-between text-dark-gray">
                      <p className="font-medium sm:text-sm">{t("cart:couponDiscount")}</p>
                      <p className="font-medium sm:text-sm">
                        - ₹{" "}
                        {cartData?.coupon?.couponAmt ||
                          (cartData?.coupon?.couponPercent
                            ? `${(Number(cartData?.subTotal) * Number(cartData?.coupon?.couponPercent)) / 100} (${
                                cartData?.coupon?.couponPercent
                              }%)`
                            : 0)}{" "}
                        {cartData?.coupon && cartData?.courses?.filter((x) => x.price === 0)?.length
                          ? ` (${cartData.courses?.filter((x) => x.price === 0)?.length} Course(s) Free)`
                          : ""}
                      </p>
                    </div>
                    {cartData?.usedRewardsForOrder > 0 && (
                      <>
                        <div className="flex items-center justify-between text-dark-gray !text-sm font-medium">
                          <p>{t("rewardPointDiscount")}</p>
                          <p>
                            - ₹ {(cartData.usedRewardsForOrder * rewardPointValue.price) / rewardPointValue.reward || 0}
                          </p>
                        </div>
                        <div className="flex justify-end text-dark-gray !text-sm font-medium">
                          <p>{`(${cartData?.usedRewardsForOrder} ${t("rewardPointsRedeemed")})`}</p>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-between text-dark-gray">
                      <p className="font-medium sm:text-sm">{t("tax")}</p>
                      <p className="font-medium sm:text-sm">{cartData.tax || 0}%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <p className="!text-base font-semibold">{t("total")}</p>
                    <p className="!text-base font-semibold">₹ {formattedGrandTotal}</p>
                  </div>
                  <div className="mt-4 sm:block">
                    <Button
                      loading={loading}
                      onClick={onSubmit}
                      title={t("completeCheckout")}
                      size="w-full"
                      primaryShadowBTN
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DrawerWrapper open={addressPopup} setOpen={handlePopup}>
        <div className="p-10 flex flex-col gap-2">
          {addressData?.map((data) => {
            return (
              <OrbitLink
                className={`flex flex-col flex-1 border rounded-lg hover:border-dark-primary ${
                  data._id === defaultAddress._id ? "border-primary" : "border-gray-300"
                }`}
                onClick={() => {
                  setDefaultAddress(data)
                  handlePopup()
                }}
              >
                {data.isDefault && <div className="p-3 rounded-t-lg bg-gray-300 font-bold">Default</div>}
                <div className="flex flex-col p-5">
                  <p> {data.addrLine1}</p>
                  <p> {data.addrLine2}</p>
                  <p>{`${data.cityNm}, ${data.zipcode}`}</p>
                  <p>{data.stateNm}</p>
                  <p>{data.countryNm}</p>
                </div>
                {/* {!data.isDefault && (
                    <div className="pl-5 flex gap-3 mt-auto mb-5">
                      <OrbitLink
                        onClick={(e) => {
                          e.stopPropagation()
                          LocalStorage.set(
                            "addressRedirection",
                            `${routes.checkout}/${router.query?.orderNo || ""}?selection=${addressPopup}`
                          )
                          router.push(`${routes.addAddress}?id=${data._id}`)
                        }}
                        className="text-primary hover:text-red"
                      >
                        {t("address:edit")}
                      </OrbitLink>
                    </div>
                  )} */}
              </OrbitLink>
            )
          })}
        </div>
      </DrawerWrapper>

      {open && (
        <AddAddress
          open={open}
          setOpen={setOpen}
          addressId={defaultAddress._id}
          addressData={editAddress}
          isNewAddress={isNewAddress}
          setDefaultAddress={setDefaultAddress}
        />
      )}
    </LayoutWrapper>
  )
}

export default Checkout
