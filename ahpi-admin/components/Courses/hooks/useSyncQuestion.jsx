import commonApi from "api"
import { useRouter } from "next/router"
import { useState } from "react"
import { MODULE_ACTIONS } from "utils/constant"
import Toast from "utils/toast"

const useSyncQuestion = ({ secId, quizId, getQuestionList, closeModal, isAllow }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const addEditQuestion = async (values) => {
    const { id, ques, queType, opts, posMark } = values
    if (opts?.length === opts?.filter((x) => x.isAnswer === false)?.length) {
      Toast("Select any one option as an answer.", "error")
      return
    }
    const data = {
      courseId: id ? undefined : router?.query?.courseId,
      userId: id ? undefined : router?.query?.coachId,
      secId: id ? undefined : secId,
      quizId: id ? undefined : quizId,
      ques,
      queType,
      opts: opts.map((item, index) => {
        return {
          isAnswer: item.isAnswer,
          nm: item.nm,
          seq: Number(index + 1),
        }
      }),
      posMark,
    }
    setLoading(true)
    await commonApi({
      action: id ? "update" : "addQuestion",
      module: id ? "courses/sections/materials/questions" : "",
      common: !!id,
      parameters: [id],
      data,
    }).then(async ([error]) => {
      setLoading(false)
      if (error) return false
      closeModal()
      if (isAllow(MODULE_ACTIONS.GETALLQUESTIONS)) getQuestionList(secId, quizId)
      return false
    })
  }

  return {
    addEditQuestion,
    loading,
  }
}
export default useSyncQuestion
