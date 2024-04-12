/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"

import AdminQuizViewerComp from "./adminQuizViewerComp"
import useQuizDetailsComp from "./hook/useQuizDetailsComp"
import QuizViewerComp from "./quizViewerComp"

const QuizContentCurrent = ({
  content,
  setShowAddReviewBlock,
  progressData,
  isFromAdmin,
  updateProgress = () => {},
}) => {
  const { setCurrentCourseContent, currentCourseContent } = useContext(AppContext)
  const [viewQuiz, setViewQuiz] = useState(false)
  const callUpdate = (showReviewBlock, quizObj, callback) => {
    updateProgress({
      secId: content.secId,
      materialId: content.materialId,
      nextId: content.nextId,
      sts: 2, // send ony if material progress complete
      showReviewBlock,
      quizObj,
      callback,
    })
  }
  const {
    quizStart,
    quizData = {},
    saveQuestion,
    questions,
    currentQuestion,
    setCurrentQuestion,
    timeOver,
    setTimeOver,
    answer,
    setAnswer,
    loading,
    setLoading,
  } = useQuizDetailsComp({
    courseId: content.courseId,
    currentCourseContent,
    setViewQuiz,
    callUpdate,
    setCurrentCourseContent,
  })

  useEffect(() => {
    quizStart({
      secId: content.secId,
      quizId: content._id,
      isFromAdmin,
    })
  }, [content._id])
  return (
    viewQuiz &&
    (isFromAdmin ? (
      <AdminQuizViewerComp
        loading={loading}
        setLoading={setLoading}
        content={quizData}
        currentCourseContent={currentCourseContent}
        show={viewQuiz}
        saveQuestion={saveQuestion}
        secId={content.secId}
        quizId={content._id}
        questions={questions}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
      />
    ) : (
      <QuizViewerComp
        loading={loading}
        setLoading={setLoading}
        content={quizData}
        currentCourseContent={currentCourseContent}
        show={viewQuiz}
        saveQuestion={saveQuestion}
        secId={content.secId}
        quizId={content._id}
        questions={questions}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        timeOver={timeOver}
        setTimeOver={setTimeOver}
        answer={answer}
        setAnswer={setAnswer}
        setShowAddReviewBlock={setShowAddReviewBlock}
        progressData={progressData}
      />
    ))
  )
}

export default QuizContentCurrent
