// eslint-disable-next-line import/no-import-module-exports
import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()
/* eslint-disable unicorn/better-regex */
const API_RESPONSE_LOGIN = "LOGIN"
const DEFAULT_NEXT_API_HEADER = { "Content-Type": "application/json" }
const API_SUCCESS_RESPONSE = "SUCCESS"
const API_ERROR_RESPONSE = "ERROR"
const GOOGLE_AUTH = "GOOGLE_AUTH"
const USER_NOT_VERIFIED = 403
const LOGIN_VIA_OTP = "LOGIN_VIA_OTP"
const NUMBER_OF_DIGITS_IN_OTP = 6
const OTP_VERIFY_CODE = "OTP_VERIFIED"
const ERROR_API_RESPONSE = "ERROR"
const VALIDATION_REQUIRED = true
const TYPE = "type"
const NAME = "name"
const IDENTIFIER = "identifier"
const IDENTIFIER_MAX_LENGTH = 6
const COMMON_NOT_REQUIRED_FIELD = undefined
const DEFAULT_NOT_REQUIRED = false
const VALIDATE_TILL = "validateTill"
const DEFAULT_OFFSET_PAYLOAD = 0
const DEFAULT_LIMIT = 20
const DEFAULT_SORT = -1
const PAGE_LIMIT = [10, 20, 30, 40, 50]
const DECIMAL_REDIX = 10
const DEFAULT_CURRENT_PAGE = 0
const INFINITY_LIMIT = "Infinity"
const NUMBER_REGEX = /^\d+$/
const REPLACE_NUMBER_REGEX = /[^0-9]/g
const SPACE_REMOVE_REGEX = / /g
const ALPHANUMERIC_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/
// eslint-disable-next-line no-useless-escape
const SLUG_REGEX = /^[\da-z\-]*$/
const SLUG_REPLACE_REGEX = /[^\da-z-]/gi
const CODE_REGEX = /^[\da-z_]*$/
const CODE_REPLACE_REGEX = /[^\da-z_ ]/gi
const MODULES = {
  Address: "address",
  LEARNER: "learner",
  INSTRUCTOR: "instructor",
  CERTIFICATE: "certificate",
  CATEGORY: "program",
  COURSE: "courses",
  WIDGET: "widgets",
  PAGE: "page",
  ORDERS: "orders",
  TRANSACTIONS: "transactions",
  REVIEWS: "reviews",
  NOTIFICATION: "notification",
  USER: "users",
  PERMISSION: "permission",
  ROLE: "roles",
  COUPON: "coupons",
  COUNTRY: "country",
  CITY: "city",
  PROVINCE: "state",
  ZIPCODE: "zipCode",
  MASTER: "master",
  SEO: "seo",
  COURSE_ANALYTICS: "courseAnalytics",
  CATEGORY_ANALYTICS: "categoryAnalytics",
  INSTRUCTOR_ANALYTICS: "instructorAnalytics",
  MY_EARNING: "myEarning",
  PAYOUT: "payout",
}

const MODULE_ACTIONS = {
  CREATE: "create",
  UPDATE: "update",
  ACTIVE: "active",
  DEFAULT: "default",
  WEBVISIBLE: "webVisible",
  SEQUENCE: "sequence",
  SOFTDELETE: "softDelete",
  LIST: "list",
  GETALL: "getAll",
  DELETE: "delete",
  GET_PERMISSION: "getPermission",
  UPDATE_PERMISSION: "updatePermission",
  GETPERMISSIONUSER: "getPermissionUser",
  PARTIALUPDATE: "partialUpdate",
  GET: "get",
  COURSEINFO: "courseInfo",
  ADDPRICE: "addPrice",
  BASICINFO: "basicInfo",
  UPDATEBASICINFO: "updateBasicInfo",
  PUBLISH: "publish",
  CREATESECTIONS: "createSections",
  UPDATESECTIONS: "updateSections",
  DELETESECTIONS: "deleteSections",
  GETALLSECTIONS: "getAllSections",
  UPDATESEQUENCESECTIONS: "updateSequenceSections",
  CREATEMATERIALS: "createMaterials",
  UPDATEMATERIALS: "updateMaterials",
  DELETEMATERIALS: "deleteMaterials",
  GETALLMATERIALS: "getAllMaterials",
  PARTIALUPDATEMATERIALS: "partialUpdateMaterials",
  CREATEQUESTIONS: "createQuestions",
  UPDATEQUESTIONS: "updateQuestions",
  DELETEQUESTIONS: "deleteQuestions",
  UPDATESEQUENCEQUESTIONS: "updateSequenceQuestions",
  GETALLQUESTIONS: "getAllQuestions",
  GETCOURSEDETAILS: "getCourseDetails",
  EXPORT: "export",
  UPDATESEQUENCE: "updateSequence",
  SENDINVOICE: "send-invoice",
  GET_REPORT: "getReport",
  SEND: "send",
  SALES_ANALYTICS: "courseAnalytics",
  RATING_ANALYTICS: "ratingAnalytics",
  ANALYTICS: "analytics",
  INCOME: "incomes",
  PREVIEW_COUNT: "previewCount", //  course preview count
  APPROVE_COURSE: "approveCourse", // request for review
  VERIFY: "verify", // verify button in course preview
  REJECT: "reject", // reject button in course preview
}

