/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { addQuestionSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import { MASTER_CODES, NUMBER_REGEX, QUESTION_TYPE, REPLACE_NUMBER_REGEX } from "utils/constant"
import Button from "widgets/button"
import Input from "widgets/input"
import MasterSelect from "widgets/masterSelect"
import TextEditor from "widgets/textEditor"

import useSyncQuestion from "./hooks/useSyncQuestion"
import Mcq from "./Mcq"
import MSQ from "./Msq"

const defaultValues = {
  id: undefined,
  ques: undefined,
  queType: undefined,
  opts: [
    { nm: undefined, isAnswer: false },
    { nm: undefined, isAnswer: false },
  ],
}

const QuizQuestion = ({
  open,
  setOpen,
  title = "Add",
  placeholder,
  setSectionTitle,
  secId,
  quizId,
  getQuestionList,
  editQuestionData,
  setEditQuestionData,
  isAllow,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    control,
    clearErrors,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(addQuestionSchema),
  })

  const [questionType, setQuestionType] = useState(QUESTION_TYPE.MCQ)
  const closeModal = () => {
    setOpen(false)
    reset({ ...defaultValues })
    setSectionTitle("Add")
    setEditQuestionData()
    setQuestionType(QUESTION_TYPE.MCQ)
  }
  const { addEditQuestion, loading } = useSyncQuestion({
    setOpen,
    setSectionTitle,
    reset,
    defaultValues,
    secId,
    quizId,
    getQuestionList,
    setQuestionType,
    closeModal,
    isAllow,
  })

  useEffect(() => {
    reset({ ...defaultValues })
    if (!open) {
      setEditQuestionData()
      setQuestionType(QUESTION_TYPE.MCQ)
    }
  }, [open])

  useEffect(() => {
    setValue("id", editQuestionData?._id)
    setValue("ques", editQuestionData?.ques)
    setValue("queType", editQuestionData?.queType?._id)
    setValue("queTypeNm", editQuestionData?.queType?.name)
    setValue("opts", editQuestionData?.opts)
    setValue("posMark", editQuestionData?.posMark)
    setQuestionType(editQuestionData?.queType?.name)
  }, [editQuestionData])

  const handleNumber = (event, type) => {
    const { value } = event.target
    if (value && NUMBER_REGEX.test(value)) {
      setValue(type, value)
    } else if (!value) {
      setValue(type, "")
    } else {
      setValue(type, value.replace(REPLACE_NUMBER_REGEX, ""))
    }
  }

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(addEditQuestion)()
    }
  }

  return (
    <DrawerWrapper
      modalFooter={
        <div className="flex gap-3">
          <Button title="Close" onClick={() => closeModal()} outline disabled={loading} />{" "}
          <Button
            onClick={handleSubmit(addEditQuestion)}
            title={title === "Add" ? `${title} Question` : "Update Question"}
            loading={loading}
          />{" "}
        </div>
      }
      title={`${title} Question`}
      open={open}
      setOpen={closeModal}
      width="max-w-3xl"
    >
      <div className="grid gap-3">
        <div>
          <div className="grid gap-3">
            <TextEditor
              label="Question"
              placeholder="Enter Question"
              mandatory
              rest={register("ques")}
              setValue={setValue}
              valueText="ques"
              valueData={getValues("ques")}
              error={errors.ques?.message}
            />
            <MasterSelect
              showCode
              isDisabled={loading}
              placeholder="Select Type"
              className="w-full"
              label="Type"
              mandatory
              id="queType"
              code={MASTER_CODES.questionType}
              rest={register("queType")}
              error={errors.queType?.message}
              value={watch("queType") ? { label: watch("queTypeNm"), value: watch("queType") } : undefined}
              onChange={(opt) => {
                setValue("queType", opt?.value, { shouldValidate: true })
                setValue("queTypeNm", opt?.label)
                setValue(
                  "opts",
                  opt?.label === questionType ? watch("opts") : watch("opts")?.map((a) => ({ ...a, isAnswer: false }))
                )
                if (opt?.label === QUESTION_TYPE.MSQ) {
                  setQuestionType(QUESTION_TYPE.MSQ)
                } else if (opt?.label === QUESTION_TYPE.MCQ) {
                  setQuestionType(QUESTION_TYPE.MCQ)
                }
              }}
              onKeyDown={onKeyDown}
              isClearable
              isSearch={false}
            />
            <div>
              <label className="inline-block mb-2 text-xs font-medium text-foreground">
                {" "}
                Answer <span className="text-red pl-0.5">*</span>
              </label>
              <div className="grid gap-3">
                {questionType === QUESTION_TYPE.MCQ ? (
                  <Mcq
                    placeholder="Enter Answer"
                    control={control}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    getValues={getValues}
                  />
                ) : (
                  <MSQ
                    control={control}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    getValues={getValues}
                    clearErrors={clearErrors}
                    watch={watch}
                    placeholder="Enter Answer"
                  />
                )}
              </div>
              <div className="grid gap-3 mt-2">
                <Input
                  label="Score"
                  placeholder="Enter score"
                  mandatory
                  rest={register("posMark", {
                    onChange: (event) => {
                      handleNumber(event, "posMark")
                    },
                  })}
                  disabled={loading}
                  error={errors.posMark?.message}
                  onKeyDown={onKeyDown}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DrawerWrapper>
  )
}

export default QuizQuestion
