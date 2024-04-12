/* eslint-disable react/no-danger */
/* eslint-disable no-unused-vars */
/* eslint-disable write-good-comments/write-good-comments */
/* eslint-disable no-lonely-if */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable no-unsafe-optional-chaining */
import useTranslation from "next-translate/useTranslation"
import { useRouter } from "node_modules/next/router"
import React, { useEffect, useState } from "react"
import Countdown from "react-countdown"
import MyConfirmPopover from "shared/widget/ConfirmPopover"
import { QUESTION_TYPE, QUIZ_LOADER, QUIZ_SUBMIT_STATUS } from "utils/constant"
import Toast from "utils/toast"
import { convertFloat } from "utils/util"
import Button from "widgets/button"

import MCQ from "./Mcq"
import MSQ from "./MSQ"
import MSQShow from "./MSQShow"
import QuestionPallateComp from "./QuestionPalleteComp"

const getTime = ([h, m, s]) => Number(h) * 60 * 60000 + Number(m) * 60000 + Number(s) * 1000
const QuizViewerComp = ({
  content = {},
  saveQuestion,
  secId,
  quizId,
  questions,
  currentQuestion,
  setCurrentQuestion,
  timeOver,
  setTimeOver,
  answer,
  setAnswer,
  currentCourseContent,
  loading,
  setLoading,
  setShowAddReviewBlock,
  progressData,
}) => {
  const { t } = useTranslation("common")
  const [openPopover, setOpenPopover] = useState(false)
  const { locale } = useRouter()
  const getQuestionType = (type, data) => {
    switch (type) {
      case QUESTION_TYPE.MCQ: {
        return <MCQ data={data} answer={answer} setAnswer={setAnswer} />
      }
      case QUESTION_TYPE.MSQ: {
        return <MSQ data={data} answer={answer} setAnswer={setAnswer} />
      }
      default: {
        return false
      }
    }
  }
  const showQuestionType = (type, data) => {
    return <MSQShow data={data?.quesId?.opts} type={type} />
  }
  const timeUpFunction = async () => {
    await setTimeOver(true)
    await setOpenPopover(true)
    await saveQuestion({
      no: currentQuestion,
      secId,
      quizId,
      submit: true,
      saveTimeOver: true,
    })
  }
  const countDownTime = ({ formatted, completed }) => {
    if (completed) {
      timeUpFunction()
    }
    return (
      <p className="font-medium text-white">
        {formatted.hours}:{formatted.minutes}:{formatted.seconds}
      </p>
    )
  }

  const counterRef = React.useRef()
  const startTime = React.useMemo(() => {
    return new Date(
      Date.now() + getTime(currentCourseContent?.duration?.split(":")) - getTime(content?.takenTm?.split(":") || "")
    )
  }, [content])

  return (
    <>
      {/* <QuizPopup> */}
      <div className="modal-body text-center overflow-hidden">
        <div className="grid grid-cols-12">
          <div className="sm:col-span-9 col-span-12 test-box sm:border-r border-light-gray flex flex-col">
            <div className="border-light-gray border-b p-6 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">{currentCourseContent.nm}</p>
              </div>
              {content?.sts === QUIZ_SUBMIT_STATUS.COMPLETED ? (
                <div className="flex items-center gap-3">
                  <p className="font-semibold">
                    {t("resulT")}: {convertFloat(content?.percentage)}%
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="font-semibold">{t("totalTime")}</p>
                  {!timeOver && (
                    <div className="flex px-4 py-1 rounded-lg bg-red">
                      <Countdown ref={counterRef} date={startTime} renderer={countDownTime} />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="p-6 overflow-auto h-[350px]">
              <div className="flex  justify-between gap-3 font-bold text-lg">
                <div className=" items-start justify-between font-bold text-base flex gap-4 w-full">
                  <div className="flex items-start gap-2 ">
                    <div>{currentQuestion?.no}.</div>
                    <div
                      className="break-all text-left overflow-auto"
                      dangerouslySetInnerHTML={{ __html: currentQuestion?.question?.quesId?.ques }}
                    />
                  </div>
                  <div className=" px-2 py-1 rounded-md bg-primary border-primary border bg-opacity-5">
                    {" "}
                    {locale === "en"
                      ? currentQuestion?.question?.quesId?.queType?.names.en
                      : currentQuestion?.question?.quesId?.queType?.names.id}
                  </div>
                </div>
              </div>
              {content?.sts === QUIZ_SUBMIT_STATUS.COMPLETED
                ? showQuestionType(currentQuestion?.question?.quesId?.queType?.code, currentQuestion?.question)
                : getQuestionType(currentQuestion?.question?.quesId?.queType?.code, currentQuestion?.question)}
            </div>
            <div className="mt-auto p-6 flex items-center justify-between gap-3">
              <div>
                <Button
                  loading={loading === QUIZ_LOADER.PREV}
                  onClick={async () => {
                    if (content?.sts === QUIZ_SUBMIT_STATUS.COMPLETED) {
                      setCurrentQuestion({
                        no: currentQuestion.no - 1,
                        question: content?.questions?.[currentQuestion.no - 2],
                      })
                    } else {
                      await setLoading(QUIZ_LOADER.PREV)
                      await saveQuestion({
                        no: { no: currentQuestion.no - 1, question: content?.questions?.[currentQuestion.no - 2] },
                        secId,
                        quizId,
                      })
                    }
                  }}
                  className={`font-medium mr-5 ${currentQuestion?.no === 1 ? "hidden" : ""}`}
                  title={t("prev")}
                />
              </div>
              <Button
                loading={loading === QUIZ_LOADER.NEXT}
                onClick={async () => {
                  if (content?.sts === QUIZ_SUBMIT_STATUS.COMPLETED) {
                    setCurrentQuestion({
                      no: currentQuestion.no + 1,
                      question: content?.questions?.[currentQuestion.no],
                    })
                  } else {
                    await setLoading(QUIZ_LOADER.NEXT)
                    await saveQuestion({
                      no:
                        content?.questions?.length === currentQuestion?.no
                          ? currentQuestion
                          : { no: currentQuestion.no + 1, question: content?.questions?.[currentQuestion.no] },
                      secId,
                      quizId,
                      save: true,
                      submit: content?.questions?.length === currentQuestion?.no,
                    })
                  }
                }}
                className={`font-medium ${
                  content?.sts === QUIZ_SUBMIT_STATUS.COMPLETED && content?.questions?.length === currentQuestion?.no
                    ? "hidden"
                    : ""
                }`}
                title={
                  content?.sts === QUIZ_SUBMIT_STATUS.COMPLETED
                    ? t("nexT")
                    : content?.questions?.length === currentQuestion?.no
                    ? t("saveSubmit")
                    : t("saveNext")
                }
              />
              {/* {content?.sts !== QUIZ_SUBMIT_STATUS.COMPLETED && (
                <Button
                  kind="red"
                  hoverKind="white"
                  darkHoverKind="pink"
                  title={`${t("close")}`}
                  onClick={() => {
                    setOpenPopover(true)
                  }}
                />
              )} */}
            </div>
          </div>
          <div className="sm:col-span-3 col-span-12 test-box overflow-auto flex flex-col">
            <QuestionPallateComp
              content={content}
              question={questions}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
              saveQuestion={(no) => {
                saveQuestion({
                  no,
                  secId,
                  quizId,
                })
              }}
              submitQuiz={() => setOpenPopover(true)}
              showSubmit={content?.sts !== QUIZ_SUBMIT_STATUS.COMPLETED}
            />
          </div>
        </div>
      </div>
      {/* </QuizPopup> */}
      {openPopover && (
        <MyConfirmPopover
          isOpen={openPopover}
          close={() => {
            setOpenPopover(false)
            if (timeOver) {
              setTimeOver(false)
              if (progressData?.sts === 2) setShowAddReviewBlock(2)
            }
          }}
          onClickConfirm={async () => {
            await setLoading(QUIZ_LOADER.SUBMIT)
            await saveQuestion({
              no: currentQuestion,
              secId,
              quizId,
              submit: true,
            })
            await setOpenPopover(false)
          }}
          questions={questions}
          attemptedQuestions={questions?.filter((a) => a.answer?.ansIds?.length > 0)}
          status={content?.sts}
          showCancel={!timeOver}
          loading={loading}
        />
      )}
    </>
  )
}

export default QuizViewerComp