const KEYS = {
  forgetEmail: "FORGET_EMAIL",
  email: "LOGIN_EMAIL",
  otpExpireTime: "OTP_EXPIRE_TIME",
}

const MASTER_CODES = {
  major: "MAJOR",
  userStatus: "USER_STATUS",
  semester: "SEMESTER",
  entryYear: "ENTRY_YEAR",
  entryStatus: "ENTRY_STATUS",
  universityType: "UNIVERSITY_TYPE",
  courseStatus: "COURSE_STATUS",
  industry: "INDUSTRY",
  organizationType: "ORGANIZATION_TYPE",
  institution: "INSTITUTION",
  level: "LEVEL",
  questionType: "QUESTION_TYPE",
  languages: "LANGUAGES",
  notificationType: "NOTIFICATION_TYPE",
  widgetType: "WIDGET_TYPE",
  secType: "SECTION_TYPE",
  imgType: "IMAGE_TYPE",
  cardType: "CARD_TYPE",
  transactionStatus: "PAYMENT_STATUS",
  topics: "TOPICS",
  FLOATING_NOTIFICATION_CRITERIA: "FLOATING_NOTIFICATION_CRITERIA",
  GENERAL_NOTIFICATION_CRITERIA: "GENERAL_NOTIFICATION_CRITERIA",
  USER_TYPE: "USER_TYPE",
  couponType: "COUPON_TYPE",
  couponCriteria: "COUPON_CRITERIA",
  currency: "CURRENCY",
}

const USER_STATUS = {
  cancelled: "Cancelled",
  active: "Active",
  refused: "Refused",
  qualified: "Qualified",
  registered: "Registered",
  systemRejected: "System Rejected",
  open: "Open",
}

const USER_STATUS_COLOR = {
  [USER_STATUS.cancelled]: "dark-gray",
  [USER_STATUS.active]: "primary",
  [USER_STATUS.refused]: "purple-700",
  [USER_STATUS.qualified]: "dark-green",
  [USER_STATUS.registered]: "dark-gray",
  [USER_STATUS.systemRejected]: "red",
  [USER_STATUS.open]: "yellow",
}

const COURSE_STATUS = {
  registered: "Terdaftar",
  accepted: "Diterima",
  finished: "Selesai",
  inProcess: "Diproses",
  waitingList: "Waiting List",
  active: "Aktif",
  refuse: "Menolak",
  rejected: "Ditolak",
  notTaken: "Tidak Di Ambil",
  notContinued: "Tidak Dilanjutkan",
  withdraw: "Withdraw",
}

const COURSE_STATUS_COLOR = {
  [COURSE_STATUS.registered]: "primary",
  [COURSE_STATUS.accepted]: "green",
  [COURSE_STATUS.finished]: "dark-green",
  [COURSE_STATUS.inProcess]: "yellow",
  [COURSE_STATUS.waitingList]: "light-yellow",
  [COURSE_STATUS.active]: "primary",
  [COURSE_STATUS.refuse]: "pink",
  [COURSE_STATUS.rejected]: "red",
  [COURSE_STATUS.notTaken]: "purple-700",
  [COURSE_STATUS.notContinued]: "dark-gray",
  [COURSE_STATUS.withdraw]: "primary",
}

const PROCESS_FILE = `https://api.dataimport.knovator.in/v1/templates/${publicRuntimeConfig.NEXT_PUBLIC_IMPORT_KEY}/process-file`
const MAP_DATA = `https://api.dataimport.knovator.in/v1/templates/${publicRuntimeConfig.NEXT_PUBLIC_IMPORT_KEY}/map-data`

const MATERIAL_TYPES = {
  VIDEO: 1,
  QUIZ: 2,
  TEXT: 3,
  DOCS: 4,
  QUIZ_CERTIFICATE: 5,
}

const QUESTION_TYPE = {
  MCQ: "MCQ",
  MSQ: "MSQ",
}

const COURSE_TYPE = {
  DRAFT: 1,
  PUBLISHED: 2,
}

const VIDEO_FILE_STATUS = {
  PROCESSING: 0,
  FAILED: 1,
  UPLOADED: 2,
}

