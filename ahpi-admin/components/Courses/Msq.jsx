/* eslint-disable jsx-a11y/label-has-associated-control */
import TodoAddIcon from "icons/todoAddIcon"
import TodoRemoveIcon from "icons/todoRemoveIcon"
import React from "react"
import { useFieldArray } from "react-hook-form"
import Checkbox from "widgets/checkbox"
import TextEditor from "widgets/textEditor"

const MSQ = ({ control, register, setValue, getValues, errors, watch, placeholder }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "opts",
  })

  const onChangeChecked = (index) => {
    setValue(`opts.${index}.isAnswer`, !getValues(`opts.${index}.isAnswer`))
  }

  return (
    <form className="grid w-full gap-2">
      {fields.map((item, index) => (
        <div className="grid grid-cols-12 items-center gap-5">
          <div className="col-span-10 flex items-center w-full max-w-xl gap-4">
            <Checkbox
              id="mcq1"
              name="mcq"
              onChange={() => onChangeChecked(index)}
              defaultChecked={getValues(`opts.${index}.isAnswer`)}
              checked={watch(`opts.${index}.isAnswer`)}
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
              onClick={() => append({ seq: index + 2, isAnswer: false, nm: "" })}
            >
              <TodoAddIcon />
            </button>
            <button type="button" hidden={fields?.length === 2} onClick={() => remove(index)}>
              <TodoRemoveIcon />
            </button>
          </div>
        </div>
      ))}
    </form>
  )
}

export default MSQ
