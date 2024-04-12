/* eslint-disable write-good-comments/write-good-comments */
/* eslint-disable sonarjs/no-duplicate-string */
import { SYSTEM_USERS } from "utils/constant"
import * as yup from "yup"

const { object, string, array, boolean } = yup

export const passwordSchema = object({
  // eslint-disable-next-line sonarjs/no-duplicate-string
  password: string().required("Password is required."),
})

export const loginSchema = yup.object({
  email: yup.string().email("Please enter valid email address.").required("Please enter email."),
  password: yup.string().required("Please enter password."),
})

export const emailSchema = object({
  // eslint-disable-next-line sonarjs/no-duplicate-string
  email: string().email("Email must be a valid Email.").required("Email is required."),
})

export const userSchema = object({
  firstName: string().required("First name is required."),
  lastName: string().required("Last name is required."),
  email: string().email("Email must be a valid Email.").required("Email is required."),
  countryCode: string().notRequired(),
  mobNo: string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits Only.")
    .required("Phone number is required"),
  roleId: string().required("Role is required."),
})

export const getUserSchema = (userRole) =>
  userRole !== SYSTEM_USERS.INSTRUCTOR
    ? object({
        email: string().email("Email must be a valid Email.").required("Email is required."),
        firstName: string().required("First name is required."),
        lastName: string().required("Last name is required."),
      })
    : object({
        email: string().email("Email must be a valid Email.").required("Email is required."),
        firstName: string().required("First name is required."),
        lastName: string(),
        companyNm: string(),
      })

export const changePasswordSchema = object({
  currentPassword: string()
    .required("Current password is required.")

    .transform((value, originalValue) => (originalValue ? originalValue.trim() : "")),
  newPassword: string()
    .required("New password is required.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&()*,.:<>?@^`{|}~])[\d!"#$%&()*,.:<>?@A-Z^`a-z{|}~]{8,}$/,
      "Please enter the correct password."
    )
    .notOneOf([yup.ref("currentPassword")], "New password cannot be same as your current password.")
    .transform((value, originalValue) => (originalValue ? originalValue.trim() : "")),
  confirmPassword: yup
    .string()
    .when("newPassword", {
      is: (value) => !!(value && value.length > 0),
      then: yup.string().oneOf([yup.ref("newPassword")], "Password does not match."),
    })
    .required("Confirm password is required.")
    .transform((value, originalValue) => (originalValue ? originalValue.trim() : "")),
})

export const resetPasswordSchema = object({
  password: string().required("Password is required."),
  confirmPassword: yup.string().when("password", {
    is: (value) => !!(value && value.length > 0),
    then: yup.string().oneOf([yup.ref("password")], "Password does not match."),
  }),
})

export const universitySchema = object({
  // eslint-disable-next-line sonarjs/no-duplicate-string
  name: string().required("Name is required."),
  abbreviation: string().required("Abbreviation is required."),
  street: string().required("Street is required."),
  countryId: string().required("Please select country."),
  countryNm: string(),
  stateId: string().required("Please select province."),
  stateNm: string(),
  cityId: string().required("Please select city."),
  cityNm: string(),
  zipCode: string().required("Zipcode is required."),
})

export const studentSchema = object({
  nikNo: string().max(16, "Invalid NIK.").min(16, "Invalid NIK.").required("NIK is required."),
  nim: string().required("NIM is required."),
  appliedDate: string().required("Applied Date is required."),
  firstName: string().required("Name is required."),
  universityId: string().required("Please select university."),
  universityNm: string(),
  majorId: string().required("Please select major."),
  majorNm: string(),
  courses: array().min(1, "Courses are required.").required("Courses are required."),
  stsId: string().required("Please select status."),
  stsNm: string(),
  ipk: string().required("IPK is required."),
  semesterId: string().required("Please select semester."),
  semesterNm: string(),
  entryId: string().required("Please select entry year."),
  entryYear: string(),
  entryStsId: string().required("Please select entry status."),
  entryStsNm: string(),
  universityTypeId: string().required("Please select university type."),
  universityTypeNm: string(),
  email: string().email("Email must be a valid Email.").required("Email is required."),
  mobile: string()
    .matches(/^\d+$/, "Only Numbers are allowed.")
    .min(7, "Invalid mobile number.")
    .required("Mobile number is required."),
})
export const requiredSchema = (key) => {
  return object({
    [key]: string().required(),
  })
}

