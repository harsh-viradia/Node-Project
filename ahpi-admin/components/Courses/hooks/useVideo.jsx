/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import { useRouter } from "next/router"
import { useState } from "react"
import { MATERIAL_TYPES } from "utils/constant"
import Toast from "utils/toast"

const useVideo = ({ reset, defaultValues, setSectionTitle, setOpen, secId, getMaterialList }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const addUpdateVideo = async (values) => {
    const { id, ...rest } = values
    const data = {
      ...rest,
      videoProgress: undefined,
      courseId: router?.query?.courseId,
      userId: router?.query?.coachId,
      secId,
      type: MATERIAL_TYPES.VIDEO,
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
    addUpdateVideo,
    loading,
  }
}
export default useVideo
