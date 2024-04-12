/* eslint-disable no-unsafe-optional-chaining */
// eslint-disable-next-line import/no-import-module-exports
// import getConfig from "next/config"

// const { publicRuntimeConfig } = getConfig()

const KEYS = {
  forgetEmail: "FORGET_EMAIL",
  email: "LOGIN_EMAIL",
  otpExpireTime: "OTP_EXPIRE_TIME",
}

const API_SUCCESS = {
  OK: "SUCCESS",
}

const DESIGNATION_TYPE = {
  STUDENT: "STUDENT",
  PROFESSION: "WORKING_PROFESSIONAL",
}

const USER_TYPES = { LEARNER: "LEARNER" }
const DEFAULT_LIMIT = 12
const UNAUTHENTICATED = 401
const USER_NOT_VERIFIED = 403
const USER_NOT_FOUND = 404
const DEFAULT_NEXT_API_HEADER = { "Content-Type": "application/json" }
const API_ERROR_RES = "ERROR"
const OTP_VERIFY_CODE = "SUCCESS"
const DEFAULT_SORT = -1
const PAGE_LIMIT = [10, 20, 30, 40, 50]

const MATERIAL_TYPES = {
  VIDEO: 1,
  QUIZ: 2,
  TEXT: 3,
  DOCS: 4,
  QUIZ_CERTIFICATE: 5,
}

const WIDGET = {
  TYPE: {
    IMAGE: "IMAGE",
    COURSE: "COURSE",
    CATEGORY: "CATEGORY",
    REVIEW: "REVIEWS",
    COMPONIES: "COMPONIES",
  },
  SECTION_TYPE: {
    CAROUSEL: "CAROUSEL",
    TAB: "TAB",
    FIX_CARD: "FIXED_CARD",
  },
}

const VIDEO_FILE_STATUS = {
  PROCESSING: 0,
  FAILED: 1,
  UPLOADED: 2,
}

const capitalizeFirstLetter = (str) => {
  const firstCP = str.codePointAt(0)
  const index = firstCP > 0xff_ff ? 2 : 1

  return String.fromCodePoint(firstCP).toUpperCase() + str?.slice(index)
}

const checkIOSDevice = () => {
  return typeof navigator === "undefined"
    ? []
    : ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
const convertTimeToSeconds = (time) => {
  if (!time) return 0
  return Number(
    (time?.split(":")?.[0] * 60 * 60 || 0) + (time?.split(":")?.[1] * 60 || 0) + (time?.split(":")?.[2] || 0)
  )
}

const QUESTION_TYPE = {
  MCQ: "MCQ",
  MSQ: "MSQ",
}

const QUIZ_SUBMIT_STATUS = {
  PENDING: 1,
  COMPLETED: 2,
}

const POPULATE_PARAMS = {
  PURCHASE_HISTORY_PARAMS: [
    {
      path: "courses.courseId",
      populate: [
        {
          path: "imgId levelId parCategory badgeId",
          select: "name names code uri",
        },
      ],
    },
    {
      path: "receiptId",
    },
  ],
}
// const SSO_REDIRECT_PAYLOAD = {
//   clientId:
// eslint-disable-next-line write-good-comments/write-good-comments
//  typeof window !== "undefined" &&
//     btoa(`${publicRuntimeConfig.NEXT_PUBLIC_CLIENT_ID}:${publicRuntimeConfig.NEXT_PUBLIC_CLIENT_SECRET}`),
//   redirectUrl: `${publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL}/`,
//   redirectTitle: publicRuntimeConfig.NEXT_PUBLIC_META_TITLE,
// }

const ANALYTICS_EVENT = {
  BUY_NOW: "Buy now",
  LOGIN: "Login",
  ADD_CART: "Add to cart",
  REMOVE_CART: "Remove from cart",
  ADD_WISHLIST: " Add to Wishlist",
  REMOVE_WISHLIST: "Remove Wishlist",
  EDIT_PROFILE: "Edit profile",
  ADD_ADDRESS: "Add address",
  EDIT_ADDRESS: "Edit address",
  REMOVE_ADDRESS: "Remove Address",
  DEFAULT_ADDESS: "Set as default address",
  CHANGE_PASSWORD: "Change password",
  APPLY_FILTER: "Apply filter",
  CLEAR_FILTER: "Clear filter",
  SORT_BY_COURSE: "Sort by courses",
  START_COURSE: "Start course",
  CONTINUE_COURSE: "Continue Course",
  SUBMIT_REVIEW: "Submit Review",
  DOWNLOAD_CERTIFICATE: "Download certificate",
  APPLY_COUPON: "Apply Coupon",
  COMPLETED_CHECKOUT: "Complete checkout",
  PAYMENT_SUCCESSFULL: "Payment successfull",
  PAYMENT_Fail: "Payment Fail",
}

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC08sc4cmQiardeOWK6smyZfULE4uxZ5Ok",
  authDomain: "ahpi-46534.firebaseapp.com",
  projectId: "ahpi-46534",
  storageBucket: "ahpi-46534.appspot.com",
  messagingSenderId: "51754875070",
  appId: "1:51754875070:web:3d9caf7abc1b95665ec6ef",
  measurementId: 'G-CCS8S5TWRB"',
}
const SETTINGS_CODE = {
  aboutUs: "ABOUT_US",
  aboutUsID: "ABOUT_US_ID",
  privacy: "PRIVACY_POLICY",
  privacyID: "PRIVACY_POLICY_ID",
  tAndC: "TERMS_AND_CONDITIONS",
  tAndCID: "TERMS_AND_CONDITIONS_ID",
  sortBy: "SORT_BY",
  couponAndRewardApply: "IS_COUPON_AND_REWARDS_APPLY",
  rewardPointValue: "REWARD_CALC",
}
const QUIZ_LOADER = {
  PREV: 1,
  NEXT: 2,
  SUBMIT: 3,
}
const LOCALES = {
  ENGLISH: "en",
  INDONESIAN: "id",
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

module.exports = {
  KEYS,
  DEFAULT_NEXT_API_HEADER,
  OTP_VERIFY_CODE,
  DEFAULT_SORT,
  PAGE_LIMIT,
  UNAUTHENTICATED,
  API_ERROR_RES,
  USER_NOT_VERIFIED,
  API_SUCCESS,
  MATERIAL_TYPES,
  WIDGET,
  capitalizeFirstLetter,
  DEFAULT_LIMIT,
  USER_TYPES,
  VIDEO_FILE_STATUS,
  QUESTION_TYPE,
  checkIOSDevice,
  convertTimeToSeconds,
  QUIZ_SUBMIT_STATUS,
  POPULATE_PARAMS,
  // SSO_REDIRECT_PAYLOAD,
  FIREBASE_CONFIG,
  SETTINGS_CODE,
  QUIZ_LOADER,
  LOCALES,
  USER_NOT_FOUND,
  CACHE_KEY,
  DESIGNATION_TYPE,
  ANALYTICS_EVENT,
}
