/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/forbid-prop-types */
import { CRITERIA_TYPE, NOTIFICATION_TYPE } from "utils/constant"
import * as yup from "yup"

const { object, string } = yup

// eslint-disable-next-line import/prefer-default-export
export const masterSchema = object({
  name: string().required("Name is required."),
  code: string().required("Code is required."),
})

export const roleSchema = object({
  name: string()
    .required("Role name is required.")
    .matches(/^[\d A-Za-z]*$/, "Enter valid role name."), // regex for alphanumeric and space
})

export const categorySchema = object({
  name: string()
    .required("Program name is required.")
    .matches(/^.*[A-Za-z]+.*$/, "Enter valid Program name."), // regex for at least one alphabet.
  description: string().required("Program description is required."),
  topics: yup.array().min(1, "Keywords are required."),
})

export const notificationSchema = object().shape(
  {
    nm: string()
      .required("Notification name is required.")
      .matches(/^.*[A-Za-z]+.*$/, "Enter valid notification name."), // regex for at least one alphabet.
    title: string().required("Notification title is required."),
    desc: string().required("Notification description is required."),
    typeId: object({
      value: string().required("Please select notification type."),
    }).nullable(),
    startDt: string().when("typeId", {
      is: (type) => type?.code !== NOTIFICATION_TYPE.GENERAL,
      then: yup.string().required("Please select start date."),
    }),
    endDt: string().when("typeId", {
      is: (type) => type?.code !== NOTIFICATION_TYPE.GENERAL,
      then: yup.string().required("Please select end date."),
    }),
    imgId: object(),
    criteriaId: object({
      value: string().required("Please select criteria type."),
    }).nullable(),
    users: yup.array().when("criteriaId", {
      is: (type) => type?.code === CRITERIA_TYPE.SELECTED_USER,
      then: yup.array().required("Please select users.").min(1, "Please select users."),
    }),
    categories: yup.array().when(["criteriaId", "courses", "typeId"], {
      is: (criteriaId, courses, typeId) =>
        typeId?.code === NOTIFICATION_TYPE.GENERAL
          ? criteriaId?.code !== CRITERIA_TYPE.ALL &&
            criteriaId?.code !== CRITERIA_TYPE.SELECTED_USER &&
            !courses?.length
          : criteriaId?.code === CRITERIA_TYPE.CATEGORIES,
      then: yup.array().required("Please select program.").min(1, "Please select program."),
    }),
    courses: yup.array().when(["criteriaId", "categories", "typeId"], {
      is: (criteriaId, categories, typeId) =>
        typeId?.code === NOTIFICATION_TYPE.GENERAL
          ? criteriaId?.code !== CRITERIA_TYPE.ALL &&
            criteriaId?.code !== CRITERIA_TYPE.SELECTED_USER &&
            !categories?.length
          : criteriaId?.code === CRITERIA_TYPE.COURSES,
      then: yup.array().required("Please select course.").min(1, "Please select course."),
    }),
    pages: yup.array().when("criteriaId", {
      is: (type) => type?.code === CRITERIA_TYPE.PAGES,
      then: yup.array().required("Please select page.").min(1, "Please select page."),
    }),
    userTypeId: object().when("typeId", {
      is: (type) => type?.code === NOTIFICATION_TYPE.FLOATING,
      then: object({
        value: string().required("Please select user type."),
      }).nullable(),
    }),
  },
  ["courses", "categories"]
)

export const widgetSchema = object({
  name: string()
    .required("Widget name is required.")
    .matches(/^.*[A-Za-z]+.*$/, "Enter valid widget name."),
  code: string()
    .required("Code is required.")
    .matches(
      /^[A-Za-z]\w{2,}$/,
      "Enter code in format of min length of 3 and must start with alphabet and only includes 'A-Z', '0-9' and '_' !"
    ),
  headingTitle: string()
    .required("Section title(en) is required.")
    .matches(/^.*[A-Za-z]+.*$/, "Enter valid section title(en)."),
  // headingTitleID: string()
  // eslint-disable-next-line write-good-comments/write-good-comments
  //   .required("Section title(id) is required.")
  //   .matches(/^.*[A-Za-z]+.*$/, "Enter valid section title(id)."),
  rowPerMobile: string().required("Mobile per row is required."),
  rowPerWeb: yup
    .number()
    .typeError("Web per row is required.")
    .required("Web per row is required.")
    .min(0, "Web per row must be greater than 0.")
    .max(5, "Web per row must be less than 5."),
  rowPerTablet: string().required("Tablet per row is required."),
  isAutoPlay: yup.boolean(),
  isAlgorithmBase: yup.boolean(),
  type: string().required("Please select widget type."),
  secType: string().required("Please select section type."),
  imgType: string().when("type", {
    is: "IMAGE",
    then: yup.string().required("Please select image type."),
  }),
  cardType: string().when("type", {
    is: (type) => type === "CATEGORY" || type === "COURSE",
    then: yup.string().required("Please select card size."),
  }),
  category: string().when(["type", "isAlgorithmBase", "secType"], {
    is: (type, isAlgorithmBase, secType) => type === "CATEGORY" && secType !== "TAB" && !isAlgorithmBase,
    then: yup.string().required("Please select program."),
  }),
  course: string().when(["type", "isAlgorithmBase", "secType"], {
    is: (type, isAlgorithmBase, secType) => type === "COURSE" && secType !== "TAB" && !isAlgorithmBase,
    then: yup.string().required("Please select course."),
  }),
  reviews: string().when("type", {
    is: "REVIEWS",
    then: yup.string().required("Please select review."),
  }),
  img: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Title is required"),
      // eslint-disable-next-line write-good-comments/write-good-comments
      // titleID: yup.string().required("Title(id) is required"),
      alt: yup.string().required("Alt text is required"),
      // eslint-disable-next-line write-good-comments/write-good-comments
      // altID: yup.string().required("Alt(id) text is required"),
      link: yup.string().required("Link is required").url("Enter valid url"),
      fileId: yup.string().required("Image is required"),
      // eslint-disable-next-line write-good-comments/write-good-comments
      // fileIdIndo: yup.string().required("Image(id) is required"),
    })
  ),
  tabs: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Title is required."),
      courseData: yup.string().required("Course is required."),
      categoryData: yup.string().required("Program is required."),
      course: yup.array(),
      categories: yup.array(),
    })
  ),
})

export const payoutSchema = object({
  month: string().required("Month is required."),
  amt: string().required("Amount is required."),
  trnsType: string().required("Transaction type is required."),
  transferDate: string().required("Transfer date is required."),
  currency: string().required("Currency is required."),
})
