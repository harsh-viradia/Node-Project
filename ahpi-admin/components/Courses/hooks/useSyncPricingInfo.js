/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import AppContext from "utils/appContext"
import { CACHE_KEY } from "utils/constant"
import routes from "utils/routes"
import Toast from "utils/toast"

const useSyncCourseInfo = ({ setValue }) => {
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState("")
  const { setCourseData } = React.useContext(AppContext)
  const [retailPriceData, setRetailPriceData] = useState([])
  const router = useRouter()

  const retailPriceList = async () => {
    try {
      setLoading(true)
      await commonApi({ action: "termsCondtion", common: true, module: "IN_APPS_PRICES" }).then(([, data = {}]) => {
        const retailList = data?.data?.details?.map(({ productId, price }) => ({
          value: productId,
          label: price,
        }))
        setRetailPriceData(retailList)
        return false
      })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    retailPriceList()
  }, [])

  const getCourseDetails = async () => {
    try {
      setLoading(true)
      await commonApi({
        action: "getcourse",
        parameters: [router?.query?.courseId],
      }).then(([, { data = {} }]) => {
        // eslint-disable-next-line no-param-reassign
        data = data?.[0]
        setSlug(data?.slug)
        setCourseData(data)
        setValue("id", data?._id)
        setValue("sellPrice", data?.price?.sellPrice)
        setValue("MRP", data?.price?.MRP)
        setValue("rewardPoints", data?.rewardPoints || 0)
        setValue("InAppPurchaseSellPrice", data?.price?.InAppPurchaseSellPrice)
        setValue("InAppPurchaseMRP", data?.price?.InAppPurchaseMRP)
        setValue("InAppPurchaseProductId", data?.price?.InAppPurchaseProductId)
        return false
      })
    } finally {
      setLoading(false)
    }
  }
  const savePricing = async (values, showToast = false, callback = () => {}) => {
    setLoading(true)
    try {
      await commonApi({
        action: "savePricing",
        parameters: [router?.query?.courseId],
        data: {
          price: {
            MRP: values.MRP,
            sellPrice: values.sellPrice,
            InAppPurchaseSellPrice: values.InAppPurchaseSellPrice,
            InAppPurchaseMRP: values.InAppPurchaseMRP,
            InAppPurchaseProductId: values.InAppPurchaseProductId,
          },
          rewardPoints: values.rewardPoints || 0,
          sts: showToast ? 1 : undefined,
        },
        common: false,
        // eslint-disable-next-line sonarjs/no-identical-functions
      }).then(async ([error, { message }]) => {
        if (error) {
          return false
        }
        // eslint-disable-next-line promise/no-nesting, promise/no-callback-in-promise
        callback(showToast ? message : "")
        return false
      })
    } finally {
      setLoading(false)
    }
  }
  const goBackToCourse = (message) => {
    if (message) Toast(message)
    return router.push({
      pathname: routes.course,
      query: { limit: router?.query?.limit, offset: router?.query?.offset },
    })
  }
  const publishCourseAPI = async (courseId) => {
    await commonApi({
      action: "publishCourse",
      data: { courseId },
      common: false,
      config: {
        headers: {
          [CACHE_KEY.KEY.CASHING_KEY]: slug,
        },
      },
    }).then(async ([errorPublish, { message: message_ = "" }]) => {
      if (errorPublish) {
        return false
      }
      Toast(message_)
      goBackToCourse()
      return false
    })
  }
  const requestForReviewAPI = async (courseId) => {
    await commonApi({ action: "approveCourse", parameters: [courseId], common: false }).then(
      async ([error, { message: message_ = "" }]) => {
        if (error) {
          return false
        }
        Toast(message_)
        goBackToCourse()
        return false
      }
    )
  }
  const publishNow = async (values) => {
    savePricing(values, false, () => publishCourseAPI(router?.query?.courseId))
  }

  const saveAsDraft = async (values) => {
    savePricing(values, true, (message) => goBackToCourse(message))
  }
  const requestForReview = async (values) => {
    savePricing(values, false, () => requestForReviewAPI(router?.query?.courseId))
  }
  useEffect(() => {
    if (router?.query?.courseId) {
      getCourseDetails()
    }
  }, [router?.query?.courseId])

  return {
    loading,
    saveAsDraft,
    publishNow,
    requestForReview,
    retailPriceData,
    retailPriceList,
  }
}
export default useSyncCourseInfo
