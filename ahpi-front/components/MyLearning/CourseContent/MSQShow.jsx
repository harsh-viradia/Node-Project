/* eslint-disable sonarjs/no-all-duplicated-branches */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-danger */
import React from "react"
import { QUESTION_TYPE } from "utils/constant"
import CustomCheckbox from "widgets/customCheckBox"

const MSQShow = ({ data = [], type }) => {
  return (
    <div className="grid grid-cols-1 max-w-lg gap-5 font-medium mt-6">
      {data?.map((opt) => {
        return (
          <div>
            <div>
              <CustomCheckbox
                checked={opt.isAnswer || opt.userAnswer}
                title={<div dangerouslySetInnerHTML={{ __html: opt?.nm }} />}
                id={opt?.seq}
                For={opt?.seq}
                labelClassName={type === QUESTION_TYPE.MCQ ? "showCustomRadio" : ""}
                className={
                  opt.userAnswer ? (opt.isAnswer ? "bg-green" : "bg-red") : opt.isAnswer ? "bg-yellow" : "bg-light-gray"
                }
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MSQShow