const FILTER_OPTION = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
]
const COURSE_STATUS_OPTION = [
  { value: 2, label: "Published" },
  { value: 1, label: "Draft" },
]
const COURSE_OPTION = [
  { value: 1, label: "All" },
  { value: 2, label: "Request For Review" },
  { value: 3, label: "Rejected" },
]
const INSTRUCTOR_COURSE_OPTION = [
  { value: true, label: "Yes" },
  { value: false, label: "NO" },
]
//  payment status
const STATUS = {
  PENDING: 2,
  SUCCESSFULL: 1,
  FAILED: 3,
}
const STATUS_VIEW = {
  [STATUS.PENDING]: "pending",
  [STATUS.SUCCESSFULL]: "success",
  [STATUS.FAILED]: "failed",
}
const DATE_TIME_FORMAT = "DD/MM/YYYY hh:mm A"
const DATE_FORMAT = "DD/MM/YYYY"
const ANALYTICS_DATE_FORMAT = "YYYY/MM/DD"
const COUPON_DATE_FORMAT = "YYYY-MM-DD"

const NOTIFICATION_TYPE = { GENERAL: "GENERAL", FLOATING: "FLOATING" }
const CRITERIA_TYPE = {
  ALL: "GENERAL_NOTIFICATION_ALL",
  SELECTED_USER: "SELECTED_USER",
  PREVIOUS_ORDER: "PREVIOUS_ORDER",
  CART: "CART",
  WISHLIST: "WISHLIST",
  PAGES: "PAGES",
  COURSES: "COURSES",
  CATEGORIES: "CATEGORIES",
}
const NOTIFICATION_USER_TYPES = {
  ALL: "USER_TYPE_ALL",
  LOGGED_USER: "LOGGEDIN_USER",
  GUEST_USER: "GUEST_USER",
}
const checkIOSDevice = () => {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  )
}

const IGNORED_FIELD_FROM_MASTERS = {
  CARD_SIZE: "Big",
}
const SYSTEM_USERS = {
  INSTRUCTOR: "INSTRUCTOR",
  ADMIN: "ADMIN",
  LEARNER: "LEARNER",
}

const COUPON_TYPE_NAME = {
  BUY_X_GET_X: "BUY_X_GET_X",
  FLAT_DISCOUNT: "FLAT_DISCOUNT",
  PERCENTAGE_DISCOUNT: "PERCENTAGE_DISCOUNT",
}

const COUPON_CRITERIA = {
  COURSES: "COUPON_CRITERIA_COURSES",
  CATEGORIES: "COUPON_CRITERIA_CATEGORIES",
  COUPON_CRITERIA_ALL: "COUPON_CRITERIA_ALL",
}

const CACHE_KEY = {
  KEY: {
    CASHING_KEY: "Cashing-Key",
  },
  VALUE: {
    HOME: "home",
    SEO_CATEGORY: "seo_category",
    SEO_HOME: "seo_home",
    CATEGORY: "category",
  },
}

export {
  ALPHANUMERIC_REGEX,
  ANALYTICS_DATE_FORMAT,
  API_ERROR_RESPONSE,
  API_RESPONSE_LOGIN,
  API_SUCCESS_RESPONSE,
  CACHE_KEY,
  checkIOSDevice,
  CODE_REGEX,
  CODE_REPLACE_REGEX,
  COMMON_NOT_REQUIRED_FIELD,
  COUPON_CRITERIA,
  COUPON_DATE_FORMAT,
  COUPON_TYPE_NAME,
  COURSE_OPTION,
  COURSE_STATUS_COLOR,
  COURSE_STATUS_OPTION,
  COURSE_TYPE,
  CRITERIA_TYPE,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DECIMAL_REDIX,
  DEFAULT_CURRENT_PAGE,
  DEFAULT_LIMIT,
  DEFAULT_NEXT_API_HEADER,
  DEFAULT_NOT_REQUIRED,
  DEFAULT_OFFSET_PAYLOAD,
  DEFAULT_SORT,
  ERROR_API_RESPONSE,
  FILTER_OPTION,
  GOOGLE_AUTH,
  IDENTIFIER,
  IDENTIFIER_MAX_LENGTH,
  IGNORED_FIELD_FROM_MASTERS,
  INFINITY_LIMIT,
  INSTRUCTOR_COURSE_OPTION,
  KEYS,
  LOGIN_VIA_OTP,
  MAP_DATA,
  MASTER_CODES,
  MATERIAL_TYPES,
  MODULE_ACTIONS,
  MODULES,
  NAME,
  NOTIFICATION_TYPE,
  NOTIFICATION_USER_TYPES,
  NUMBER_OF_DIGITS_IN_OTP,
  NUMBER_REGEX,
  OTP_VERIFY_CODE,
  PAGE_LIMIT,
  PROCESS_FILE,
  QUESTION_TYPE,
  REPLACE_NUMBER_REGEX,
  SLUG_REGEX,
  SLUG_REPLACE_REGEX,
  SPACE_REMOVE_REGEX,
  STATUS,
  STATUS_VIEW,
  SYSTEM_USERS,
  TYPE,
  USER_NOT_VERIFIED,
  USER_STATUS,
  USER_STATUS_COLOR,
  VALIDATE_TILL,
  VALIDATION_REQUIRED,
  VIDEO_FILE_STATUS,
}
