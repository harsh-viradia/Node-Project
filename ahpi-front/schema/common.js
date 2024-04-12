/* eslint-disable import/prefer-default-export */
import { DESIGNATION_TYPE } from "utils/constant"
import { REGEX } from "utils/regex"
import * as yup from "yup"

const { object, string, number } = yup

export const profileSchema = (t, role) => {
  return object({
    firstName: string().required(t("PleaseEnterFirstName")),
    lastName: string(),
    email: string().email(t("validEmail")).required(t("emailRequired")),
    mobNo: string().required("Please enter mobile number."),
    designation: yup.object().nullable().required("Please Select Role"),
    ...(role === "Student" && {
      university: yup.string().required("Please enter university name."),
      course: yup.string().required("Please enter course name."),
    }),
    ...(role === "Working professional" && {
      organization: yup.string().required("Please enter organization name."),
      profession: yup.string().required("Please enter profession name."),
    }),
  })
}
export const checkOutAddressSchema = (t) =>
  object({
    addrLine1: string().required(t("PleaseEnterAddressLine1")),
    // addrLine2: string().required(t("PleaseEnterAddressLine2")),
    stateId: string().required(t("PleaseSelectState")),
    stateNm: string().required(t("PleaseSelectState")),
    cityId: string().required(t("PleaseSelectCity")),
    cityNm: string().required(t("PleaseSelectCity")),
    countryId: string().required(t("PleaseSelectCountry")),
    countryNm: string().required(t("PleaseSelectCountry")),
    // zipcodeId: string().required("Please select zip code."),
    zipcode: yup
      .string()
      .matches(/^\d{6}$/, "Zip Code must be 6 digits Only.")
      .required(t("PleaseEnterZipCode")),
  })

export const addReviewSchema = object({
  stars: number().required("selectStars"),
  desc: string(),
})

export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required("errcurrentPasswordIsRequired")
    .transform((value, originalValue) => (originalValue ? originalValue.trim() : "")),
  newPassword: yup
    .string()
    .required("errNewPasswordIsRequired")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&()*,.:<>?@^`{|}~])[\d!"#$%&()*,.:<>?@A-Z^`a-z{|}~]{8,}$/,
      // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!"#$%&()*,.:<>?@^{|}])[A-Za-z\d`~!"#$%&()*,.:<>?@^{|}]{8,}$/,
      "errEnterCorrectPassword"
    )
    .notOneOf([yup.ref("currentPassword")], "errNewPasswordCannotMatchCurrentPassword")
    .transform((value, originalValue) => (originalValue ? originalValue.trim() : "")),
  confirmPassword: yup
    .string()
    .when("newPassword", {
      is: (value) => !!(value && value.length > 0),
      then: yup
        .string()
        .oneOf([yup.ref("newPassword")], "errPasswordDoesNotMatch")
        .required("errConfirmPassword"),
      otherwise: yup.string().required("errConfirmPassword"),
    })
    .required("errConfirmPassword")
    .transform((value, originalValue) => (originalValue ? originalValue.trim() : "")),
})

export const loginSchema = yup.object({
  email: yup.string().email("validEmail").required("errorEmail"),
  password: yup.string().required("errorPassword"),
})

export const emailSchema = yup.object({
  email: yup.string().email("validEmail").required("errorEmail"),
})

export const resetPasswordSchema = object().shape({
  password: string().required("Password is required").min(8, "Password length should be at least 8 characters"),
  confirmPassword: string()
    .required("Confirm Password is required")
    .min(8, "Password length should be at least 8 characters")
    .oneOf([yup.ref("password")], "Passwords do not match"),
})

export const ChangePasswordSchema = object({
  newPassword: string()
    .required("Password is required")
    .min(4, "Password length should be at least 4 characters")
    .max(12, "Password cannot exceed more than 12 characters"),
  confirmPassword: string()
    .required("Confirm Password is required")
    .min(4, "Password length should be at least 4 characters")
    .max(12, "Password cannot exceed more than 12 characters")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
  currentPassword: string().required("Current Password is required"),
})

export const registerSchema = (role) =>
  yup.object({
    firstName: yup.string().required("errorFirstName"),
    // lastName: yup.string().notRequired(),
    mobNo: yup
      .string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits Only")
      .required("Phone number is required"),
    email: yup.string().email("validEmail").required("errorEmail"),
    password: yup.string().matches(REGEX.PASSWORD, "errorCorrectPassword").required("errorPassword"),
    confirmPassword: yup
      .string()
      .when("password", {
        is: (value) => !!(value && value.length > 0),
        then: yup.string().oneOf([yup.ref("password")], "errorNotMatch"),
      })
      .required("errorConfirmPassword"),
    designation: yup.object().nullable().required("Please Select Role"),
    ...(role === DESIGNATION_TYPE.STUDENT && {
      university: yup.string().required("Please enter university name."),
      course: yup.string().required("Please enter course name."),
    }),
    ...(role === DESIGNATION_TYPE.PROFESSION && {
      organization: yup.string().required("Please enter organization name."),
      profession: yup.string().required("Please enter profession name."),
    }),
  })
