/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import AppContext from "utils/appContext"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import routes from "utils/routes"
import Toast from "utils/toast"
import { debounce } from "utils/util"

const useSyncBasicInfo = ({
  defaultValues,
  reset,
  messages,
  setValue,
  watch,
  isAllow,
  section,
  pricing,
  permission,
}) => {
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [coachOptions, setCoachOptions] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const [fileData, setFileData] = useState()
  const [videoData, setVideoData] = useState()
  const { setCourseData, setSectionData } = React.useContext(AppContext)
  const [hasPermission, setPermission] = useState(false)
  const [previousUserId, setPreviousUserId] = useState()
  const router = useRouter()

  const getCoachList = debounce(async (inputValue, callback) => {
    if (!hasAccessTo(permission, MODULES.INSTRUCTOR, MODULE_ACTIONS.GETALL)) return
    const payload = {
      filter: { isActive: true },
      query: {
        searchColumns: ["name", "email"],
        search: inputValue || undefined,
      },
    }
    await commonApi({ action: "add", module: "instructor", common: true, data: payload }).then(([, { data = {} }]) => {
      const coachList = data?.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(coachList)
      } else {
        setCoachOptions(coachList)
      }
      return false
    })
  }, 500)

  const getCategoryList = debounce(async (inputValue, callback) => {
    if (!hasAccessTo(permission, MODULES.CATEGORY, MODULE_ACTIONS.GETALL)) return
    const payload = {
      query: { isActive: true, instructorId: watch("userId") || undefined },
    }

    if (inputValue) {
      payload.query.searchColumns = ["name"]
      payload.query.search = inputValue
    }
    await commonApi({ action: "list", module: "category", common: true, data: payload }).then(([, { data = {} }]) => {
      const categoryList = data?.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(categoryList)
      } else {
        setCategoryOptions(categoryList)
      }
      return false
    })
  }, 500)

  const getSubCategoryList = debounce(async (inputValue, callback) => {
    const payload = {
      query: {
        isActive: true,
        instructorId: watch("userId") || undefined,
        id: watch("parCategory") || undefined,
      },
    }
    if (inputValue) {
      payload.query.searchColumns = ["name"]
      payload.query.search = inputValue
    }
    await commonApi({ action: "list", module: "category", common: true, data: payload }).then(([, { data = {} }]) => {
      const subCategoryList = data?.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(subCategoryList)
      } else {
        setSubCategoryOptions(subCategoryList)
      }
      return false
    })
  }, 500)

  const getCourseDetails = async () => {
    try {
      setLoading2(true)
      await commonApi({
        action: "getcourse",
        parameters: [router?.query?.courseId],
      }).then(([, { data = {} }]) => {
        data = data?.[0]
        setCourseData(data)
        setValue("id", data?._id)
        setValue("title", data?.title)
        setValue("slug", data?.slug)
        setValue("desc", data?.desc)
        setValue("levelId", data?.levelId?._id)
        setValue("levelNm", data?.levelId?.name)
        setValue("userId", data?.userId?._id)
        setValue("userIdNm", data?.userId?.name)
        setValue("parCategory", data?.parCategory?.[0]?._id)
        setValue("parCategoryNm", data?.parCategory?.[0]?.name)
        setValue(
          "category",
          data?.category?.map((a) => ({ value: a._id, label: a.name }))
        )
        setValue("certificateId", data?.certificateId?.[0]?._id)
        setValue("certificateNm", data?.certificateId?.[0]?.name)
        setValue("lang", data?.lang?._id)
        setValue("langNm", data?.lang?.name)
        setValue("imgId", data?.imgId?._id)
        setValue("vidId", data?.vidId?._id)
        setValue("certiPrefix", data?.certiPrefix)
        setFileData(data?.imgId)
        setVideoData(data?.vidId?.vidObj)
        setPreviousUserId(data?.userId?._id)
        return false
      })
    } finally {
      setLoading2(false)
    }
  }

  const getSectionDetails = async () => {
    await commonApi({
      module: "courses/sections",
      action: "add",
      common: true,
      data: { query: { userId: router?.query?.coachId || undefined, courseId: router?.query?.courseId } },
    }).then(([, { data = {} }]) => {
      setSectionData(data?.data)
      return false
    })
  }

  useEffect(() => {
    getCoachList()
    if (router?.query?.courseId) {
      if (isAllow(MODULE_ACTIONS.GET)) getCourseDetails()
      if (isAllow(MODULE_ACTIONS.GETALLSECTIONS)) getSectionDetails()
      setPermission(!isAllow(MODULE_ACTIONS.UPDATEBASICINFO))
    } else {
      setPermission(!isAllow(MODULE_ACTIONS.BASICINFO))
    }
  }, [])
  useEffect(() => {
    setValue("parCategory", "")
    setValue("parCategoryNm", "")
    setValue("category", "")
    setValue("certificateId", "")
    if (watch("userId")) {
      getCategoryList()
      getSubCategoryList()
    } else {
      setCategoryOptions()
      setSubCategoryOptions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("userId")])
  useEffect(() => {
    setSubCategoryOptions()
    getSubCategoryList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("parCategory")])
  const moveToNextTab = () => {
    if (isAllow(MODULE_ACTIONS.COURSEINFO)) messages()
    else if (isAllow(MODULE_ACTIONS.CREATESECTIONS) || isAllow(MODULE_ACTIONS.GETALLSECTIONS)) section()
    else if (isAllow(MODULE_ACTIONS.ADDPRICE)) pricing()
    else
      router.push({
        pathname: routes.course,
        query: { limit: router?.query?.limit, offset: router?.query?.offset },
      })
  }
  const onSubmit = async (values) => {
    const {
      id,
      title,
      slug,
      desc,
      levelId,
      userId,
      parCategory,
      category,
      imgId,
      vidId,
      lang,
      certiPrefix,
      certificateId,
    } = values
    setLoading(true)
    const flag =
      previousUserId !== userId &&
      (await commonApi({ action: "courseCountForInstructor", data: { instructorId: userId } }).then(
        ([error, { data: flagData }]) => (error ? true : !flagData.flag)
      ))
    if (flag) {
      setLoading(false)
      return false
    }

    const payload = {
      title,
      slug,
      desc,
      levelId,
      userId,
      parCategory: [parCategory],
      category: category?.map((a) => a.value),
      imgId,
      vidId,
      lang,
      certiPrefix,
      certificateId,
    }
    try {
      // setLoading(true)
      await commonApi({
        action: id ? "updateCourseInfo" : "basicInfo",
        data: payload,
        parameters: id ? [id] : undefined,
      }).then(async ([, { data = {}, message = "", code }]) => {
        if (code === "SUCCESS") {
          reset({ ...defaultValues })
          moveToNextTab()
          router.push({
            pathname: id ? routes.editCourse : routes.addCourse,
            query: { coachId: userId, courseId: data._id, limit: router?.query?.limit, offset: router?.query?.offset },
          })
        }
        return false
      })
    } finally {
      setLoading(false)
    }
    return false
  }

  return {
    onSubmit,
    loading,
    loading2,
    coachOptions,
    categoryOptions,
    subCategoryOptions,
    getCoachList,
    getCategoryList,
    getSubCategoryList,
    fileData,
    videoData,
    setFileData,
    hasPermission,
    moveToNextTab,
    setSubCategoryOptions,
  }
}
export default useSyncBasicInfo
