/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable unicorn/prevent-abbreviations */
import * as amplitude from "@amplitude/analytics-browser"
import commonApi from "api/index"
import { getCookie, getCookies, hasCookie } from "cookies-next"
// import getConfig from "next/config"
import { useRouter } from "next/router"
// import qs from "qs"
import { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT, API_SUCCESS } from "utils/constant"
import routes from "utils/routes"
import Toast from "utils/toast"
import { eventTrack } from "utils/util"

// const { publicRuntimeConfig } = getConfig()
const useCourseDetails = ({ courseDetails }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [inWishList, setInWishList] = useState(false)
  const { userData = {}, setCountData } = useContext(AppContext)
  const { fcmToken, deviceToken } = getCookies()

  const createOrder = async () => {
    try {
      const payload = {
        courses: [
          {
            courseId: courseDetails?._id,
            nm: courseDetails?.title,
            price: courseDetails?.price?.sellPrice,
            sellPrice: courseDetails?.price?.sellPrice,
            primaryCat: courseDetails?.parCategory?.[0]?._id,
            earnedRewardsForOrder: courseDetails?.rewardPoints,
          },
        ],
        subTotal: courseDetails?.price?.sellPrice,
        tax: 0,
        totalCourses: 1,
        grandTotal: courseDetails?.price?.sellPrice,
      }
      setIsBuyNowLoading(true)
      await commonApi({ action: "orderCreate", data: { ...payload } }).then(
        async ([error, { code, data: response }]) => {
          if (error) {
            return setIsBuyNowLoading(false)
          }
          if (code === API_SUCCESS.OK) {
            amplitude.track(ANALYTICS_EVENT.ADD_CART, {
              userEmail: userData.email,
              courseName: courseDetails?.title,
              courseId: courseDetails._id,
            })
            amplitude.track(ANALYTICS_EVENT.BUY_NOW, {
              userEmail: userData.email,
              courseName: courseDetails?.title,
              courseId: courseDetails._id,
              price: payload.courses[0]?.price,
            })
            router.push(`${routes.checkout}/${response.orderNo}`)
            await commonApi({
              action: "cartCount",
              data: { deviceToken, fcmToken },
            }).then(([, { data }]) => {
              setCountData(data)
              return false
            })
          }
          // eslint-disable-next-line consistent-return
          return false
        }
      )
    } finally {
      setIsBuyNowLoading(false)
    }
  }

  const getOrderCount = async () => {
    if (getCookie("token")) {
      amplitude.track(ANALYTICS_EVENT.ADD_CART, {
        userEmail: userData.email,
        courseName: courseDetails?.title,
        courseId: courseDetails._id,
      })
    }
    await commonApi({ action: "cartCount", data: { deviceToken, fcmToken } })
      .then(([, { data }]) => {
        setCountData(data)
        return false
      })
      .catch(() => {})
  }

  const addToCart = async (buyNowScreen) => {
    // eslint-disable-next-line sonarjs/no-duplicate-string

    try {
      if (!hasCookie("deviceToken")) return
      setLoading(true)
      await commonApi({
        action: "addToCart",
        parameters: [getCookie("deviceToken"), getCookie("fcmToken")],
        data: { courses: [courseDetails._id] },
      }).then(([error, { message = "" }]) => {
        if (error) return
        if (!buyNowScreen) Toast(message)
        if (buyNowScreen && !userData.id) {
          localStorage.setItem("redirectFromLogin", routes.cart)
          router.push(routes.login)
          // window.open(
          //   `${publicRuntimeConfig.NEXT_PUBLIC_SSO_URL}/${router.locale}${routes.login}?${qs.stringify(
          //     SSO_REDIRECT_PAYLOAD
          //   )}`,
          //   "_self"
          // )
        } else if (buyNowScreen) {
          createOrder()
        } else {
          getOrderCount()
          router.replace(router.asPath)
          eventTrack("Cart", "Add to Chart", "Course added to cart")
        }
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  const addToWishList = async () => {
    const payload = {
      type: 1,
      userId: userData.id,
      courseId: courseDetails._id,
      courseNm: courseDetails.title,
    }
    await commonApi({
      action: "addToWishList",
      data: payload,
    }).then(([error, { message }]) => {
      if (error) return
      Toast(message)
      setInWishList(!inWishList)
      if (inWishList) {
        amplitude.track(ANALYTICS_EVENT.REMOVE_WISHLIST, {
          email: userData.email,
          courseId: payload.courseId,
          courseName: payload.courseNm,
        })
      } else {
        amplitude.track(ANALYTICS_EVENT.ADD_WISHLIST, {
          email: userData.email,
          courseId: payload.courseId,
          courseName: payload.courseNm,
        })
      }

      return false
    })
  }
  useEffect(() => {
    setInWishList(courseDetails.isSaved)
  }, [courseDetails])
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const asyncFunc = async () => {
    setLoggedIn(!!userData?.id)
  }
  useEffect(() => {
    asyncFunc()
  }, [userData?.id])

  return {
    loading,
    addToCart,
    loggedIn,
    addToWishList,
    setLoading,
    inWishList,
    isBuyNowLoading,
    setIsBuyNowLoading,
  }
}

export default useCourseDetails
