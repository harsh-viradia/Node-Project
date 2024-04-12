/* eslint-disable no-underscore-dangle */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { quizCertificateSchema, quizSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import { NUMBER_REGEX, REPLACE_NUMBER_REGEX } from "utils/constant"
import { integerFormat } from "utils/helper"
import Button from "widgets/button"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"

import useQuiz from "./hooks/useQuiz"

const defaultValues = {
  id: undefined,
  nm: undefined,
  desc: undefined,
  viewSetOfQue: undefined,
  duration: undefined,
  passingScore: undefined,
}

const AddQuiz = ({
  open,
  setOpen,
  title = "Add",
  setSectionTitle,
  secId,
  getMaterialList,
  editQuizData,
  setEditQuizData,
  quizCertificate,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: quizCertificate ? yupResolver(quizCertificateSchema) : yupResolver(quizSchema),
  })

  const { addUpdateQuiz, loading } = useQuiz({
    reset,
    defaultValues,
    setSectionTitle,
    setOpen,
    secId,
    getMaterialList,
    quizCertificate,
  })

  useEffect(() => {
    reset({ ...defaultValues })
    if (!open) {
      setEditQuizData()
    }
  }, [open])

  useEffect(() => {
    if (editQuizData) {
      setValue("id", editQuizData?._id)
      setValue("nm", editQuizData.nm)
      setValue("desc", editQuizData.desc)
      setValue("viewSetOfQue", editQuizData.viewSetOfQue)
      setValue("duration", integerFormat(editQuizData.duration))
      setValue("passingScore", editQuizData.passingScore)
    }
  }, [editQuizData])

  const closeModal = () => {
    setOpen(false)
    setSectionTitle("Add")
    setEditQuizData()
    reset({ ...defaultValues })
  }

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
      handleSubmit(addUpdateQuiz)()
    }
  }

  return (
    <DrawerWrapper
      modalFooter={
        <div className="flex gap-3 ">
          <Button
            title="Close"
            onClick={() => closeModal()}
            kind="dark-gray"
            hoverKind="white"
            darkHoverKind="primary"
            disabled={loading}
          />{" "}
          <Button
            onClick={handleSubmit(addUpdateQuiz)}
            title={title === "Add" ? `${title} Quiz` : "Update Quiz"}
            loading={loading}
          />{" "}
        </div>
      }
      title={`${title} Quiz`}
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Input
          label="Title"
          placeholder="Enter Title"
          mandatory
          rest={register("nm")}
          error={errors.nm?.message}
          disabled={loading}
          onKeyDown={onKeyDown}
        />
        <TextEditor
          label="Quiz Description"
          placeholder="Enter Quiz Description"
          // mandatory
          rest={editQuizData ? watch("desc") : register("desc")}
          setValue={setValue}
          valueText="desc"
          valueData={getValues("desc")}
          error={errors.desc?.message}
        />
        <Input
          label="View Set of Questions"
          placeholder="Enter Set of Questions"
          mandatory
          rest={register("viewSetOfQue", {
            onChange: (event) => {
              handleNumber(event, "viewSetOfQue")
            },
          })}
          error={errors.viewSetOfQue?.message}
          disabled={loading}
          onKeyDown={onKeyDown}
        />
        <Input
          label="Duration (In minutes)"
          placeholder="Enter Duration"
          mandatory
          rest={register("duration", {
            onChange: (event) => {
              handleNumber(event, "duration")
            },
          })}
          disabled={loading}
          error={errors.duration?.message}
          onKeyDown={onKeyDown}
        />
      </div>
      {quizCertificate && (
        <Input
          label="Passing Score"
          placeholder="Enter Passing Score"
          mandatory
          rest={register("passingScore", {
            onChange: (event) => {
              handleNumber(event, "passingScore")
            },
          })}
          disabled={loading}
          error={errors.passingScore?.message}
          onKeyDown={onKeyDown}
        />
      )}
    </DrawerWrapper>
  )
}

export default AddQuiz
