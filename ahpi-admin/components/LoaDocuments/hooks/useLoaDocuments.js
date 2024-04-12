/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-unused-vars */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import { useEffect, useState } from "react"
import { API_ERROR_RES, DEFAULT_CURRENT_PAGE, DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"
import Toast from "utils/toast"
import { debounce } from "utils/util"

const useLoaDocuments = ({ permission }) => {
  const [courseOptions, setCourseOptions] = useState([])
  const [courseValue, setCourseValue] = useState()
  const [loading, setLoading] = useState(false)
  const [countDetails, setCourseDetails] = useState({})
  const [documentsList, setDocumentsList] = useState([])

  const getAllCourses = debounce(async (inputValue, callback) => {
    const payload = {
      isActive: true,
      query: {},
    }

    if (inputValue) {
      payload.query.searchColumns = ["name", "desc"]
      payload.query.search = inputValue
    }
    await commonApi({ action: "list", module: "course", common: true, data: payload }).then(([, { data = {} }]) => {
      const coursesList = data?.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(coursesList)
      } else {
        setCourseOptions(coursesList)
      }
      return false
    })
  }, 500)

  const getCourseCountDetails = async () => {
    const payload = {
      courseId: courseValue?.value,
    }

    const payload2 = {
      options: {
        offset: DEFAULT_CURRENT_PAGE,
        limit: DEFAULT_LIMIT,
      },
    }

    try {
      setLoading(true)
      await commonApi({ action: "getLoaCount", data: payload }).then(([, { data = {} }]) => {
        setCourseDetails(data)
        return false
      })
      await commonApi({ action: "getDocList", data: payload2 }).then(async ([, { code, message = "", data = {} }]) => {
        if (code === API_ERROR_RES) {
          Toast(message, "error")
        } else {
          setDocumentsList(data.data)
        }
        return false
      })
    } finally {
      setLoading(false)
    }
  }
  const isAllow = (key) => hasAccessTo(permission, MODULES.LOA, key)

  useEffect(() => {
    if (
      isAllow(MODULE_ACTIONS.GETCOUNT) &&
      isAllow(MODULE_ACTIONS.DOCUMENTEXPORT) &&
      hasAccessTo(permission, MODULES.COURSE, MODULE_ACTIONS.GETALL)
    ) {
      getAllCourses()
    }
  }, [])

  return {
    courseOptions,
    courseValue,
    getAllCourses,
    setCourseValue,
    countDetails,
    loading,
    getCourseCountDetails,
    setCourseDetails,
    documentsList,
    setDocumentsList,
    isAllow,
  }
}

export default useLoaDocuments
