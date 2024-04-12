/* eslint-disable promise/no-nesting */
/* eslint-disable no-unused-vars */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import axios from "axios"
import { useEffect, useState } from "react"
import { MAP_DATA, MODULE_ACTIONS, MODULES, PROCESS_FILE } from "utils/constant"
import Toast from "utils/toast"
import { debounce } from "utils/util"

const useImport = ({ open, getValues, closeModal, getList, permission }) => {
  const [courseOptions, setCourseOptions] = useState([])
  const [loading, setLoading] = useState(false)

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
    if (open && hasAccessTo(permission, MODULES.COURSE, MODULE_ACTIONS.GETALL)) {
      getAllCourses()
    }
  }, [open])

  const onSubmit = async (values) => {
    const formData = new FormData()
    formData.append(
      "additionalData",
      JSON.stringify({
        courseId: values.courseId,
      })
    )
    formData.append("files", getValues("files"), getValues("files").name.replace(/ /g, "_"))
    try {
      setLoading(true)
      await axios.post(PROCESS_FILE, formData).then(async (response) => {
        await axios.post(MAP_DATA, response.data.payload[0]).then(({ data }) => {
          Toast(data.message, "success")
          closeModal()
          getList()
          return false
        })
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    courseOptions,
    getAllCourses,
    loading,
    onSubmit,
  }
}

export default useImport
