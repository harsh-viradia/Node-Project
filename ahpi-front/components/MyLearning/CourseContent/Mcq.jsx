/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-danger */
import React from "react"
import RadioButton from "widgets/radioButton"

const MCQ = ({ data, answer, setAnswer }) => {
  return (
    <div className="grid gap-5 font-medium mt-6">
      {data?.quesId?.opts?.map((opt) => {
        return (
          <RadioButton
            title={<div dangerouslySetInnerHTML={{ __html: opt?.nm }} />}
            id={opt?.seq}
            For={opt?.seq}
            value={opt?._id}
            checked={answer?.ansIds?.[0] === opt?._id}
            onChange={(event) => {
              setAnswer({ ansIds: [opt?._id] })
            }}
            name="mcqQuestion"
            className="text-base font-medium cursor-pointer"
            topClass="text-left"
          />
        )
      })}
    </div>
  )
}

export default MCQ
