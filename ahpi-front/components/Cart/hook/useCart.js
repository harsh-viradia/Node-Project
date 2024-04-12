/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable no-underscore-dangle */
import * as amplitude from "@amplitude/analytics-browser"
import commonApi from "api/index"
import { getCookie, hasCookie } from "cookies-next"
// import getConfig from "next/config"
import { useRouter } from "next/router"
// import qs from "qs"
import React, { useEffect, useState } from "react"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT, API_SUCCESS } from "utils/constant"
import routes from "utils/routes"
import Toast from "utils/toast"

// const { publicRuntimeConfig } = getConfig()
const useCart = ({ t, cartList, couponAndRewardApply, rewardPointValue, userRewardPoints }) => {
  const router = useRouter()
  const [cartData, setCartData] = useState({})
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [couponCode, setCouponCode] = useState()
  const [couponApplied, setCouponApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponAmount, setCouponAmount] = useState(0)
  const [couponDetails, setCouponDetails] = useState()
  const [couponPercentage, setCouponPercentage] = useState()
  const [couponError, setCouponError] = useState()
  const [getCourseCount, setGetCourseCount] = useState()
  const [couponDisabled, setCouponDisabled] = useState()
  const [rewardDisabled, setRewardDisabled] = useState()
  const [rewardApplied, setRewardApplied] = useState()
  const [rewardDiscount, setRewardDiscount] = useState()
  const [usedRewardPoints, setUsedRewardPoints] = useState()

  const { setCountData, userData } = React.useContext(AppContext)
  const getCourseTotalPrice = () =>
    Number(cartData.courses?.map((a) => a?.price?.sellPrice || 0)?.reduce((x, y) => x + y)) || 0
  const removeCartItem = async (courseId, title = "") => {
    if (!hasCookie("deviceToken")) return
    setLoading(true)
    const payload = {
      courseId,
    }
    await commonApi({
      action: "deleteCartItem",
      data: { ...payload },
      parameters: [getCookie("deviceToken"), getCookie("fcmToken")],
    }).then(([error, { message }]) => {
      amplitude.track(ANALYTICS_EVENT.REMOVE_CART, {
        email: userData.email,
        courseId,
        courseName: title,
      })
      setLoading(false)
      if (error) return false
      const newData = cartData?.courses?.filter((a) => a._id !== courseId)
      setCartData({ ...cartData, courses: newData })
      setCountData(newData?.length)
      setCouponCode()
      setCouponApplied(false)
      setDiscountAmount(0)
      setCouponAmount(0)
      setCouponDetails()
      setCouponPercentage()
      setCouponError()
      setGetCourseCount()
      setCouponDisabled(false)
      setRewardDisabled(false)
      setRewardApplied(false)
      Toast(message)
      return false
    })
  }

  const doCheckout = async () => {
    if (userData?.id) {
      const totalSellAmt = getCourseTotalPrice()
      const discountAmt = (couponAmount || 0) + (rewardDiscount || 0)
      const courses = cartData?.courses?.map((course) => {
        const afterDiscounted = Math.round(((course?.price?.sellPrice || 0) * discountAmt) / totalSellAmt)
        return {
          courseId: course._id,
          nm: course.title,
          price: course?.price?.couponPrice || course?.price?.sellPrice,
          sellPrice: (course?.price?.sellPrice || 0) - afterDiscounted || 0,
          earnedRewardsForOrder: course.rewardPoints || 0,
          primaryCat: course?.parCategory?.[0]?._id,
        }
      })

      const total = courses.reduce((accumulator, object) => {
        return accumulator + object.price
      }, 0)

      const payload = {
        courses,
        subTotal: total,
        tax: 0,
        totalCourses: courses.length,
        grandTotal: couponApplied
          ? (discountAmount || 0) - (rewardDiscount || 0) < 0
            ? 0
            : (discountAmount || 0) - (rewardDiscount || 0)
          : total - (rewardDiscount || 0),
        usedRewardsForOrder: usedRewardPoints || 0,
        coupon: couponDetails,
      }
      await commonApi({ action: "orderCreate", data: { ...payload } }).then(([error, { code, data: response }]) => {
        if (error) return
        if (code === API_SUCCESS.OK) router.push(`${routes.checkout}/${response.orderNo}`)
        // eslint-disable-next-line consistent-return
        return false
      })
    } else {
      localStorage.setItem("redirectFromLogin", routes.cart)
      router.push(routes.login)
      // window.open(
      //   `${publicRuntimeConfig.NEXT_PUBLIC_SSO_URL}/${router.locale}${routes.login}?${qs.stringify(
      //     SSO_REDIRECT_PAYLOAD
      //   )}`,
      //   "_self"
      // )
    }
  }

  const handleClickCart = (rediectionSlug) => () => {
    router.push(`${routes.courseDetail}/${rediectionSlug}`)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setCartData(cartList?.[0])
    setCountData(cartList?.[0]?.courses?.length)
  }, [])

  const applyCoupon = async () => {
    const array = cartData?.courses?.reduce((acc, item) => {
      item?.category?.map((a) => acc.add(a))
      acc.add(item?.parCategory?.[0]?._id)
      return acc
    }, new Set())
    const payload = {
      code: couponCode,
      courses: cartData?.courses?.map((x) => x._id),
      categories: [...array],
    }
    amplitude.track(ANALYTICS_EVENT.APPLY_COUPON, {
      userEmail: userData.email,
      userId: userData.id,
      courses: payload.courses,
      coupunCode: payload.code,
    })
    try {
      if (!hasCookie("deviceToken")) return
      setLoading2(true)
      await commonApi({
        action: "applyCoupon",
        parameters: [getCookie("deviceToken"), getCookie("fcmToken")],
        data: payload,
      }).then(async ([error, { data = {} }]) => {
        if (error) {
          setCouponError(error.response.data.message || t("commonError"))
          return
        }
        setCouponError()
        setCouponApplied(true)
        setRewardDisabled(!couponAndRewardApply.isBothApplied)
        const mrpAmount = getCourseTotalPrice()
        setCouponDetails(data?.[0]?.coupon)
        if (data?.[0]?.coupon?.couponAmt) {
          const couponAmt = Number(data[0].coupon.couponAmt)
          setDiscountAmount(couponAmt > mrpAmount ? 0 : mrpAmount - couponAmt)
          setCouponAmount(couponAmt > mrpAmount ? mrpAmount : data[0].coupon.couponAmt)
        } else if (data?.[0]?.coupon?.couponPercent) {
          const discountAmt = (mrpAmount * Number(data[0].coupon.couponPercent)) / 100
          setDiscountAmount(mrpAmount - discountAmt)
          setCouponAmount(discountAmt)
          setCouponPercentage(data?.[0]?.coupon?.couponPercent)
        } else if (data?.[0]?.getCourses?.length) {
          const newData = data[0].getCourses.map((x) => {
            return {
              ...x,
              price: {
                ...x.price,
                couponPrice: x.price?.sellPrice, // added for calculate price on coupon
                sellPrice: 0,
                isBuyXGetX: true,
              },
            }
          })
          const mergedData = [...newData, ...cartData.courses]
          const uniqueData = mergedData?.reduce((unique, o) => {
            if (!unique.some((obj) => obj._id === o._id)) {
              unique.push(o)
            }
            return unique
          }, [])
          setDiscountAmount(uniqueData?.map((a) => a?.price?.sellPrice || 0)?.reduce((x, y) => x + y))
          setCouponAmount(0)
          setCartData({ ...cartData, courses: uniqueData })
          setCountData(uniqueData.length)
          setGetCourseCount(newData.length)
        }
        // eslint-disable-next-line consistent-return
        return false
      })
    } finally {
      setLoading2(false)
    }
  }

  const removeCouponCode = () => {
    const courses = cartList?.[0]?.courses?.filter((course) => cartData?.courses?.find((i) => i._id === course._id))
    setCouponCode()
    setCouponApplied(false)
    setDiscountAmount(0)
    setCouponAmount(0)
    setCouponDetails()
    setCouponPercentage()
    setCouponError()
    setCartData({ ...cartList?.[0], courses })
    setCountData(courses?.length)
    setGetCourseCount()
    setRewardDisabled(false)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCouponError()
    }, 10000)
    return () => {
      clearTimeout(timeout)
    }
  }, [couponError])
  const countRewardPoints = (canSet) => {
    if (canSet) {
      const totalSellAmt = discountAmount || getCourseTotalPrice()
      const rewardPoints = (userRewardPoints * rewardPointValue.price) / rewardPointValue.reward || 0
      const totalRewardDiscount = totalSellAmt > rewardPoints ? rewardPoints : totalSellAmt
      setRewardDiscount(totalRewardDiscount)
      setCouponDisabled(!couponAndRewardApply.isBothApplied)
      setUsedRewardPoints((totalRewardDiscount * rewardPointValue.reward) / rewardPointValue.price)
    }
  }
  const applyRewardPoints = () => {
    if (rewardApplied) {
      setCouponDisabled(false)
      setRewardDiscount(0)
      setUsedRewardPoints(0)
    } else {
      countRewardPoints(!rewardApplied)
    }
    setRewardApplied(!rewardApplied)
  }
  useEffect(() => {
    countRewardPoints(rewardApplied)
  }, [couponApplied])
  return {
    cartData,
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
    rewardApplied,
    applyRewardPoints,
    rewardDiscount,
    usedRewardPoints,
    getCourseTotalPrice,
  }
}

export default useCart