export const courseSchema = object({
  name: string().required("Course name is required."),
  desc: string().required("Course details is required."),
  // eslint-disable-next-line write-good-comments/write-good-comments
  // fillSeat: string().required("Filled seats is required."),
  // eslint-disable-next-line write-good-comments/write-good-comments
  // totalSeat: string().required("Total seats is required."),
  // eslint-disable-next-line write-good-comments/write-good-comments
  // stsId: string().required("Status is required."),
  // stsNm: string(),
})

export const questionSchema = yup.object({
  data: yup
    .array()
    .of(
      yup.object().shape({
        ansIds: yup.string().required("Please select answer."),
      })
    )
    .min(1, "Answers are required.")
    .required("Answers are required."),
})

export const documentSchema = yup.object({
  data: yup
    .array()
    .of(
      yup.object().shape({
        documentId: yup.object().notRequired(),
      })
    )
    .min(1, "Documents are required.")
    .required("Documents are required."),
})

export const mappedSchema = object({
  courseId: string().required("Course is required."),
  files: string().required("File is required."),
})

export const categorySchema = object({
  name: string().required("Name is required."),
  description: string().required("Description is required."),
})

export const InstructorSchema = object({
  firstName: string().required("First name is required."),
  // .matches(/.*\S.*/, "first name is required.")
  // .matches(/^[ A-z]+$/, "Enter valid first name."),
  lastName: string(),
  companyNm: string(),
  email: string().email("Enter valid email.").required("Email is required."),
  phone: string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits Only.")
    .required("Phone number is required"),
  bio: string().required("Bio is required."),
  profileId: string().required("Profile image is required. "),
  fbLink: string().url("Enter valid url"),
  instaLink: string().url("Enter valid url"),
  linkedIn: string().url("Enter valid url"),
  websiteLink: string().url("Enter valid url"),
})
export const InstructorSchema1 = object({
  course: string().required("No. of courses is required."),
  payoutPercentage: yup
    .number()
    .typeError("Payout percentage is required. ")
    .required("Payout percentage is required. ")
    .min(0, "Enter valid percentage.")
    .max(100, "Enter valid percentage."),
  isApproved: yup.boolean(),
  category: array().when("allCat", {
    is: true,
    then: array().notRequired().nullable(true),
    otherwise: array()
      .min(2, "Please select at least 2 categories.")
      .required("Please select program.")
      .typeError("Please select program."),
  }),
  certificate: array()
    .min(1, "Please select certificate.")
    .required("Please select certificate.")
    .typeError("Please select certificate."),
})
export const InstructorSchema2 = object({
  userAdd: string().required("Sender address is required."),
  accNo: string().required("Bank account no. is required."),
  bankNm: string().required("Bank name is required. "),
  swiftCode: string()
    .required("Swift code is required. ")
    .min(8, "Enter valid swift code")
    .max(8, "Enter valid swift code"),
  refCode: string().required("Reff code is required. "),
  branchNm: string().required("Branch name is required. "),
  branchAdd: string().required("Branch address is required. "),
  branchCode: string().required("Branch code is required. "),
  cityId: string().required("Please select city. "),
  countryId: string().required("Please select country."),
})

export const SeoSchema = object({
  metaTitle: string().required("Meta title is required."),
  metaDesc: string().required("Meta description is required."),
  keyWords: string().optional(),
  script: string().optional(),
  ogTitle: string().optional(),
  ogDesc: string().optional(),
  entityNm: string().optional(),
  entityId: string().optional(),
  author: string().optional(),
  imgId: string().optional(),
})

export const basicCourseSchema = object({
  title: string().required("Title is required."),
  slug: string().required("Slug is required."),
  desc: string().required("Course description is required."),
  levelId: string().required("Please select level."),
  lang: string().required("Please select language."),
  userId: string().required("Please select partner."),
  parCategory: string().required("Please select Primary Program."),
  imgId: string().required("Course image is required."),
  // vidId: string().required("Promotional video is required."),
  certiPrefix: string().required("Course prefix is required."),
  certificateId: string().required("Please select certificate."),
  category: array()
    .min(1, "Please select program.")
    .required("Please select program.")
    .typeError("Please select program."),
})

