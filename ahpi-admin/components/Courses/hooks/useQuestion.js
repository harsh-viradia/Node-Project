/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import getConfig from "next/config"
import { useRouter } from "next/router"
import { useState } from "react"
import { DEFAULT_LIMIT } from "utils/constant"

const { publicRuntimeConfig } = getConfig()

const useQuestion = ({ secId, materialId, setOpen2 }) => {
  const router = useRouter()
  const [questionsList, setQuestionList] = useState([])
  const [deleteQuestionData, setDeleteQuestionData] = useState({})
  const [loading, setLoading] = useState(false)
  const [videoStatusData, setVideoStatusData] = useState()
  const getQuestionsList = async () => {
    const payload = {
      options: {
        offset: 0,
        limit: DEFAULT_LIMIT,
        populate: ["queType"],
      },
      query: {
        userId: router?.query?.coachId,
        courseId: router?.query?.courseId,
        secId,
        quizId: materialId,
      },
    }
    try {
      setLoading(true)
      await commonApi({
        action: "add",
        module: "courses/sections/materials/questions",
        common: true,
        data: payload,
      }).then(([, { data = {} }]) => {
        setQuestionList(data.data)
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteQuestion = async () => {
    const data = {
      ids: [deleteQuestionData?.id],
    }
    await commonApi({
      action: "deleteQuestion",
      data,
    }).then(async ([error]) => {
      if (error) return false
      getQuestionsList()
      setOpen2(false)
      setDeleteQuestionData()
      return false
    })
  }
  const getVideoStatus = async (id) => {
    const { token } = await fetch(`${publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL}/api/getToken`).then((response) =>
      response.json()
    )
    try {
      setLoading(true)
      fetch(`${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/file/status/${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `jwt ${token}`,
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then(({ data }) => {
          setVideoStatusData(data)
          return false
        })
        .catch(() => {})
    } finally {
      setLoading(false)
    }
  }
  return {
    getQuestionsList,
    questionsList,
    setQuestionList,
    deleteQuestion,
    deleteQuestionData,
    setDeleteQuestionData,
    loading,
    videoStatusData,
    getVideoStatus,
    setVideoStatusData,
  }
}
export default useQuestion
