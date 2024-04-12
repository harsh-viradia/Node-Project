/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import { useRouter } from "next/router"
import { useState } from "react"
import { MATERIAL_TYPES } from "utils/constant"
import { hourFormat } from "utils/helper"

const useQuiz = ({ reset, defaultValues, setSectionTitle, setOpen, secId, getMaterialList, quizCertificate }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const addUpdateQuiz = async (values) => {
    const { id, duration, ...rest } = values
    const dur = hourFormat(duration)
    const data = {
      ...rest,
      courseId: router?.query?.courseId,
      userId: router?.query?.coachId,
      secId,
      duration: dur,
      type: quizCertificate ? MATERIAL_TYPES.QUIZ_CERTIFICATE : MATERIAL_TYPES.QUIZ,
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
    addUpdateQuiz,
    loading,
  }
}
export default useQuiz
