/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable write-good-comments/write-good-comments */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import useTranslation from "next-translate/useTranslation"
import React from "react"
import { QUIZ_SUBMIT_STATUS } from "utils/constant"
import CustomCheckbox from "widgets/customCheckBox"
import OrbitLink from "widgets/orbitLink"

const QuestionPallateComp = ({ content, question, setCurrentQuestion, currentQuestion, saveQuestion, showSubmit }) => {
  const { t } = useTranslation("common")
  return (
    <>
      <div className="py-3 px-3 border-b border-light-gray">
        <p className="text-center text-lg font-bold">{t("QuestionPallet")}</p>
        {!showSubmit && (
          <div className="flex flex-col mt-3">
            <CustomCheckbox checked title={t("rightAnswer")} id={1} For={1} className="bg-green" />
            <CustomCheckbox checked title={t("wrongAnswer")} id={1} For={1} className="bg-red" />
            <CustomCheckbox checked title={t("notAnswer")} id={1} For={1} className="bg-yellow" />
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex flex-wrap justify-items-start gap-5 font-semibold text-xs">
          {question?.map((quest, index) => {
            return (
              <OrbitLink
                onClick={() => {
                  if (currentQuestion?.no !== index + 1) {
                    if (content?.sts === QUIZ_SUBMIT_STATUS.COMPLETED) {
                      setCurrentQuestion({ no: index + 1, question: quest })
                    } else {
                      saveQuestion({ no: index + 1, question: quest })
                    }
                  }
                }}
                className={`cursor-pointer h-8 w-8 flex items-center justify-center rounded-md border border-gray ${
                  quest?.sts === 2 ? "bg-primary text-white" : "border border-gray"
                } ${currentQuestion?.no === index + 1 ? "bg-primary/10 border-primary text-primary" : ""}`}
              >
                {index + 1}
              </OrbitLink>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default QuestionPallateComp
