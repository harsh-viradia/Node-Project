/* eslint-disable no-underscore-dangle */
import React from "react"
import ReactHtmlParser from "react-html-parser"
import RadioButton from "widgets/radioButton"

const QuestionBox = ({ control, setValue, errors, useFieldArray, clearErrors }) => {
  const { fields } = useFieldArray({
    control,
    name: "data",
  })

  const questionAnswerChange = (ind, x) => {
    setValue(`data.${ind}.ansIds`, x._id)
    clearErrors(`data.${ind}.ansIds`)
  }

  return (
    <>
      {fields.map((item, index) => (
        <div className="grid grid-cols-1 gap-4 pt-4">
          <div className="p-3 bg-secondary rounded-lg text-xs flex gap-1.5">
            <span className="text-black text-sm font-bold">{index + 1}.</span>
            <div className="w-full">
              <div className="text-black font-medium text-sm">{ReactHtmlParser(item.title)}</div>
              <div className="flex items-center gap-4 pt-3 mt-3 border-t border-light-gray text-sm text-black font-medium">
                {item?.options?.map((x) => (
                  <RadioButton
                    title={ReactHtmlParser(x.desc)}
                    name={index}
                    onChange={() => questionAnswerChange(index, x)}
                    defaultChecked={item?.answer?.[0]?.ansIds?.[0] === x._id}
                  />
                ))}
              </div>
              {errors.data?.[index]?.ansIds?.message && (
                <p className="text-xs font-medium mt-1 text-red">{errors.data?.[index]?.ansIds?.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default QuestionBox