export const courseInfoSchema = object({
  // briefDesc: string().required("Course brief description is required."),
  about: string().required("Who should enroll is required."),
  includes: string().required("This course includes is required."),
  require: string().required("Requirements is required."),
})
export const pricingInfoSchema = object({
  MRP: yup
    .number()
    .required("Retail price is required.")
    .typeError("Retail price is required.")
    .min(0, "Retail price should be greater than or equal to zero."),
  sellPrice: yup
    .number()
    .required("Selling price is required.")
    .typeError("Selling price is required.")
    .min(0, "Selling price should be greater than or equal to zero."),
  rewardPoints: yup
    .number()
    .min(0, "Reward points should be greater than or equal to zero.")
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .nullable()
    .optional(),
  InAppPurchaseSellPrice: yup.string().required("Selling price tier is required."),
  InAppPurchaseMRP: yup.string().required("Retail price tier is required."),
})
export const sectionSchema = object({
  nm: string().required("Section name is required."),
  desc: string().required("Section description is required."),
})

export const quizSchema = object({
  nm: string().required("Please enter title."),
  // desc: string().required("Please enter description."),
  viewSetOfQue: string().required("Please enter view set of question."),
  duration: string().required("Please enter duration."),
})

export const quizCertificateSchema = object({
  nm: string().required("Please enter title."),
  // desc: string().required("Please enter description."),
  viewSetOfQue: string().required("Please enter view set of question."),
  duration: string().required("Please enter duration."),
  passingScore: string().required("Please enter passing score."),
})

export const textSchema = object({
  nm: string().required("Please enter title."),
  // desc: string().required("Please enter description."),
  text: string().required("Please enter text."),
})

export const videoSchema = object({
  nm: string().required("Please enter title."),
  // desc: string().required("Please enter description."),
  vidId: string().required("Please upload video."),
})

export const courseDocumentSchema = object({
  nm: string().required("Please enter title."),
  // desc: string().required("Please enter description."),
  docId: string().required("Please upload document."),
})
export const addQuestionSchema = object({
  ques: string().required("Question is required."),
  queType: string().required("Type is required."),
  opts: array()
    .of(
      object().shape({
        nm: string().required("Answer field cannot be empty."),
        isAnswer: boolean(),
      })
    )
    .min(2, "Answers field cannot be empty.")
    .required("Answers are required."),
  posMark: string().required("Score is required."),
})

export const instructorFilter = object({
  bankName: string().optional(),
})

export const countrySchema = object({
  name: string().trim().required("Please enter country name."),
  code: string().trim().required("Please enter code."),
  ISOCode2: string()
    .length(2, "Please enter a two letter ISO code.")
    .trim()
    .matches(/^[\sA-z]+$/, "Please enter a valid two letter ISO code.")
    .required("Please enter a two letter ISO code."),
  ISOCode3: string()
    .length(3, "Please enter a three letter ISO code.")
    .trim()
    .matches(/^[\sA-z]+$/, "Please enter a valid three letter ISO code.")
    .required("Please enter a three letter ISO code."),
  ISDCode: string().trim().required("Please enter a ISD code."),
})

export const provinceSchema = object({
  name: string().trim().required("Please enter province name."),
  code: string().trim().required("Please enter code."),
  ISOCode2: string()
    .length(2, "Please enter a two letter ISO code.")
    .trim()
    .matches(/^[\sA-z]+$/, "Please enter a valid two letter ISO code.")
    .required("Please enter a two letter ISO code."),
  countryId: string().required("Please select country."),
})

export const citySchema = object({
  name: string().trim().required("Please enter city name."),
  code: string().trim().required("Please enter code."),
  country: string().trim().required("Please select country."),
  stateId: string().required("Please select province."),
})

export const zipCodeSchema = object({
  city: string().trim().required("Please select city. "),
  stateId: string().trim().required("Please select province. "),
  country: string().trim().required("Please select country. "),
  zipCode: string().required("Zip code is required. ").min(3, "Enter valid zip code.").max(11, "Enter valid zip code."),
})

export const rejectReviewSchema = object({
  rejectReason: string().required("Please enter reason of reject."),
})
