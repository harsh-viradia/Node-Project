/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-underscore-dangle */
import { yupResolver } from "@hookform/resolvers/yup"
import dayjs from "dayjs"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { notificationSchema } from "schema/master"
import DrawerWrapper from "shared/drawer"
import {
  COURSE_TYPE,
  CRITERIA_TYPE,
  MASTER_CODES,
  MODULE_ACTIONS,
  NOTIFICATION_TYPE,
  NOTIFICATION_USER_TYPES,
} from "utils/constant"
import Button from "widgets/button"
import Checkbox from "widgets/checkbox"
import DateTimeRangeInput from "widgets/dateTimeRangeInput"
import Divider from "widgets/divider"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"
import Input from "widgets/input"
import MasterSelect from "widgets/masterSelect"
import TextEditor from "widgets/textEditor"
import Upload from "widgets/upload"

import useAddNotification from "./hook/useAddNotification"

const defaultValues = {
  nm: "",
  title: "",
  desc: "",
  isShowList: false,
  startDt: "",
  endDt: "",
  startTime: "00:00",
  endTime: "00:00",
  typeId: undefined,
  imgId: undefined,
  criteriaId: undefined,
  users: undefined,
  categories: undefined,
  courses: undefined,
  pages: undefined,
  userTypeId: undefined,
}
const setMasterObject = (type = {}) => {
  return type?._id ? { value: type?._id, label: type?.name, code: type?.code } : undefined
}
// eslint-disable-next-line sonarjs/cognitive-complexity
const AddNotificationForm = ({ getList, open, setOpen, editId, setEditId, limit, offset, isAllow = () => {} }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onTouched",
    defaultValues,
    resolver: yupResolver(notificationSchema),
  })
  const closeModal = () => {
    setEditId()
    setOpen(false)
  }
  const { onSubmit, onSaveAndSend } = useAddNotification({
    open,
    setOpen,
    editId,
    setEditId,
    getList,
    limit,
    offset,
  })

  useEffect(() => {
    // eslint-disable-next-line no-restricted-syntax
    if (open) {
      reset({ ...defaultValues })
    }
  }, [open])
  useEffect(() => {
    if (editId && open) {
      setValue("nm", editId.nm)
      setValue("desc", editId.desc)
      setValue("isShowList", editId.isShowList)
      setValue("title", editId.title)
      setValue("startDt", editId.startDt ? new Date(editId.startDt) : undefined)
      setValue("startTime", editId.startDt ? `${dayjs(editId.startDt).format("HH:mm")}` : "00:00")
      setValue("endDt", editId.endDt ? new Date(editId.endDt) : undefined)
      setValue("endTime", editId.endDt ? `${dayjs(editId.endDt).format("HH:mm")}` : "00:00")
      setValue("typeId", setMasterObject(editId.typeId))
      setValue("imgId", editId.imgId)
      setValue("criteriaId", setMasterObject(editId.criteriaId))
      setValue("userTypeId", setMasterObject(editId.userTypeId))
      setValue(
        "categories",
        editId.categories.map((a) => ({ value: a?._id, label: a?.name })),
        { shouldValidate: true }
      )
      setValue(
        "courses",
        editId.courses.map((a) => ({ value: a?._id, label: a?.title })),
        { shouldValidate: true }
      )
      setValue(
        "pages",
        editId.pages.map((a) => ({ value: a?._id, label: a?.name })),
        { shouldValidate: true }
      )
      setValue(
        "users",
        editId.users.map((a) => ({ value: a._id, label: a.name })),
        { shouldValidate: true }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId])

  return (
    <DrawerWrapper
      title={editId ? "Update Notification" : "Add Notification"}
      onClick={handleSubmit(onSubmit)}
      modalFooter={
        <>
          <Button
            onClick={() => closeModal()}
            title="Close"
            kind="dark-gray"
            hoverKind="white"
            className="hover:border-primary"
          />
          <Button title={editId ? "Update Notification" : "Save Notification"} onClick={handleSubmit(onSubmit)} />{" "}
          {watch("typeId")?.code === NOTIFICATION_TYPE.GENERAL && isAllow(MODULE_ACTIONS.SEND) && (
            <Button
              title={editId ? "Update & Send Notification" : "Save & Send Notification"}
              onClick={handleSubmit(onSaveAndSend)}
            />
          )}
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-3">
        <Input
          label="Notification Name"
          placeholder="Enter Notification Name"
          rest={register("nm")}
          error={errors.nm?.message}
          mandatory
          className="capitalize"
        />
        <Input
          label="Notification Title"
          placeholder="Enter Notification Title"
          rest={register("title")}
          error={errors.title?.message}
          mandatory
        />
        <TextEditor
          label="Notification Description"
          placeholder="Enter Notification Description"
          rest={register("desc")}
          setValue={setValue}
          valueText="desc"
          valueData={watch("desc")}
          error={errors.desc?.message}
          mandatory
        />
        <MasterSelect
          placeholder="Search Notification Type"
          className="w-full"
          label="Notification Type"
          mandatory
          code={MASTER_CODES.notificationType}
          error={errors.typeId?.value?.message}
          showCode
          value={watch("typeId")?.value ? watch("typeId") : undefined}
          onChange={(opt) => {
            setValue("typeId", opt || {}, { shouldValidate: true })
            setValue("criteriaId", {})
            setValue("userTypeId", {})
            setValue("categories", [])
            setValue("courses", [])
            setValue("pages", [])
            setValue("users", [])
            setValue("startDt")
            setValue("endDt")
          }}
        />
        {watch("typeId")?.code === NOTIFICATION_TYPE.GENERAL && (
          <Upload
            label="Upload Image"
            selectedImg={watch("imgId")}
            setImg={(data) => setValue("imgId", data)}
            resolution="400px/100px"
          />
        )}
        {watch("typeId")?.code === NOTIFICATION_TYPE.GENERAL && (
          <Checkbox rest={register("isShowList")} title="Show in Notification List" className="py-2" id="isShowList" />
        )}
        {watch("typeId")?.code === NOTIFICATION_TYPE.FLOATING && (
          <DateTimeRangeInput
            startDate={watch("startDt")}
            endDate={watch("endDt")}
            mandatory
            setStartDate={(value) => setValue("startDt", value || "", { shouldValidate: true })}
            setStartTime={(value) => setValue("startTime", value || "", { shouldValidate: true })}
            setEndDate={(value) => setValue("endDt", value || "", { shouldValidate: true })}
            setEndTime={(value) => setValue("endTime", value || "", { shouldValidate: true })}
            label="Select Date"
            startError={errors.startDt?.message}
            endError={errors.endDt?.message}
            minDate={new Date()}
            startTime={watch("startTime")}
            endTime={watch("endTime")}
          />
        )}
        {watch("typeId")?.code === NOTIFICATION_TYPE.GENERAL && (
          <MasterSelect
            label="Criteria Type"
            placeholder="Select Criteria Type"
            className="w-full"
            mandatory
            code={MASTER_CODES.GENERAL_NOTIFICATION_CRITERIA}
            error={errors.criteriaId?.value?.message}
            showCode
            value={watch("criteriaId")?.value ? watch("criteriaId") : undefined}
            onChange={(opt) => {
              setValue("criteriaId", opt || {}, { shouldValidate: true })
              setValue("categories", [])
              setValue("courses", [])
              setValue("pages", [])
              setValue("users", [])
              setValue("userTypeId", {})
            }}
          />
        )}
        {watch("typeId")?.code === NOTIFICATION_TYPE.FLOATING && (
          <MasterSelect
            label="User Type"
            placeholder="Select User Type"
            className="w-full"
            mandatory
            code={MASTER_CODES.USER_TYPE}
            error={errors.userTypeId?.value?.message}
            showCode
            value={watch("userTypeId")?.value ? watch("userTypeId") : undefined}
            onChange={(opt) => {
              setValue("userTypeId", opt || {}, { shouldValidate: true })
              setValue("users", [])
            }}
          />
        )}
        {watch("userTypeId")?.code === NOTIFICATION_USER_TYPES.LOGGED_USER && (
          <FilterSelectDropdown
            action="list"
            module="lerner"
            label="User"
            placeholder="Search User"
            onChange={(opt) => {
              setValue("users", opt, { shouldValidate: true })
            }}
            value={watch("users")}
            isClearable
            error={errors.users?.message}
            isMulti
            isSearch
          />
        )}
        {watch("typeId")?.code === NOTIFICATION_TYPE.FLOATING && (
          <MasterSelect
            label="Criteria Type"
            placeholder="Select Criteria Type"
            className="w-full"
            mandatory
            code={MASTER_CODES.FLOATING_NOTIFICATION_CRITERIA}
            error={errors.criteriaId?.value?.message}
            showCode
            value={watch("criteriaId")?.value ? watch("criteriaId") : undefined}
            onChange={(opt) => {
              setValue("criteriaId", opt || {}, { shouldValidate: true })
              setValue("categories", [])
              setValue("courses", [])
              setValue("pages", [])
            }}
          />
        )}
        {watch("typeId")?.code === NOTIFICATION_TYPE.GENERAL &&
          watch("criteriaId")?.code &&
          watch("criteriaId")?.code !== CRITERIA_TYPE.ALL &&
          (watch("criteriaId")?.code === CRITERIA_TYPE.SELECTED_USER ? (
            <FilterSelectDropdown
              action="list"
              module="lerner"
              label="User"
              placeholder="Search User"
              onChange={(opt) => {
                setValue("users", opt, { shouldValidate: true })
              }}
              value={watch("users")}
              isClearable
              mandatory
              error={errors.users?.message}
              isMulti
              isSearch
            />
          ) : (
            <>
              <FilterSelectDropdown
                mandatory
                action="add"
                module="courses"
                searchColumns={["title"]}
                label="Course"
                placeholder="Search Course"
                onChange={(opt) => {
                  setValue("courses", opt, { shouldValidate: true })
                }}
                labelColumn="title"
                value={watch("courses")}
                isClearable
                isMulti
                isSearch
                query={{ isActive: true, sts: COURSE_TYPE.PUBLISHED }}
                error={errors.courses?.message}
                isDisabled={watch("categories")?.length}
              />
              <Divider title="Or" className="mt-2" />
              <FilterSelectDropdown
                action="list" // action - list
                module="category"
                label="Program"
                placeholder="Search Program"
                onChange={(opt) => {
                  setValue("categories", opt, { shouldValidate: true })
                }}
                value={watch("categories")}
                isClearable
                isMulti
                mandatory
                isSearch
                error={errors.categories?.message}
                isDisabled={watch("courses")?.length}
              />
            </>
          ))}
        {watch("criteriaId")?.code === CRITERIA_TYPE.PAGES && (
          <FilterSelectDropdown
            action="add"
            module="pages"
            label="Page"
            placeholder="Search Page"
            onChange={(opt) => {
              setValue("pages", opt, { shouldValidate: true })
            }}
            value={watch("pages")}
            isClearable
            mandatory
            error={errors.pages?.message}
            isMulti
            isSearch
          />
        )}
        {watch("criteriaId")?.code === CRITERIA_TYPE.CATEGORIES && (
          <FilterSelectDropdown
            action="list" // action - list
            module="category"
            label="Program"
            placeholder="Search Program"
            onChange={(opt) => {
              setValue("categories", opt, { shouldValidate: true })
            }}
            value={watch("categories")}
            isClearable
            isMulti
            mandatory
            isSearch
            error={errors.categories?.message}
          />
        )}
        {watch("criteriaId")?.code === CRITERIA_TYPE.COURSES && (
          <FilterSelectDropdown
            mandatory
            action="add"
            module="courses"
            searchColumns={["title"]}
            label="Course"
            placeholder="Search Course"
            onChange={(opt) => {
              setValue("courses", opt, { shouldValidate: true })
            }}
            labelColumn="title"
            value={watch("courses")}
            isClearable
            isMulti
            isSearch
            query={{ isActive: true, sts: COURSE_TYPE.PUBLISHED }}
            error={errors.courses?.message}
          />
        )}
      </div>
    </DrawerWrapper>
  )
}

export default AddNotificationForm
