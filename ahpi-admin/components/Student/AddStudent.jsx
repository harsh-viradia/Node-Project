/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { studentSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import { MASTER_CODES, NUMBER_REGEX, REPLACE_NUMBER_REGEX } from "utils/constant"
import Button from "widgets/button"
import DateInput from "widgets/dateInput"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"
import MasterSelect from "widgets/masterSelect"

import useSyncStudent from "./hooks/useSyncStudent"

const defaultValues = {
  id: undefined,
  nikNo: undefined,
  nim: undefined,
  appliedDate: undefined,
  firstName: undefined,
  universityId: undefined,
  universityNm: undefined,
  majorId: undefined,
  majorNm: undefined,
  courses: undefined,
  stsId: undefined,
  stsNm: undefined,
  ipk: undefined,
  semesterId: undefined,
  semesterNm: undefined,
  entryId: undefined,
  entryYear: undefined,
  entryStsId: undefined,
  entryStsNm: undefined,
  universityTypeId: undefined,
  universityTypeNm: undefined,
  email: undefined,
  mobile: undefined,
}

const AddStudent = ({ open, setOpen, title = "Add Applicant", getList, data, pagination, permission }) => {
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(studentSchema),
  })
  const {
    loading,
    universityOptions,
    selectValue,
    setSelectValue,
    onSelectInputChange,
    getAllUniversities,
    courseOptions,
    selectValue2,
    setSelectValue2,
    onSelectInputChange2,
    getAllCourses,
    onSubmit,
    setCourseRemoveIds,
  } = useSyncStudent({
    open,
    setOpen,
    getList,
    reset,
    defaultValues,
    pagination,
    clearErrors,
    permission,
  })

  useEffect(() => {
    reset({ ...defaultValues })
    if (open && data) {
      setValue("id", data?._id)
      setValue("nikNo", data?.nikNo)
      setValue("nim", data?.nim)
      setValue("firstName", data?.firstName)
      setValue("majorId", data?.majorId)
      setValue("majorNm", data?.majorNm)
      setValue("stsId", data?.stsId)
      setValue("stsNm", data?.stsNm)
      setValue("ipk", data?.ipk)
      setValue("semesterId", data?.semesterId)
      setValue("semesterNm", data?.semesterNm)
      setValue("entryId", data?.entryId)
      setValue("entryYear", data?.entryYear)
      setValue("entryStsId", data?.entryStsId)
      setValue("entryStsNm", data?.entryStsNm)
      setValue("universityTypeId", data?.universityTypeId)
      setValue("universityTypeNm", data?.universityTypeNm)
      setValue("email", data?.emails?.[0]?.email)
      setValue("mobile", data?.mobile?.no)
      if (data?.courses?.length) {
        const dt = data.courses.map((item) => {
          return {
            value: item.courseId,
            label: item.courseNm,
          }
        })
        setValue("courses", dt)
        setSelectValue2(dt)
        setCourseRemoveIds(dt)
      }

      if (data?.appliedDate) {
        setValue("appliedDate", data?.appliedDate ? new Date(data.appliedDate.split("T")[0]) : undefined)
      }
      if (data?.universityId && data.universityNm) {
        setSelectValue([{ label: data.universityTypeNm, value: data.universityTypeId }])
        setValue("universityId", data?.universityId)
        setValue("universityNm", data?.universityNm)
      }
    }
  }, [open])

  const closeModal = () => {
    setOpen(false)
  }

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
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

  return (
    <DrawerWrapper
      title={title}
      modalFooter={
        <>
          <Button onClick={() => closeModal()} title="Close" kind="dark-gray" hoverKind="white" disabled={loading} />
          <Button title={title} onClick={handleSubmit(onSubmit)} loading={loading} />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3 items-start">
        <Input
          label="NIK *"
          placeholder="Enter NIK"
          minLength="16"
          maxLength="16"
          rest={register("nikNo", {
            onChange: (event) => {
              handleNumber(event, "nikNo")
            },
          })}
          error={errors?.nikNo?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <Input
          label="NIM *"
          placeholder="Enter NIM"
          rest={register("nim")}
          error={errors?.nim?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <DateInput
          label="Applied Date *"
          placeholder="Enter Applied Date"
          error={errors.appliedDate?.message}
          setDate={(date) => {
            setValue("appliedDate", date, { shouldValidate: true })
          }}
          date={watch("appliedDate")}
        />
        <Input
          label="Name *"
          placeholder="Enter Name"
          rest={register("firstName")}
          error={errors?.firstName?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <Dropdown
              isDisabled={loading}
              placeholder="Select University"
              className="w-full"
              label="University *"
              id="UniversityId"
              value={selectValue}
              rest={register("universityId")}
              defaultOptions={universityOptions}
              loadOptions={getAllUniversities}
              onInputChange={onSelectInputChange}
              onChange={(opt) => {
                setValue("universityId", opt.value)
                setValue("universityNm", opt.label)
                clearErrors("universityId")
              }}
              onKeyDown={(event) => onKeyDown(event)}
              error={errors?.universityId?.message}
            />
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <MasterSelect
              isDisabled={loading}
              placeholder="Select Major"
              className="w-full"
              label="Major *"
              id="majorId"
              code={MASTER_CODES.major}
              rest={register("majorId")}
              error={errors.majorId?.message}
              value={watch("majorId") ? { label: watch("majorNm"), value: watch("majorId") } : undefined}
              onChange={(opt) => {
                clearErrors("majorId")
                setValue("majorId", opt.value)
                setValue("majorNm", opt.label)
              }}
              onKeyDown={(event) => onKeyDown(event)}
            />
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <Dropdown
              isMulti
              isDisabled={loading}
              placeholder="Select Courses"
              className="w-full"
              label="Courses Applied *"
              id="coursesAppliedId"
              value={selectValue2}
              rest={register("courses")}
              defaultOptions={courseOptions}
              loadOptions={getAllCourses}
              onInputChange={onSelectInputChange2}
              onChange={(opt) => {
                const newOpt = opt.map((item) => {
                  return {
                    courseId: item.value,
                    courseNm: item.label,
                  }
                })
                setValue("courses", newOpt)
                setSelectValue2(opt)
                clearErrors("courses")
              }}
              error={errors?.courses?.message}
            />
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <MasterSelect
              isDisabled={loading}
              placeholder="Select Status"
              className="w-full"
              label="Status *"
              id="stsId"
              code={MASTER_CODES.userStatus}
              rest={register("stsId")}
              error={errors.stsId?.message}
              value={watch("stsId") ? { label: watch("stsNm"), value: watch("stsId") } : undefined}
              onChange={(opt) => {
                clearErrors("stsId")
                setValue("stsId", opt.value)
                setValue("stsNm", opt.label)
              }}
              onKeyDown={(event) => onKeyDown(event)}
            />
          </div>
        </div>

        <Input
          label="IPK *"
          placeholder="Enter IPK"
          rest={register("ipk")}
          error={errors?.ipk?.message}
          disabled={loading}
          onKeyDown={(event) => onKeyDown(event)}
        />

        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <MasterSelect
              isDisabled={loading}
              placeholder="Select Semester"
              className="w-full"
              label="Semester *"
              id="semesterId"
              code={MASTER_CODES.semester}
              rest={register("semesterId")}
              error={errors.semesterId?.message}
              value={watch("semesterId") ? { label: watch("semesterNm"), value: watch("semesterId") } : undefined}
              onChange={(opt) => {
                clearErrors("semesterId")
                setValue("semesterId", opt.value)
                setValue("semesterNm", opt.label)
              }}
              onKeyDown={(event) => onKeyDown(event)}
            />
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <MasterSelect
              isDisabled={loading}
              placeholder="Select Entry Year"
              className="w-full"
              label="Entry Year *"
              id="entryId"
              code={MASTER_CODES.entryYear}
              rest={register("entryId")}
              error={errors.entryId?.message}
              value={watch("entryId") ? { label: watch("entryYear"), value: watch("entryId") } : undefined}
              onChange={(opt) => {
                clearErrors("entryId")
                setValue("entryId", opt.value)
                setValue("entryYear", opt.label)
              }}
              onKeyDown={(event) => onKeyDown(event)}
            />
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <MasterSelect
              isDisabled={loading}
              placeholder="Select Entry Status"
              className="w-full"
              label="Entry Status *"
              id="entryStsId"
              code={MASTER_CODES.entryStatus}
              rest={register("entryStsId")}
              error={errors.entryStsId?.message}
              value={watch("entryStsId") ? { label: watch("entryStsNm"), value: watch("entryStsId") } : undefined}
              onChange={(opt) => {
                clearErrors("entryStsId")
                setValue("entryStsId", opt.value)
                setValue("entryStsNm", opt.label)
              }}
              onKeyDown={(event) => onKeyDown(event)}
            />
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="w-full gap-2">
            <MasterSelect
              isDisabled={loading}
              placeholder="Select University Type"
              className="w-full"
              label="University Type *"
              id="universityTypeId"
              code={MASTER_CODES.universityType}
              rest={register("universityTypeId")}
              error={errors.universityTypeId?.message}
              value={
                watch("universityTypeId")
                  ? { label: watch("universityTypeNm"), value: watch("universityTypeId") }
                  : undefined
              }
              onChange={(opt) => {
                clearErrors("universityTypeId")
                setValue("universityTypeId", opt.value)
                setValue("universityTypeNm", opt.label)
              }}
              onKeyDown={(event) => onKeyDown(event)}
            />
          </div>
        </div>

        <Input
          label="Email *"
          placeholder="Enter Your Email"
          rest={register("email")}
          error={errors.email?.message}
          disabled={getValues("id") || loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
        <Input
          label="Phone Number *"
          placeholder="Enter Phone Number"
          minLength="7"
          rest={register("mobile", {
            onChange: (event) => {
              handleNumber(event, "mobile")
            },
          })}
          error={errors.mobile?.message}
          disabled={getValues("id") || loading}
          onKeyDown={(event) => onKeyDown(event)}
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddStudent
