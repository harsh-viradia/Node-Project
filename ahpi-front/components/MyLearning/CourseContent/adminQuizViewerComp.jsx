/* eslint-disable react/no-danger */
/* eslint-disable no-unused-vars */
/* eslint-disable write-good-comments/write-good-comments */
/* eslint-disable no-lonely-if */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable no-unsafe-optional-chaining */
import useTranslation from "next-translate/useTranslation"
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
const AdminQuizViewerComp = ({
  content = {},
  questions,
  currentQuestion,
  setCurrentQuestion,
  currentCourseContent,
}) => {
  const { t } = useTranslation("common")
  const showQuestionType = (type, data) => {
    return <MSQShow data={data?.opts} type={type} />
  }

  return (
    <>
      {/* <QuizPopup> */}
      <div className="modal-body text-center overflow-hidden sm:h-[500px]">
        <div className="grid grid-cols-12">
          <div className="sm:col-span-9 col-span-12 test-box sm:border-r border-light-gray flex flex-col">
            <div className="border-light-gray border-b p-6 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">{currentCourseContent.nm}</p>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-semibold">
                  {t("quizTime")} : {currentCourseContent?.duration}
                </p>
              </div>
            </div>
            <div className="p-6 overflow-auto h-[350px]">
              <div className="flex  justify-between gap-3 font-bold text-lg">
                <div className=" items-start justify-between font-bold text-base flex gap-4 w-full">
                  <div className="flex items-start gap-2 ">
                    <div>{currentQuestion?.no}.</div>
                    <div
                      className="break-words text-left"
                      dangerouslySetInnerHTML={{ __html: currentQuestion?.question?.ques }}
                    />
                  </div>
                  <div> {currentQuestion?.question?.queType?.name}</div>
                </div>
              </div>
              {showQuestionType(currentQuestion?.question?.queType?.code, currentQuestion?.question)}
            </div>
            <div className="mt-auto p-6 flex items-center justify-between gap-3">
              <div>
                <Button
                  onClick={async () => {
                    setCurrentQuestion({
                      no: currentQuestion.no - 1,
                      question: content?.questions?.[currentQuestion.no - 2],
                    })
                  }}
                  className={`font-medium mr-5 ${currentQuestion?.no === 1 ? "hidden" : ""}`}
                  title={t("prev")}
                />
              </div>
              <Button
                onClick={async () => {
                  setCurrentQuestion({
                    no: currentQuestion.no + 1,
                    question: content?.questions?.[currentQuestion.no],
                  })
                }}
                className={`font-medium ${content?.questions?.length === currentQuestion?.no ? "hidden" : ""}`}
                title={t("nexT")}
              />
            </div>
          </div>
          <div className="sm:col-span-3 col-span-12 test-box overflow-auto flex flex-col">
            <QuestionPallateComp
              content={content}
              question={questions}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
              showSubmit
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminQuizViewerComp
