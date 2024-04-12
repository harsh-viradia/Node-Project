/* eslint-disable no-use-before-define */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import DrawerWrapper from "shared/drawer"
import { COUPON_CRITERIA, COUPON_TYPE_NAME, COURSE_TYPE, MASTER_CODES } from "utils/constant"
import { capitalizeFirstLetter } from "utils/util"
import Button from "widgets/button"
import DateInput from "widgets/dateInput"
import Divider from "widgets/divider"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"
import Input from "widgets/input"
import MasterSelect from "widgets/masterSelect"
import TextEditor from "widgets/textEditor"
import * as yup from "yup"

import useSyncCoupon from "./hooks/useSyncCoupon"

const { object, string, array } = yup

const defaultValues = {
  id: undefined,
  name: undefined,
  typeId: undefined,
  typeNm: undefined,
  code: undefined,
  appliedDate: undefined,
  expireDate: undefined,
  totalUse: undefined,
  totalPurchase: undefined,
  users: undefined,
  details: undefined,
  criteriaId: undefined,
  criteriaNm: undefined,
  buyCourses: undefined,
  getCourses: undefined,
  buyCategories: undefined,
  getCategories: undefined,
  discountAmount: undefined,
  discountPercentage: undefined,
}

const AddCouponForm = ({ open, setOpen, title = "Add Coupon", getList, data, pagination, permission }) => {
  const [couponType, setCouponType] = useState()
  const [criteria, setCriteria] = useState()
  const [buyCategory, setBuyCategory] = useState()
  const [buyCourse, setBuyCourse] = useState()
  const [getCategory, setGetCategory] = useState()
  const [getCourse, setGetCourse] = useState()
  const [oldCouponCode, setOldCouponCode] = useState()

  const couponSchema = object().shape({
    name: string().required("Please enter coupon name."),
    typeId: string().required("Please select type."),
    code: string().required("Please enter code."),
    appliedDate: string().required("Please select applied from."),
    expireDate: string().required("Please enter expired on."),
    criteriaId: string().required("Please select criteria."),
    totalUse: yup.number().when("totalPurchase", {
      is: (totalPurchase) => totalPurchase,
      then: yup
        .number()
        .min(yup.ref("totalPurchase"), "No of use should be greater than no of purchase.")
        .typeError("Please enter no of use.")
        .required("Please enter no of use."),
      otherwise: yup
        .number()
        .min(1, "Enter valid no of use.")
        .typeError("Please enter no of use.")
        .required("Please enter no of use."),
    }),

    totalPurchase: yup
      .number()
      .max(yup.ref("totalUse"), "No of purchase should be smaller than no of use.")
      .min(1, "Enter valid no of purchase.")
      .nullable(true)
      .transform((value) => (value === Number(value) ? value : undefined)),
    buyCourses:
      (couponType === COUPON_TYPE_NAME.FLAT_DISCOUNT || couponType === COUPON_TYPE_NAME.PERCENTAGE_DISCOUNT) &&
      criteria === COUPON_CRITERIA.COURSES
        ? array().min(1, "Please select course.").required("Please select course.")
        : couponType === COUPON_TYPE_NAME.BUY_X_GET_X &&
          (criteria === COUPON_CRITERIA.COURSES || criteria === COUPON_CRITERIA.COUPON_CRITERIA_ALL) &&
          !buyCategory?.length
        ? array().min(1, "Please select course.").required("Please select course.")
        : array().notRequired(),
    buyCategories:
      (couponType === COUPON_TYPE_NAME.FLAT_DISCOUNT || couponType === COUPON_TYPE_NAME.PERCENTAGE_DISCOUNT) &&
      criteria === COUPON_CRITERIA.CATEGORIES
        ? array().min(1, "Please select program.").required("Please select program.")
        : couponType === COUPON_TYPE_NAME.BUY_X_GET_X &&
          (criteria === COUPON_CRITERIA.COURSES || criteria === COUPON_CRITERIA.COUPON_CRITERIA_ALL) &&
          !buyCourse?.length
        ? array().min(1, "Please select program.").required("Please select program.")
        : array().notRequired(),
    getCourses:
      couponType === COUPON_TYPE_NAME.BUY_X_GET_X && !getCategory?.length
        ? array().min(1, "Please select course.").required("Please select course.")
        : array().notRequired(),
    getCategories:
      couponType === COUPON_TYPE_NAME.BUY_X_GET_X && !getCourse?.length
        ? array().min(1, "Please select program.").required("Please select program.")
        : array().notRequired(),
    discountAmount:
      couponType === COUPON_TYPE_NAME.FLAT_DISCOUNT
        ? string().required("Please enter discount.")
        : string().notRequired(),
    discountPercentage:
      couponType === COUPON_TYPE_NAME.PERCENTAGE_DISCOUNT
        ? string().required("Please enter discount.")
        : string().notRequired(),
  })

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    clearErrors,
    setError,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(couponSchema),
  })
  useEffect(() => {
    if (watch("totalPurchase") && watch("totalUse")) {
      setValue("totalPurchase", watch("totalPurchase"), { shouldValidate: true })
      setValue("totalUse", watch("totalUse"), { shouldValidate: true })
    }
  }, [watch("totalPurchase"), watch("totalUse")])
  const { onSubmit, loading } = useSyncCoupon({
    setOpen,
    getList,
    reset,
    defaultValues,
    pagination,
    couponType,
    oldCouponCode,
  })

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
  }

  useEffect(() => {
    reset({ ...defaultValues })
    if (open && data) {
      setValue("id", data?._id)
      setValue("name", data?.name)
      setValue("typeId", data?.typeId?._id)
      setValue("typeNm", data?.typeId?.name)
      setValue("code", data?.code)
      setOldCouponCode(data?.code)
      setCouponType(data?.typeId?.code)
      setValue("appliedDate", data?.appliedDate ? new Date(data.appliedDate.split("T")[0]) : undefined)
      setValue("expireDate", data?.expireDate ? new Date(data.expireDate.split("T")[0]) : undefined)
      setValue("totalUse", data?.totalUse >= 0 ? data.totalUse : undefined)
      setValue("totalPurchase", data?.totalPurchase)
      setValue("details", data?.details)
      setValue("criteriaId", data?.criteriaId?._id)
      setValue("criteriaNm", data?.criteriaId?.name)
      setCriteria(data?.criteriaId?.code)
      if (data?.users?.length) {
        setValue(
          "users",
          data?.users?.map((x) => {
            return {
              label: x?.name,
              value: x?._id,
            }
          })
        )
      }
      if (data?.buyCourses?.length) {
        const buyCou = data?.buyCourses?.map((x) => {
          return {
            label: x?.title,
            value: x?._id,
          }
        })
        setValue("buyCourses", buyCou)
        setBuyCourse(buyCou)
      }
      if (data?.getCourses?.length) {
        const getCou = data?.getCourses?.map((x) => {
          return {
            label: x?.title,
            value: x?._id,
          }
        })
        setGetCourse(getCou)
        setValue("getCourses", getCou)
      }
      if (data?.buyCategories?.length) {
        const buyCat = data?.buyCategories?.map((x) => {
          return {
            label: x?.name,
            value: x?._id,
          }
        })
        setBuyCategory(buyCat)
        setValue("buyCategories", buyCat)
      }
      if (data?.getCategories?.length) {
        const getCat = data?.getCategories?.map((x) => {
          return {
            label: x?.name,
            value: x?._id,
          }
        })
        setGetCategory(getCat)
        setValue("getCategories", getCat)
      }
      setValue("discountAmount", data?.discountAmount || undefined)
      setValue("discountPercentage", data?.discountPercentage || undefined)
    }
  }, [open])

  const closeModal = () => {
    setOpen(false)
    setCouponType()
    setCriteria()
    setBuyCategory()
    setBuyCourse()
    setGetCategory()
    setGetCourse()
    setOldCouponCode()
  }

  const clearCriteriaValues = () => {
    setValue("buyCourses")
    setValue("getCourses")
    setValue("buyCategories")
    setValue("getCategories")
    clearErrors("buyCourses")
    clearErrors("getCourses")
    clearErrors("buyCategories")
    clearErrors("getCategories")
    setBuyCategory()
    setBuyCourse()
    setGetCategory()
    setGetCourse()
  }
  return (
    <DrawerWrapper
      title={title}
      modalFooter={
        <>
          <Button
            onClick={() => closeModal()}
            title="Close"
            kind="dark-gray"
            hoverKind="white"
            className="hover:border-primary"
          />
          <Button title={title} onClick={handleSubmit(onSubmit)} loading={loading} />
        </>
      }
      open={open}
      setOpen={closeModal}
      width="max-w-6xl"
    >
      <div className="grid w-full grid-cols-2 gap-4">
        <div className="grid items-start grid-cols-2 gap-3">
          <Input
            label="Coupon Name"
            placeholder="Enter Coupon Name"
            mandatory
            rest={register("name", {
              onChange: (event) => {
                setValue("name", capitalizeFirstLetter(event.target.value))
              },
            })}
            error={errors?.name?.message}
            disabled={loading}
            onKeyDown={(event) => onKeyDown(event)}
          />
          <MasterSelect
            showCode
            isDisabled={loading}
            placeholder="Choose Coupon Type"
            className="w-full"
            label="Coupon Type"
            mandatory
            id="typeId"
            code={MASTER_CODES.couponType}
            rest={register("typeId")}
            error={errors.typeId?.message}
            value={watch("typeId") ? { label: watch("typeNm"), value: watch("typeId") } : undefined}
            onChange={(opt) => {
              if (watch("typeId") !== opt?.value) {
                setValue("typeId", opt?.value || "", { shouldValidate: true })
                setValue("typeNm", opt?.label)
                setCouponType(opt?.code)
                setCriteria()
                setValue("criteriaId")
                setValue("criteriaNm")
                setValue("discountAmount")
                setValue("discountPercentage")
                clearErrors("criteriaId")
                clearErrors("criteriaNm")
                clearErrors("discountAmount")
                clearErrors("discountPercentage")
                clearCriteriaValues()
              }
            }}
            onKeyDown={(event) => onKeyDown(event)}
            isSearch={false}
            isClearable={false}
          />
          <Input
            label="Coupon Code"
            placeholder="Enter Coupon Code"
            mandatory
            rest={register("code", {
              onChange: (event) => {
                setValue("code", event.target.value?.replaceAll(/\W+/g, "").toUpperCase())
              },
            })}
            error={errors?.code?.message}
            disabled={loading || watch("id")}
            onKeyDown={(event) => onKeyDown(event)}
          />
          <DateInput
            label="Applied from"
            mandatory
            date={watch("appliedDate")}
            disabled={loading}
            setDate={(value) => setValue("appliedDate", value, { shouldValidate: true })}
            error={errors?.appliedDate?.message}
            minDate={new Date()}
          />
          <DateInput
            label="Expired On"
            mandatory
            date={watch("expireDate")}
            setDate={(value) => setValue("expireDate", value, { shouldValidate: true })}
            disabled={loading}
            error={errors?.expireDate?.message}
            minDate={new Date()}
          />
          <Input
            label="No of Use"
            placeholder="Enter No of Use"
            mandatory
            rest={register("totalUse")}
            type="number"
            error={errors?.totalUse?.message}
            disabled={loading}
            onKeyDown={(event) => onKeyDown(event)}
          />
          <Input
            label="No of Purchase"
            placeholder="Enter of Purchase"
            rest={register("totalPurchase")}
            type="number"
            error={errors?.totalPurchase?.message}
            disabled={loading}
            onKeyDown={(event) => onKeyDown(event)}
          />
          <div className="col-span-2">
            <FilterSelectDropdown
              action="list"
              module="lerner"
              label="Select Specific Learner"
              placeholder="Search Learner"
              onChange={(opt) => {
                setValue("users", opt, { shouldValidate: true })
              }}
              value={watch("users")}
              isClearable
              isMulti
              isSearch
              query={{ isActive: true }}
              isDisabled={loading}
            />
          </div>
          <div className="col-span-2">
            <TextEditor
              label="Discount Details"
              placeholder="Enter discount details"
              setValue={setValue}
              valueText="details"
              rest={register("details")}
              valueData={getValues("details")}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {couponType === COUPON_TYPE_NAME.PERCENTAGE_DISCOUNT && (
            <Input
              label="Max Percentage(%) Purchase"
              placeholder="Enter Discount Percentage(%)"
              mandatory
              maxLength="3"
              rest={register("discountPercentage", {
                onChange: (event) => {
                  event.target.value = event.target.value?.replaceAll(/\D/gi, "")
                  if (event.target.value && Number(event.target.value) <= 100) {
                    setValue("discountPercentage", event.target.value)
                  } else if (!event.target.value) {
                    setValue("discountPercentage", "")
                  } else {
                    setValue(
                      "discountPercentage",
                      event.target.value.slice(0, Math.max(0, event.target.value.length - 1))
                    )
                  }
                },
              })}
              error={errors?.discountPercentage?.message}
              disabled={loading}
              onKeyDown={(event) => onKeyDown(event)}
            />
          )}
          {couponType === COUPON_TYPE_NAME.FLAT_DISCOUNT && (
            <Input
              label="Max Flat Discount"
              placeholder="Enter Discount Amount"
              mandatory
              rest={register("discountAmount", {
                onChange: (event) => {
                  setValue("discountAmount", event.target.value.replaceAll(/\D/gi, ""))
                },
              })}
              error={errors?.discountAmount?.message}
              disabled={loading}
              onKeyDown={(event) => onKeyDown(event)}
            />
          )}
          {couponType && (
            <MasterSelect
              showCode
              isDisabled={loading}
              placeholder="Choose Coupon Criteria"
              className="w-full"
              label="Coupon Criteria"
              mandatory
              id="criteriaId"
              code={MASTER_CODES.couponCriteria}
              rest={register("criteriaId")}
              error={errors.criteriaId?.message}
              value={
                watch("typeId")
                  ? watch("criteriaId")
                    ? { label: watch("criteriaNm"), value: watch("criteriaId") }
                    : ""
                  : ""
              }
              onChange={(opt) => {
                if (watch("criteriaId") !== opt?.value) {
                  setValue("criteriaId", opt?.value || "", { shouldValidate: true })
                  setValue("criteriaNm", opt?.label)
                  setCriteria(opt?.code)
                  clearCriteriaValues()
                }
              }}
              onKeyDown={(event) => onKeyDown(event)}
              isSearch={false}
              isClearable={false}
            />
          )}
          {couponType === COUPON_TYPE_NAME.BUY_X_GET_X && (
            <div>
              {criteria && (
                <div>
                  <h2 className="pb-1 text-base font-bold">Learner Buy</h2>
                  <div className="grid gap-1 p-2 border rounded">
                    {(criteria === COUPON_CRITERIA.CATEGORIES || criteria === COUPON_CRITERIA.COUPON_CRITERIA_ALL) && (
                      <FilterSelectDropdown
                        action="list"
                        module="category"
                        label="Program"
                        placeholder="Search Program"
                        onChange={(opt) => {
                          setValue("buyCategories", opt, { shouldValidate: true })
                          setBuyCategory(opt)
                          clearErrors("buyCourses")
                        }}
                        value={watch("buyCategories")}
                        isClearable
                        isMulti
                        mandatory
                        isSearch
                        error={errors.buyCategories?.message}
                        isDisabled={watch("buyCourses")?.length || loading}
                      />
                    )}
                    {criteria === COUPON_CRITERIA.COUPON_CRITERIA_ALL && <Divider title="OR" />}
                    {(criteria === COUPON_CRITERIA.COURSES || criteria === COUPON_CRITERIA.COUPON_CRITERIA_ALL) && (
                      <FilterSelectDropdown
                        mandatory
                        action="add"
                        module="courses"
                        searchColumns={["title"]}
                        label="Course"
                        placeholder="Search Course"
                        onChange={(opt) => {
                          setValue("buyCourses", opt, { shouldValidate: true })
                          setBuyCourse(opt)
                          clearErrors("buyCategories")
                        }}
                        labelColumn="title"
                        value={watch("buyCourses")}
                        isClearable
                        isMulti
                        isSearch
                        query={{ isActive: true, sts: COURSE_TYPE.PUBLISHED }}
                        error={errors.buyCourses?.message}
                        isDisabled={watch("buyCategories")?.length || loading}
                      />
                    )}
                  </div>
                </div>
              )}
              {criteria && (
                <div>
                  <h2 className="py-1 text-base font-bold">Learner Get</h2>
                  <div className="grid gap-1 p-2 border rounded">
                    {(criteria === COUPON_CRITERIA.CATEGORIES || criteria === COUPON_CRITERIA.COUPON_CRITERIA_ALL) && (
                      <FilterSelectDropdown
                        action="list"
                        module="category"
                        label="Program"
                        placeholder="Search Program"
                        onChange={(opt) => {
                          setValue("getCategories", opt, { shouldValidate: true })
                          setGetCategory(opt)
                        }}
                        value={watch("getCategories")}
                        isClearable
                        isMulti
                        mandatory
                        isSearch
                        error={errors.getCategories?.message}
                        isDisabled={watch("getCourses")?.length || loading}
                      />
                    )}
                    {criteria === COUPON_CRITERIA.COUPON_CRITERIA_ALL && <Divider title="OR" />}
                    {(criteria === COUPON_CRITERIA.COURSES || criteria === COUPON_CRITERIA.COUPON_CRITERIA_ALL) && (
                      <FilterSelectDropdown
                        mandatory
                        action="add"
                        module="courses"
                        searchColumns={["title"]}
                        label="Course"
                        placeholder="Search Course"
                        onChange={(opt) => {
                          setValue("getCourses", opt, { shouldValidate: true })
                          setGetCourse(opt)
                        }}
                        labelColumn="title"
                        value={watch("getCourses")}
                        isClearable
                        isMulti
                        isSearch
                        query={{ isActive: true, sts: COURSE_TYPE.PUBLISHED }}
                        error={errors.getCourses?.message}
                        isDisabled={watch("getCategories")?.length || loading}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {couponType === COUPON_TYPE_NAME.FLAT_DISCOUNT && (
            <div>
              {criteria === COUPON_CRITERIA.CATEGORIES && (
                <FilterSelectDropdown
                  action="list"
                  module="category"
                  label="Program"
                  placeholder="Search Program"
                  onChange={(opt) => {
                    setValue("buyCategories", opt, { shouldValidate: true })
                  }}
                  value={watch("buyCategories")}
                  isClearable
                  isMulti
                  mandatory
                  isSearch
                  error={errors.buyCategories?.message}
                  isDisabled={watch("buyCourses")?.length || loading}
                />
              )}
              {criteria === COUPON_CRITERIA.COURSES && (
                <FilterSelectDropdown
                  mandatory
                  action="add"
                  module="courses"
                  searchColumns={["title"]}
                  label="Course"
                  placeholder="Search Course"
                  onChange={(opt) => {
                    setValue("buyCourses", opt, { shouldValidate: true })
                  }}
                  labelColumn="title"
                  value={watch("buyCourses")}
                  isClearable
                  isMulti
                  isSearch
                  query={{ isActive: true, sts: COURSE_TYPE.PUBLISHED }}
                  error={errors.buyCourses?.message}
                  isDisabled={watch("buyCategories")?.length || loading}
                />
              )}
            </div>
          )}
          {couponType === COUPON_TYPE_NAME.PERCENTAGE_DISCOUNT && (
            <div>
              {criteria === COUPON_CRITERIA.CATEGORIES && (
                <FilterSelectDropdown
                  action="list"
                  module="category"
                  label="Program"
                  placeholder="Search Program"
                  onChange={(opt) => {
                    setValue("buyCategories", opt, { shouldValidate: true })
                  }}
                  value={watch("buyCategories")}
                  isClearable
                  isMulti
                  mandatory
                  isSearch
                  error={errors.buyCategories?.message}
                  isDisabled={watch("buyCourses")?.length || loading}
                />
              )}
              {criteria === COUPON_CRITERIA.COURSES && (
                <FilterSelectDropdown
                  mandatory
                  action="add"
                  module="courses"
                  searchColumns={["title"]}
                  label="Course"
                  placeholder="Search Course"
                  onChange={(opt) => {
                    setValue("buyCourses", opt, { shouldValidate: true })
                  }}
                  labelColumn="title"
                  value={watch("buyCourses")}
                  isClearable
                  isMulti
                  isSearch
                  query={{ isActive: true, sts: COURSE_TYPE.PUBLISHED }}
                  error={errors.buyCourses?.message}
                  isDisabled={watch("buyCategories")?.length || loading}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </DrawerWrapper>
  )
}

export default AddCouponForm
