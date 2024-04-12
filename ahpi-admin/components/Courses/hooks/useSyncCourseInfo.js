/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import AppContext from "utils/appContext"
import { MODULE_ACTIONS } from "utils/constant"
import routes from "utils/routes"

const useSyncCourseInfo = ({ defaultValues, reset, section, setValue, isAllow, pricing }) => {
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const { setCourseData } = React.useContext(AppContext)
  const [hasPermission, setPermission] = useState(false)
  const router = useRouter()

  const moveToNextTab = () => {
    if (isAllow(MODULE_ACTIONS.CREATESECTIONS) || isAllow(MODULE_ACTIONS.GETALLSECTIONS)) section()
    else if (isAllow(MODULE_ACTIONS.ADDPRICE)) pricing()
    else
      router.push({
        pathname: routes.course,
        query: { limit: router?.query?.limit, offset: router?.query?.offset },
      })
  }
  const onSubmit = async (values) => {
    const { id, ...rest } = values
    const payload = {
      ...rest,
      // sts: COURSE_TYPE.DRAFT,
    }
    try {
      setLoading(true)
      await commonApi({
        action: "courseInfo",
        data: payload,
        parameters: [router?.query?.courseId],
      }).then(async ([error, { data = {} }]) => {
        setCourseData(data)
        // eslint-disable-next-line promise/always-return
        if (error) return
        // Toast(message, "success")
        reset({ ...defaultValues })
        moveToNextTab()
      })
    } finally {
      setLoading(false)
    }
  }

  const getCourseDetails = async () => {
    try {
      setLoading2(true)
      await commonApi({
        action: "getcourse",
        parameters: [router?.query?.courseId],
      }).then(([, { data = {} }]) => {
        // eslint-disable-next-line no-param-reassign
        data = data?.[0]
        setCourseData(data)
        setValue("id", data?._id)
        setValue("briefDesc", data?.briefDesc)
        setValue("about", data?.about)
        setValue("require", data?.require)
        setValue("includes", data?.includes)
        return false
      })
    } finally {
      setLoading2(false)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId && isAllow(MODULE_ACTIONS.GET)) {
      getCourseDetails()
    }
    setPermission(!isAllow(MODULE_ACTIONS.COURSEINFO))
  }, [])

  return {
    onSubmit,
    loading,
    loading2,
    hasPermission,
    moveToNextTab,
  }
}
export default useSyncCourseInfo
