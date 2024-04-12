/* eslint-disable no-useless-return */
/* eslint-disable array-callback-return */
/* eslint-disable promise/always-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable promise/no-nesting */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable unicorn/prevent-abbreviations */

import commonApi from "api/index"
import useTranslation from "next-translate/useTranslation"
import { useState } from "react"
import Toast from "utils/toast"
import { getTimeFromSecond } from "utils/util"

const useQuizDetailsComp = ({
  courseId = {},
  setViewQuiz,
  callUpdate = () => {},
  setCurrentCourseContent = () => {},
  currentCourseContent,
}) => {
  const [quizData, setquizData] = useState()
  const [questions, setQuestions] = useState()
  const [currentQuestion, setCurrentQuestion] = useState()
  const [timeOver, setTimeOver] = useState(false)
  const [questTimer, setQuestTimer] = useState()
  const [answer, setAnswer] = useState()
  const [loading, setLoading] = useState()
  const { t } = useTranslation("common")

  const quizStart = async ({ secId, quizId, isFromAdmin }) => {
    if (isFromAdmin) {
      await setquizData({ ...currentCourseContent, sts: 2 })
      await setCurrentCourseContent({ ...currentCourseContent, quizStatus: 2 })
      await setQuestions(currentCourseContent.questions)
      await setCurrentQuestion({ no: 1, question: currentCourseContent?.questions?.[0] })
      await setViewQuiz(true)
    } else {
      const payload = {
        courseId: courseId._id,
        secId,
        quizId,
        quizType: currentCourseContent?.type,
      }
      await commonApi({
        action: "quizStart",
        data: payload,
      }).then(async ([error, { data }]) => {
        if (error) {
          setViewQuiz(false)
          return
        }
        await setquizData({ ...data, sts: data?.sts })
        await setCurrentCourseContent({ ...currentCourseContent, quizStatus: data?.sts })
        const setQuest = await data?.questions?.map((quest, index) => {
          const selectedAnswer = data?.questions?.[index]?.quesId?.opts?.filter((a) => a.userAnswer).map((a) => a._id)
          return {
            ...quest,
            answer: {
              ansIds: selectedAnswer,
            },
            sts: selectedAnswer?.length ? 2 : 1,
          }
        })
        await setQuestions(setQuest)
        await setCurrentQuestion({ no: 1, question: setQuest?.[0] })
        await setQuestTimer(Date.now())
        await setAnswer(setQuest?.[0]?.answer)
        await setViewQuiz(true)
      })
    }
  }
  const submitQuiz = async ({ secId, quizId, saveTimeOver }) => {
    const payload = {
      courseId: courseId._id,
      secId,
      quizId,
      sts: 2, // for completed quiz
    }
    await callUpdate(saveTimeOver, payload, () => {
      setLoading(false)
      quizStart({ secId, quizId })
    })
    // await commonApi({
    //   action: "submitQuiz",
    //   data: payload,
    // }).then(async ([error, { message }]) => {
    //   setLoading(false)
    //   if (error) return

    // })
  }
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const saveQuestion = async ({ secId, quizId, no, save, submit, saveTimeOver }) => {
    if (save && !answer?.ansIds?.length) {
      setLoading(false)
      Toast(t("selectAnswer"), "error")
      return
    }
    const payload = {
      courseId: courseId._id,
      secId,
      quizId,
      takenTm: getTimeFromSecond((Date.now() - questTimer) / 1000),
      queType: currentQuestion?.question?.quesId?.queType?._id,
      quesId: currentQuestion?.question?.quesId?._id,
      ansIds: answer?.ansIds,
      sts: answer?.ansIds?.length ? 2 : 1, // 1 for not_attempted, 2 for attempted
    }
    await commonApi({
      action: "saveQuestion",
      data: payload,
    }).then(async ([error]) => {
      if (!submit) setLoading(false)
      if (error) return
      const updatedQueList = await questions.map((a, index) => {
        return index === currentQuestion.no - 1
          ? {
              ...a,
              answer,
              sts: answer?.ansIds?.length ? 2 : 1,
            }
          : a
      })
      await setQuestions([...updatedQueList])
      await setQuestTimer(Date.now())
      await setCurrentQuestion(no)
      await setAnswer(questions[no.no - 1]?.answer || [])
      if (submit) {
        await submitQuiz({ secId, quizId, saveTimeOver })
      }
    })
  }

  return {
    quizStart,
    quizData,
    saveQuestion,
    submitQuiz,
    questions,
    currentQuestion,
    setCurrentQuestion,
    timeOver,
    setTimeOver,
    answer,
    setAnswer,
    loading,
    setLoading,
  }
}

export default useQuizDetailsComp
