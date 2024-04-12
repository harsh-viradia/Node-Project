/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-unused-vars */
/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import Toast from "utils/toast"
import { debounce } from "utils/util"

const useSyncStudent = ({ open, setOpen, getList, defaultValues, reset, pagination = {}, permission }) => {
  const [loading, setLoading] = useState(false)
  const [universityOptions, setUniversityOptions] = useState([])
  const [selectValue, setSelectValue] = useState()
  const [courseOptions, setCourseOptions] = useState([])
  const [selectValue2, setSelectValue2] = useState()
  const [courseRemoveIds, setCourseRemoveIds] = useState()

  const onSelectInputChange = () => {
    setSelectValue()
  }

  const onSelectInputChange2 = () => {
    setSelectValue2()
  }

  const onSubmit = async (values) => {
    const { id, appliedDate, email, courses, mobile, ...other } = values
    const payload = {
      appliedDate: dayjs(appliedDate).format("YYYY-MM-DD"),
      courses: courses?.map((x) => {
        return {
          courseId: x?.value || x?.courseId,
          courseNm: x?.label || x?.courseNm,
        }
      }),
      ...other,
    }

    if (!id) {
      payload.mobile = {
        no: mobile,
      }
      payload.email = email
    }

    if (id) {
      const newD = courses?.map((x) => {
        return {
          value: x?.value || x?.courseId,
          label: x?.label || x?.courseNm,
        }
      })
      const removed = courseRemoveIds?.length
        ? courseRemoveIds?.filter((entry1) => !newD.some((entry2) => entry1.value === entry2.value))
        : []
      payload.courseRemoveIds = removed?.length ? removed.map((y) => y.value) : undefined
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "create",
        parameters: [id],
        module: "student",
        common: true,
        data: payload,
      }).then(async ([, { message = "" }]) => {
        Toast(message, "success")
        reset({ ...defaultValues })
        if (hasAccessTo(permission, MODULES.APPLICANT, MODULE_ACTIONS.GETALL)) {
          if (id) {
            getList({
              options: {
                offset: pagination.offset,
                limit: pagination.perPage,
              },
            })
          } else {
            getList()
          }
        }
        setOpen(false)
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  const getAllUniversities = debounce(async (inputValue, callback) => {
    const payload = {
      isActive: true,
    }

    if (inputValue) {
      payload.search = inputValue
    }
    await commonApi({ action: "list", module: "university", common: true, data: payload }).then(([, { data = {} }]) => {
      const universityList = data?.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(universityList)
      } else {
        setUniversityOptions(universityList)
      }
      return false
    })
  }, 500)

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

  useEffect(() => {
    reset({ ...defaultValues })
    if (open) {
      if (hasAccessTo(permission, MODULES.UNIVERSITY, MODULE_ACTIONS.GETALL)) {
        getAllUniversities()
      }
      if (hasAccessTo(permission, MODULES.COURSE, MODULE_ACTIONS.GETALL)) {
        getAllCourses()
      }
    }
  }, [open])

  return {
    universityOptions,
    loading,
    selectValue,
    setSelectValue,
    onSelectInputChange,
    getAllUniversities,
    courseOptions,
    selectValue2,
    setSelectValue2,
    onSelectInputChange2,
    getAllCourses,
    onSubmit,
    setCourseRemoveIds,
  }
}
export default useSyncStudent
