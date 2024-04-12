/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import { useRouter } from "next/router"
import { useState } from "react"
import { MATERIAL_TYPES } from "utils/constant"
import { hourFormat } from "utils/helper"
import Toast from "utils/toast"

const useText = ({ reset, defaultValues, setSectionTitle, setOpen, secId, getMaterialList }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const addUpdateText = async (values) => {
    const { id, ...rest } = values
    const data = {
      ...rest,
      courseId: router?.query?.courseId,
      userId: router?.query?.coachId,
      secId,
      type: MATERIAL_TYPES.TEXT,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "addMaterial",
        module: id ? "courses/sections/materials" : "",
        common: !!id,
        parameters: [id],
        data,
      }).then(async ([error]) => {
        if (error) return false
        // Toast(message, "success")
        setOpen(false)
        reset({ ...defaultValues })
        setSectionTitle("Add")
        getMaterialList(secId)
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    addUpdateText,
    loading,
  }
}
export default useText
