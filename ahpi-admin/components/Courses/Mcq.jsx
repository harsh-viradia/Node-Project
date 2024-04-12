/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
import TodoAddIcon from "icons/todoAddIcon"
import TodoRemoveIcon from "icons/todoRemoveIcon"
import React from "react"
import { useFieldArray } from "react-hook-form"
import RadioButton from "widgets/radioButton"
import TextEditor from "widgets/textEditor"

const Mcq = ({ control, setValue, errors, getValues, register, placeholder = "" }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "opts",
  })

  const onChangeChecked = (index) => {
    getValues("opts")?.map((x, ind) => {
      if (ind === index) {
        setValue(`opts.${index}.isAnswer`, true)
      } else {
        setValue(`opts.${ind}.isAnswer`, false)
      }
    })
  }

  return (
    <div className="grid w-full gap-2">
      {fields.map((item, index) => (
        <div className="grid grid-cols-12 items-center gap-5">
          <div className="col-span-10 flex items-center w-full max-w-xl gap-4">
            <RadioButton
              id="mcq1"
              name="mcq"
              onChange={() => onChangeChecked(index)}
              defaultChecked={getValues(`opts.${index}.isAnswer`)}
            />
            <TextEditor
              placeholder={placeholder}
              setValue={setValue}
              valueText={`opts.${index}.nm`}
              error={errors?.opts?.[index]?.nm?.message}
              rest={register(`opts.${index}.nm`)}
              valueData={getValues(`opts.${index}.nm`)}
              className="w-full"
            />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <button
              type="button"
              className="cursor-pointer text-green"
              hidden={index !== fields.length - 1}
              onClick={() => append({ isAnswer: false, nm: "" })}
            >
              <TodoAddIcon />
            </button>
            <button type="button" hidden={fields?.length === 2} onClick={() => remove(index)}>
              <TodoRemoveIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Mcq
