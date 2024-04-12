/* eslint-disable no-unreachable */
/* eslint-disable no-underscore-dangle */
import commonApi from "api"
import router from "next/router"
import { useEffect, useState } from "react"
import { CACHE_KEY } from "utils/constant"
import routes from "utils/routes"
import Toast from "utils/toast"
import { capitalizeFirstLetter, debounce } from "utils/util"

const useAddWidget = ({ category, courseList, reviewList, id, setEditValues, secType, widgetType }) => {
  const [categoryOptions, setCategoryOptions] = useState([])
  const [courseOptions, setCourseOptions] = useState([])
  const [reviewOptions, setReviewOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const getAllCategory = debounce(async (inputValue, callback) => {
    const payload = {
      query: {
        searchColumns: ["name"],
        search: inputValue,
        filter: {
          isActive: true,
        },
      },
      options: { select: [], page: 1, limit: 10, sort: { createdAt: -1 }, populate: ["image"] },
    }

    await commonApi({ action: "list", module: "category", common: true, data: payload }).then(([, { data = {} }]) => {
      const listData = data.data?.map((a) => ({ ...a, value: a._id, label: a.name }))
      if (inputValue) {
        callback?.(listData)
      } else {
        setCategoryOptions(listData)
      }
      return false
    })
  }, 500)
  const getAllReviews = debounce(async (inputValue, callback) => {
    const payload = {
      query: { searchColumns: ["fullName", "desc"], search: inputValue || undefined },
      options: {
        select: [],
        page: 1,
        limit: 10,
        sort: { createdAt: -1 },
        populate: [
          {
            path: "userId",
            populate: "profileId",
            select: "profileId",
          },
        ],
      },
    }

    await commonApi({ action: "list", module: "reviews", common: true, data: payload }).then(([, { data = {} }]) => {
      const listData = data.data?.map((a) => ({
        ...a,
        value: a._id,
        label: `${a.stars}⭐ - ${a.desc}`,
      }))
      if (inputValue) {
        callback?.(listData)
      } else {
        setReviewOptions(listData)
      }
      return false
    })
  }, 500)
  const getAllCourses = debounce(async (inputValue, callback) => {
    const payload = {
      query: { searchColumns: ["title"], search: inputValue || undefined, isActive: true, sts: 2 },
      options: { populate: ["userId", "imgId"], select: [], page: 1, limit: 10, sort: { createdAt: -1 } },
    }

    await commonApi({ action: "add", module: "courses", common: true, data: payload }).then(([, { data = {} }]) => {
      const listData = data?.data?.map((a) => ({ ...a, value: a._id, label: a.title }))
      if (inputValue) {
        callback?.(listData)
      } else {
        setCourseOptions(listData)
      }
      return false
    })
  }, 500)
  const getWidget = async () => {
    try {
      setLoading(true)
      await commonApi({
        action: "get",
        module: "widget",
        parameters: [id],
        common: true,
      }).then(async ([error, response]) => {
        if (error) {
          router.push(routes.widget)
          return
        }
        setEditValues(response?.data?.[0])
        // eslint-disable-next-line consistent-return
        return false
      })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getAllCategory()
    getAllCourses()
    getAllReviews()
  }, [])
  useEffect(() => {
    if (id) getWidget()
  }, [id])
  // eslint-disable-next-line unicorn/consistent-function-scoping, sonarjs/cognitive-complexity
  const onSubmit = async (values) => {
    const payload = {
      ...values,
      name: capitalizeFirstLetter(values.name),
      code: values.code?.toUpperCase(),
      isAlgorithmBase: undefined,
      category: undefined,
      course: undefined,
      secType: secType?.value,
      isMultiTabs: secType?.code === "TAB",
      imgType: widgetType?.code === "IMAGE" ? values.imgType : undefined,
      img: values.img?.length
        ? values.img.map(
            ({
              alt,
              fileId,
              link,
              title,
              altID,
              titleID,
              //  fileIdIndo
            }) => ({
              alt,
              fileId,
              link,
              title,
              altID,
              titleID,
              // fileIdIndo,
            })
          )
        : undefined,
      reviews: widgetType?.code === "REVIEWS" ? reviewList.map((a) => a.value) : undefined,
      tabs:
        widgetType?.code === "IMAGE" || widgetType?.code === "REVIEWS"
          ? undefined
          : secType?.code === "TAB"
          ? values.tabs.map((a) => {
              return {
                course: a.course?.map((c) => c.value),
                categories: a.categories?.map((c) => c.value),
                name: a.name,
                isAlgorithmBase: values.isAlgorithmBase,
                type: widgetType.value,
                cardType: values.cardType,
              }
            })
          : [
              {
                isAlgorithmBase: values.isAlgorithmBase,
                type: widgetType.value,
                cardType: values.cardType,
                name: values.name,
                course: widgetType?.code === "COURSE" && !values.isAlgorithmBase ? courseList?.map((a) => a.value) : [],
                categories:
                  widgetType?.code === "CATEGORY" && !values.isAlgorithmBase ? category?.map((a) => a.value) : [],
              },
            ],
      cardType: undefined,
      type: widgetType.value,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "create",
        module: "widget",
        common: true,
        parameters: [id],
        data: payload,
        config: {
          headers: {
            [CACHE_KEY.KEY.CASHING_KEY]: CACHE_KEY.VALUE.HOME,
          },
        },
      }).then(async ([error, response]) => {
        if (error) {
          return
        }
        const { message = "" } = response
        Toast(message, "success")
        const queryParameters = { ...router.query }
        delete queryParameters.id
        router.push({ pathname: routes.widget, query: queryParameters })
        // eslint-disable-next-line consistent-return
        return false
      })
    } finally {
      setLoading(false)
    }
  }
  return {
    getAllCategory,
    getAllCourses,
    categoryOptions,
    courseOptions,
    onSubmit,
    loading,
    reviewOptions,
    getAllReviews,
    getWidget,
  }
}
export default useAddWidget
