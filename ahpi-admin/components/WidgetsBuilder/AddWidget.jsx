/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { yupResolver } from "@hookform/resolvers/yup"
import useAddWidget from "hook/widget/useAddwidget"
import AddIcon from "icons/addIcon"
import BackIcon from "icons/backIcon"
import DeleteIcon from "icons/deleteIcon"
import Router, { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { useFieldArray, useForm } from "react-hook-form"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import ReactTooltip from "react-tooltip"
import { widgetSchema } from "schema/master"
import ConfirmPopOver from "shared/actions/confirmPopover"
import LayoutWrapper from "shared/layout/wrapper"
import { CODE_REGEX, CODE_REPLACE_REGEX, MASTER_CODES, SPACE_REMOVE_REGEX } from "utils/constant"
import routes from "utils/routes"
import { reorder } from "utils/util"
import Button from "widgets/button"
import CategoryCard from "widgets/Cards/categoryCard"
import CourseCard from "widgets/Cards/courseCard"
import ReviewCard from "widgets/Cards/reviewCard"
import Divider from "widgets/divider"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"
import OrbitLoader from "widgets/loader"
import MasterSelect from "widgets/masterSelect"
import OrbitLink from "widgets/orbitLink"
import ToggleInputButton from "widgets/toggleInput"
import Upload from "widgets/upload"

const WIDGET_TYPE_KEYS = {
  IMAGE: "IMAGE",
  CATEGORY: "CATEGORY",
  COURSE: "COURSE",
  REVIEWS: "REVIEWS",
}
const SEC_TYPE_KEYS = {
  FIX_CARD: "FIXED_CARD",
  CAROUSEL: "CAROUSEL",
  TAB: "TAB",
}

const defaultValues = {
  name: "",
  code: "",
  headingTitle: "",
  // headingTitleID: "",
  rowPerMobile: "",
  rowPerWeb: "",
  rowPerTablet: "",
  isAutoPlay: false,
  type: "",
  secType: "",
  imgType: "",
  img: [
    {
      title: "",
      // titleID: "",
      alt: "",
      // altID: "",
      link: "",
      fileId: "",
      // fileIdIndo: "",
    },
  ],
  isAlgorithmBase: false,
  category: "",
  tabs: [],
  reviews: "",
}
// eslint-disable-next-line sonarjs/cognitive-complexity
const AddWidget = ({ permission = {}, user = {} }) => {
  const { query } = useRouter()
  const { id } = query
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(widgetSchema),
  })
  const { fields, append, remove } = useFieldArray({ name: "img", control })
  const watchImage = watch("img")
  const { fields: tabFields, append: appendField, remove: removeField } = useFieldArray({ name: "tabs", control })
  const watchTabs = watch("tabs")
  const [courseList, setCourseList] = useState()
  const [reviewList, setReviewList] = useState()
  const [widgetType, setWidgetType] = useState()
  const [secType, setsecType] = useState()
  const [algorithmBased, setAlgorithmBased] = useState(false)
  const [imgType, setImageType] = useState()
  const [cardType, setCardType] = useState()
  const [category, setCategory] = useState([])
  const [activeTab, setActiveTab] = useState(0)

  const onCategoryDragEnd = (result) => {
    if (!result.destination) return
    const items = reorder(category, result.source.index, result.destination.index)
    setCategory(items)
  }
  const onCourseDragEnd = (result) => {
    if (!result.destination) return
    const items = reorder(courseList, result.source.index, result.destination.index)
    setCourseList(items)
  }
  const onReviewDragEnd = (result) => {
    if (!result.destination) return
    const items = reorder(reviewList, result.source.index, result.destination.index)
    setReviewList(items)
  }
  useEffect(() => {
    if (widgetType?.code === WIDGET_TYPE_KEYS.REVIEWS && secType?.code !== SEC_TYPE_KEYS.CAROUSEL) {
      setsecType("")
      setValue("secType", "")
    }
    if (widgetType?.code === WIDGET_TYPE_KEYS.CATEGORY && secType?.code === SEC_TYPE_KEYS.TAB) {
      setsecType("")
      setValue("secType", "")
    }
    if (widgetType?.code === WIDGET_TYPE_KEYS.CATEGORY && cardType?.code === "BIG") {
      setCardType("")
      setValue("cardType", "")
    }
    if (widgetType?.code === WIDGET_TYPE_KEYS.IMAGE) {
      if (secType?.code === SEC_TYPE_KEYS.TAB) {
        setsecType("")
        setValue("secType", "")
      }
      if (watchImage.length === 0) {
        append({
          title: "",
          alt: "",
          link: "",
          fileId: "",
          // fileIdIndo: "",
          editable: !id,
        })
      }
    } else remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetType])
  useEffect(() => {
    if (widgetType?.code === WIDGET_TYPE_KEYS.IMAGE && secType?.code !== SEC_TYPE_KEYS.TAB) {
      setImageType("")
      setValue("imgType", "")
    }
    if (secType?.code === SEC_TYPE_KEYS.TAB) {
      setActiveTab(0)
      if (watchTabs.length === 0) {
        appendField({
          name: "",
          course: [],
          categories: [],
        })
      }
    } else removeField()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secType])
  const addImage = () => {
    append({
      title: "",
      alt: "",
      link: "",
      fileId: "",
      // fileIdIndo: "",
      editable: !id,
    })
  }
  const addTab = () => {
    appendField({
      name: "",
      course: [],
      categories: [],
    })
  }
  const removeCategory = (id) => {
    const catA = category.filter((a) => a.value !== id)
    setCategory(catA)
    setValue("category", catA?.length ? catA[0].value : "", { shouldValidate: true })
  }
  const removeCourse = (id) => {
    const catA = courseList.filter((a) => a.value !== id)
    setCourseList(catA)
    setValue("course", catA?.length ? catA[0].value : "", { shouldValidate: true })
  }
  const removeReview = (id) => {
    const catA = reviewList.filter((a) => a.value !== id)
    setReviewList(catA)
    setValue("reviews", catA?.length ? catA[0].value : "", { shouldValidate: true })
  }
  const setEditValues = (values = {}) => {
    setValue("code", values.code)
    setValue("name", values.name)
    setValue("headingTitle", values.headingTitle)
    // setValue("headingTitleID", values.headingTitleID)
    setValue("rowPerMobile", values.rowPerMobile)
    setValue("rowPerWeb", values.rowPerWeb)
    setValue("rowPerTablet", values.rowPerTablet)
    setValue("isAutoPlay", values.isAutoPlay)
    setValue("type", values.type?.code)
    setValue("secType", values.secType?.code || "")
    setsecType({ value: values.secType?._id, label: values.secType?.name, code: values.secType?.code })
    setValue("imgType", values.imgType?._id || "")
    setImageType({ value: values.imgType?._id, label: values.imgType?.name, code: values.imgType?.code })
    setValue(
      "img",
      values.img?.map(
        ({
          alt,
          fileId,
          link,
          title,
          altID,
          titleID,
          // fileIdIndo
        }) => ({
          alt,
          altID,
          titleID,
          link,
          title,
          fileUri: { id: fileId?._id, uri: fileId?.uri },
          // fileUriID: { id: fileIdIndo?._id, uri: fileIdIndo?.uri },
          fileId: fileId?._id,
          // fileIdIndo: fileIdIndo?._id,
          editable: false,
        })
      )
    )
    setValue("isAlgorithmBase", values.tabs?.[0]?.isAlgorithmBase)
    setAlgorithmBased(values.tabs?.[0]?.isAlgorithmBase)
    setValue("cardType", values.tabs?.[0]?.cardType?._id || "")
    setCardType({
      value: values.tabs?.[0]?.cardType?._id,
      label: values.tabs?.[0]?.cardType?.name,
      code: values.tabs?.[0]?.cardType?.code,
    })
    setValue("category", values.tabs?.[0]?.categories?.[0]?.name)
    setCategory(values.tabs?.[0]?.categories?.map((a) => ({ ...a, value: a._id, label: a.name })))
    setValue("course", values.tabs?.[0]?.course?.[0]?.title || "")
    setCourseList(values.tabs?.[0]?.course.map((a) => ({ ...a, value: a._id, label: a.title })))
    if (values.secType?.code === "TAB") {
      setValue(
        "tabs",
        values.tabs?.map(({ name, categories, course }) => ({
          name,
          categories: categories?.map((a) => ({ ...a, value: a._id, label: a.name })),
          course: course?.map((a) => ({ ...a, value: a._id, label: a.title })),
          courseData: categories?.[0]?._id || course?.[0]?._id,
          categoryData: categories?.[0]?._id || course?.[0]?._id,
        }))
      )
    }
    setValue("reviews", values.reviews?.[0]?.fullName)
    setReviewList(values.reviews?.map((a) => ({ ...a, value: a._id, label: `${a.stars}⭐ - ${a.desc}` })))
    setWidgetType({ value: values.type?._id, label: values.type?.name, code: values.type?.code })
  }
  const {
    onSubmit,
    categoryOptions,
    getAllCategory,
    getAllCourses,
    courseOptions,
    reviewOptions,
    getAllReviews,
    getWidget,
    loading,
  } = useAddWidget({
    id,
    category,
    courseList,
    reviewList,
    setEditValues,
    secType,
    widgetType,
  })
  const resetForm = () => {
    Router.push(routes.widget)
    if (id) {
      getWidget()
      return
    }

    reset(defaultValues)
    setWidgetType("")
    setsecType("")
    setAlgorithmBased(false)
    setCategory([])
    setCourseList([])
    setReviewList([])
    setImageType("")
    setCardType("")
  }
  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title={
        <div className="flex items-center gap-2 font-bold">
          <OrbitLink href={routes.widget}>
            <BackIcon />
          </OrbitLink>
          <span>{id ? "Update Widget" : "Add Widget"}</span>
        </div>
      }
    >
      <div className="p-4 overflow-auto bg-white border rounded-lg border-thin-gray widgets-height">
        {loading && <OrbitLoader relative />}
        <div className="grid grid-cols-4 gap-4">
          <Input
            label="Widget Name"
            placeholder="Enter Name"
            mandatory
            rest={register("name")}
            error={errors.name?.message}
            className="capitalize"
          />
          <Input
            label="Section Title"
            placeholder="Enter Title"
            mandatory
            rest={register("headingTitle")}
            error={errors.headingTitle?.message}
            lowerCasePlaceholder
          />
          {/* <Input
            label="Section Title(id)"
            placeholder="Enter Title(id)"
            mandatory
            rest={register("headingTitleID")}
            error={errors.headingTitleID?.message}
            lowerCasePlaceholder
          /> */}
          <Input
            label="Code"
            error={errors.code?.message}
            placeholder="Enter Code"
            mandatory
            className="uppercase"
            disabled={!!id}
            info="Enter code in format of min length of 3 and must start with alphabet and only includes 'A-Z', '0-9' and '_' !"
            rest={register("code", {
              onChange: (event) => {
                let values = event?.target?.value?.toUpperCase()
                values = values.replace(SPACE_REMOVE_REGEX, "_")
                if (values && CODE_REGEX.test(values)) {
                  setValue("code", values)
                } else if (!values) {
                  setValue("code", "")
                } else {
                  setValue("code", values.replace(CODE_REPLACE_REGEX, ""))
                }
              },
            })}
          />
          <MasterSelect
            isSearch={false}
            showCode
            code={MASTER_CODES.widgetType}
            rest={register("type")}
            label="Widget Type"
            placeholder="Select Type"
            mandatory
            value={widgetType}
            isDisabled={!!id}
            onChange={(opt) => {
              setValue("type", opt?.code, { shouldValidate: true })
              setWidgetType(opt)
            }}
            error={errors.type?.message}
            isClearable
          />

          {widgetType?.code === WIDGET_TYPE_KEYS.COURSE && (
            <MasterSelect
              isSearch={false}
              showCode
              label="Section Type"
              code={MASTER_CODES.secType}
              rest={register("secType")}
              placeholder="Select Type"
              mandatory
              value={secType}
              onChange={(opt) => {
                setValue("secType", opt?.code, { shouldValidate: true })
                setsecType(opt)
              }}
              error={errors.secType?.message}
              isClearable
            />
          )}
          {widgetType?.code === WIDGET_TYPE_KEYS.REVIEWS && (
            <MasterSelect
              isSearch={false}
              showCode
              label="Section Type"
              code={MASTER_CODES.secType}
              rest={register("secType")}
              placeholder="Select Type"
              mandatory
              value={secType}
              onChange={(opt) => {
                setValue("secType", opt?.code, { shouldValidate: true })
                setsecType(opt)
              }}
              error={errors.secType?.message}
              showFilteredList
              filterCode={(a) => a.code === SEC_TYPE_KEYS.CAROUSEL}
              isClearable
            />
          )}
          {(widgetType?.code === WIDGET_TYPE_KEYS.IMAGE || widgetType?.code === WIDGET_TYPE_KEYS.CATEGORY) && (
            <MasterSelect
              isSearch={false}
              showCode
              label="Section Type"
              code={MASTER_CODES.secType}
              rest={register("secType")}
              placeholder="Select Type"
              mandatory
              value={secType}
              onChange={(opt) => {
                setValue("secType", opt?.code, { shouldValidate: true })
                setsecType(opt)
              }}
              error={errors.secType?.message}
              isClearable
              showFilteredList
              filterCode={(a) => a.code !== SEC_TYPE_KEYS.TAB}
              extraQuery={
                {
                  // code: { $nin: "TABS" },
                }
              }
            />
          )}
          <Input
            type="number"
            label="Web Per Row"
            placeholder="Enter Number"
            rest={register("rowPerWeb")}
            error={errors.rowPerWeb?.message}
            mandatory
          />
          <Input
            type="number"
            label="Tablet Per Row"
            placeholder="Enter Number"
            rest={register("rowPerTablet")}
            error={errors.rowPerTablet?.message}
            mandatory
          />
          <Input
            type="number"
            label="Mobile Per Row"
            placeholder="Enter Number"
            rest={register("rowPerMobile")}
            error={errors.rowPerMobile?.message}
            mandatory
          />
          {widgetType?.code === WIDGET_TYPE_KEYS.CATEGORY && secType?.code !== SEC_TYPE_KEYS.TAB && !algorithmBased && (
            <Dropdown
              label="Program"
              isMulti
              placeholder="Search Program"
              mandatory
              defaultOptions={categoryOptions}
              value={category}
              onChange={(value) => {
                setCategory(value)
                setValue("category", value?.[0]?.value || "", { shouldValidate: true })
              }}
              loadOptions={getAllCategory}
              error={errors.category?.message}
              isClearable
            />
          )}
          {widgetType?.code === WIDGET_TYPE_KEYS.COURSE && secType?.code !== SEC_TYPE_KEYS.TAB && !algorithmBased && (
            <Dropdown
              label="Course"
              isMulti
              placeholder="Search Course"
              mandatory
              defaultOptions={courseOptions}
              value={courseList}
              onChange={(value) => {
                setCourseList(value)
                setValue("course", value?.[0]?.value || "", { shouldValidate: true })
              }}
              loadOptions={getAllCourses}
              error={errors.course?.message}
              isClearable
            />
          )}
          {widgetType?.code === WIDGET_TYPE_KEYS.REVIEWS && (
            <Dropdown
              label="Review"
              isMulti
              placeholder="Search Review"
              mandatory
              defaultOptions={reviewOptions}
              value={reviewList}
              onChange={(value) => {
                setReviewList(value)
                setValue("reviews", value?.[0]?.value || "", { shouldValidate: true })
              }}
              loadOptions={getAllReviews}
              error={errors.reviews?.message}
              isClearable
            />
          )}
          {widgetType?.code === WIDGET_TYPE_KEYS.CATEGORY && (
            <MasterSelect
              isSearch={false}
              code={MASTER_CODES.cardType}
              label="Card Size"
              placeholder="Select Card Size"
              mandatory
              value={cardType}
              onChange={(opt) => {
                setCardType(opt)
                setValue("cardType", opt?.value, { shouldValidate: true })
              }}
              error={errors.cardType?.message}
              showFilteredList
              filterCode={(a) => a.code !== "BIG"}
              isClearable
              showCode
            />
          )}
          {widgetType?.code === WIDGET_TYPE_KEYS.COURSE && (
            <MasterSelect
              isSearch={false}
              code={MASTER_CODES.cardType}
              label="Card Size"
              placeholder="Select Card Size"
              mandatory
              value={cardType}
              onChange={(opt) => {
                setCardType(opt)
                setValue("cardType", opt?.value, { shouldValidate: true })
              }}
              error={errors.cardType?.message}
              isClearable
              showCode
            />
          )}
          {widgetType?.code === WIDGET_TYPE_KEYS.IMAGE && secType?.code === SEC_TYPE_KEYS.FIX_CARD && (
            <MasterSelect
              isSearch={false}
              code={MASTER_CODES.imgType}
              label="Image Type"
              placeholder="Select Image Type"
              mandatory
              value={imgType}
              showCode
              onChange={(opt) => {
                setImageType(opt)
                setValue("imgType", opt?.value, { shouldValidate: true })
              }}
              showFilteredList
              filterCode={(a) => a.code !== "LOGO"}
              error={errors.imgType?.message}
              isClearable
            />
          )}
          {widgetType?.code === WIDGET_TYPE_KEYS.IMAGE && secType?.code === SEC_TYPE_KEYS.CAROUSEL && (
            <MasterSelect
              isSearch={false}
              code={MASTER_CODES.imgType}
              label="Image Type"
              placeholder="Select Image Type"
              mandatory
              value={imgType}
              showCode
              onChange={(opt) => {
                setImageType(opt)
                setValue("imgType", opt?.value, { shouldValidate: true })
              }}
              error={errors.imgType?.message}
              isClearable
            />
          )}
          {(widgetType?.code === WIDGET_TYPE_KEYS.CATEGORY || widgetType?.code === WIDGET_TYPE_KEYS.COURSE) &&
            secType?.code !== SEC_TYPE_KEYS.TAB && (
              <div>
                <label htmlFor="isAlgorithmBase" className="inline-block mb-2 text-xs font-medium text-foreground">
                  Algorithm
                </label>
                <div className="py-1.5">
                  <ToggleInputButton
                    name="isAlgorithmBase"
                    rest={register("isAlgorithmBase")}
                    checked={algorithmBased}
                    onChange={(e) => {
                      setAlgorithmBased(e.target.checked)
                    }}
                  />
                </div>
              </div>
            )}
          {secType?.code === SEC_TYPE_KEYS.CAROUSEL && (
            <div>
              <label className="inline-block mb-2 text-xs font-medium text-foreground">Autoplay</label>
              <div className="py-1.5">
                <ToggleInputButton name="isAutoPlay" rest={register("isAutoPlay")} />
              </div>
            </div>
          )}

          {widgetType?.code === WIDGET_TYPE_KEYS.IMAGE &&
            fields.map((field, index) => {
              return (
                <div className="col-span-4" name={field.id} key={field.id}>
                  <div className="grid flex-col w-1/2 grid-cols-3 gap-3 p-4 border rounded bg-primary-light/70">
                    <Input
                      name={`img.${index}.title`}
                      rest={register(`img.${index}.title`)}
                      label="Title"
                      placeholder="Enter Title"
                      mandatory
                      error={errors?.img?.[index]?.title?.message}
                      disabled={!watchImage[index]?.editable}
                      lowerCasePlaceholder
                    />
                    {/* <Input
                      name={`img.${index}.titleID`}
                      rest={register(`img.${index}.titleID`)}
                      label="Title(id)"
                      placeholder="Enter Title(id)"
                      mandatory
                      error={errors?.img?.[index]?.titleID?.message}
                      disabled={!watchImage[index]?.editable}
                      lowerCasePlaceholder
                    /> */}
                    <Input
                      name={`img.${index}.alt`}
                      rest={register(`img.${index}.alt`)}
                      label="Alt"
                      placeholder="Enter Alt"
                      mandatory
                      error={errors?.img?.[index]?.alt?.message}
                      disabled={!watchImage[index]?.editable}
                      lowerCasePlaceholder
                    />
                    {/* <Input
                      name={`img.${index}.altID`}
                      rest={register(`img.${index}.altID`)}
                      label="Alt(id)"
                      placeholder="Enter Alt(id)"
                      mandatory
                      error={errors?.img?.[index]?.altID?.message}
                      disabled={!watchImage[index]?.editable}
                      lowerCasePlaceholder
                    /> */}
                    <Input
                      name={`img.${index}.link`}
                      rest={register(`img.${index}.link`)}
                      label="Link"
                      placeholder="Enter Link"
                      mandatory
                      error={errors?.img?.[index]?.link?.message}
                      disabled={!watchImage[index]?.editable}
                    />
                    <div className="col-span-3">
                      <Upload
                        setImg={(img) => {
                          setValue(`img.${index}.fileId`, img?.id || "", { shouldValidate: true })
                          setValue(`img.${index}.fileUri`, img)
                        }}
                        selectedImg={watchImage[index].fileUri}
                        label="Image"
                        formats="JPG,JPEG"
                        mandatory
                        error={errors?.img?.[index]?.fileId?.message}
                        disabled={!watchImage[index]?.editable}
                        resolution="400px/100px"
                      />
                    </div>
                    {/* <div className="col-span-3">
                      <Upload
                        setImg={(img) => {
                          setValue(`img.${index}.fileIdIndo`, img?.id || "", { shouldValidate: true })
                          setValue(`img.${index}.fileUriID`, img)
                        }}
                        selectedImg={watchImage[index].fileUriID}
                        label="Image(id)"
                        formats="JPG,JPEG"
                        mandatory
                        error={errors?.img?.[index]?.fileIdIndo?.message}
                        disabled={!watchImage[index]?.editable}
                        resolution="400px/100px"
                      />
                    </div> */}
                    <div className="flex justify-end col-span-3 gap-2">
                      {
                        id && watchImage[index].editable ? (
                          <Button
                            title="Cancel"
                            outline
                            className="hover:border-primary"
                            onClick={() => {
                              setValue(`img.${index}`, watchImage[index].beforeEdit, { shouldValidate: true })
                            }}
                          />
                        ) : (
                          fields?.length > 1 && (
                            <ConfirmPopOver onConfirm={() => remove(index)}>
                              <Button title="Delete" outline className="hover:border-primary" />
                            </ConfirmPopOver>
                          )
                        )
                        // <Button onClick={() => remove(index)} title="Delete" outline className="hover:border-primary" />
                      }
                      {id && (
                        <Button
                          onClick={() => {
                            setValue(`img.${index}.beforeEdit`, watchImage[index])
                            setValue(`img.${index}.editable`, !watchImage[index].editable)
                          }}
                          title={watchImage[index].editable ? "Save" : "Update"}
                          outline
                          className="hover:border-primary"
                        />
                      )}
                      <Button onClick={addImage} title="Add" />
                    </div>
                  </div>
                </div>
              )
            })}
          {widgetType?.code === WIDGET_TYPE_KEYS.COURSE && secType?.code === SEC_TYPE_KEYS.TAB && (
            <div className="col-span-4 p-3 border rounded bg-primary-light/70">
              <Tabs selectedIndex={activeTab} className="py-2 widgets-tab">
                <TabList className="flex gap-x-4 gap-y-2.5 flex-wrap ">
                  {tabFields?.map((field, index) => {
                    return (
                      <div className="row">
                        <Tab className="flex items-center gap-3 cursor-pointer">
                          <div
                            onClick={() => setActiveTab(index)}
                            id={index}
                            contentEditable
                            onInput={(e) => {
                              setValue(`tabs.${index}.name`, e.currentTarget.textContent.trim())
                            }}
                            className="self-center w-30"
                          >
                            {tabFields[index].name || "Tab Name"}
                          </div>{" "}
                          {tabFields?.length > 1 ? (
                            <ConfirmPopOver
                              onConfirm={() => {
                                removeField(index)
                                setActiveTab(index === 0 ? 0 : index - 1)
                              }}
                            >
                              <div data-tip="Delete Tab">
                                <DeleteIcon size="14" className="self-center text-red" />
                                <ReactTooltip effect="solid" />
                              </div>
                            </ConfirmPopOver>
                          ) : (
                            ""
                          )}
                        </Tab>
                        {errors.tabs?.[index]?.name?.message ? (
                          <p className="mt-1 text-xs font-medium text-red">{errors.tabs?.[index]?.name?.message}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    )
                  })}
                  <Button
                    onClick={addTab}
                    title={
                      <div data-tip="Add Tab">
                        <AddIcon size="14" />
                        <ReactTooltip effect="solid" />
                      </div>
                    }
                  />
                </TabList>
                <div className="px-3 pt-2">
                  {tabFields?.map((field, index) => {
                    return (
                      <TabPanel>
                        <div className="w-1/2">
                          <Dropdown
                            label="Program"
                            isMulti
                            placeholder="Select Program"
                            mandatory
                            defaultOptions={categoryOptions}
                            value={watchTabs[index]?.categories}
                            isDisabled={watchTabs[index]?.course?.length > 0}
                            onChange={(value) => {
                              setValue(`tabs.${index}.courseData`, value?.[0]?.value || "", { shouldValidate: true })
                              setValue(`tabs.${index}.categoryData`, value?.[0]?.value || "", {
                                shouldValidate: true,
                              })
                              setValue(`tabs.${index}.categories`, value, { shouldValidate: true })
                            }}
                            loadOptions={getAllCategory}
                            isClearable
                            error={errors.tabs?.[index]?.categoryData?.message}
                          />
                          <Divider title="Or" />
                          <Dropdown
                            label="Course"
                            isMulti
                            placeholder="Select Course"
                            mandatory
                            defaultOptions={courseOptions}
                            value={watchTabs[index]?.course}
                            isDisabled={watchTabs[index]?.categories?.length > 0}
                            onChange={(value) => {
                              setValue(`tabs.${index}.courseData`, value?.[0]?.value || "", { shouldValidate: true })
                              setValue(`tabs.${index}.categoryData`, value?.[0]?.value || "", {
                                shouldValidate: true,
                              })
                              setValue(`tabs.${index}.course`, value, { shouldValidate: true })
                            }}
                            loadOptions={getAllCourses}
                            isClearable
                            error={errors.tabs?.[index]?.courseData?.message}
                          />
                        </div>
                      </TabPanel>
                    )
                  })}
                </div>
              </Tabs>
            </div>
          )}
          {widgetType?.code === WIDGET_TYPE_KEYS.CATEGORY && secType?.code !== SEC_TYPE_KEYS.TAB && !algorithmBased && (
            <DragDropContext onDragEnd={onCategoryDragEnd}>
              <div className="col-span-4">
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div className="grid w-1/2 gap-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                      {category?.map((item, index) => (
                        <Draggable key={item.value} draggableId={item.value} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <CategoryCard remove={removeCategory} item={item} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
          )}
          {widgetType?.code === WIDGET_TYPE_KEYS.COURSE && secType?.code !== SEC_TYPE_KEYS.TAB && !algorithmBased && (
            <DragDropContext onDragEnd={onCourseDragEnd}>
              <div className="col-span-4">
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div className="grid w-1/2 gap-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                      {courseList?.map((item, index) => (
                        <Draggable key={item.value} draggableId={item.value} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <CourseCard remove={removeCourse} item={item} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
          )}
          {widgetType?.code === WIDGET_TYPE_KEYS.REVIEWS && (
            <DragDropContext onDragEnd={onReviewDragEnd}>
              <div className="col-span-4">
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div className="grid w-1/2 gap-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                      {reviewList?.map((item, index) => (
                        <Draggable key={item.value} draggableId={item.value} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <ReviewCard remove={removeReview} item={item} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 mt-3">
          <Button
            title="Cancel"
            kind="dark-gray"
            hoverKind="white"
            className="hover:border-primary"
            onClick={resetForm}
          />
          <Button title={id ? "Update Widget" : "Save"} onClick={handleSubmit(onSubmit)} />
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default AddWidget
