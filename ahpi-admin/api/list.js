const apiList = {
  login: {
    url: () => "user/auth/login",
    method: "POST",
    noPrefix: true,
  },
  loginOtp: {
    url: () => "user/auth/validate",
    method: "POST",
    noPrefix: true,
  },
  resetPassword: {
    url: () => "user/auth/update-password",
    method: "PUT",
    noPrefix: true,
  },
  forgotPassword: {
    url: () => "user/auth/get-otp",
    method: "PUT",
    noPrefix: true,
  },
  sendLoginOTP: {
    url: () => "admin/auth/login-via-otp",
    method: "POST",
  },
  loginByOTP: {
    url: () => "admin/auth/verify-login-otp",
    method: "POST",
  },
  permissionByRole: {
    url: (id) => `admin/permissions/get/${id}`,
    method: "GET",
  },
  permissionByUser: {
    url: () => `admin/permissions/get-permission`,
    method: "GET",
  },
  getProfile: {
    url: () => `users/profile`,
    method: "POST",
  },
  getMasterList: {
    url: () => "admin/masters/list",
    method: "POST",
  },
  getAddress: {
    url: () => "admin/api/v1/address",
    method: "POST",
  },
  updateProfile: { url: (id) => `admin/update/${id}`, method: "PUT" },
  permissionUpdate: { url: (id) => `admin/permissions/update/${id}`, method: "PUT" },
  imgUpload: { url: () => "file/upload", method: "POST" },
  imgDelete: { url: (id) => `file/remove/${id}`, method: "DELETE" },
  changePassword: { url: () => "user/auth/change-password", method: "PUT" },
  affiliateUniversity: { url: (id) => `admin/university/affiliate-update/${id}`, method: "PATCH" },
  findAllCountry: { url: () => "admin/country/all", method: "POST" },
  findAllStates: { url: () => "admin/state/get-state-list", method: "POST" },
  findAllCities: { url: () => "admin/city/get-city-list", method: "POST" },
  saveQuestions: { url: () => "admin/assessments/save-question", method: "POST" },
  getDocList: { url: () => "admin/student/documents/list", method: "POST" },
  uploadDoc: { url: () => "admin/student/upload/document", method: "POST" },
  verifyDocument: { url: (id) => `admin/student/verify-document/${id}`, method: "PATCH" },
  getFileHistory: { url: (id) => `/admin/file-history/get/${id}`, method: "GET" },
  getLoaCount: { url: () => "admin/loa/get-count", method: "POST" },
  updatePageWidget: { url: (id) => `admin/pages/${id}`, method: "PUT" },
  getSeoData: { url: (slug, module) => `admin/seo/get/${module}/${slug}`, method: "GET" },
  createSeo: { url: () => "admin/seo", method: "POST" },
  updateSeo: { url: (id) => `admin/seo/update/${id}`, method: "PUT" },
  basicInfo: { url: () => "admin/courses/basic-info/add", method: "POST" },
  courseInfo: { url: (id) => `admin/courses/course-info/add/${id}`, method: "PUT" },
  updateCourseInfo: { url: (id) => `admin/courses/basic-info/update/${id}`, method: "PUT" },
  addSection: { url: () => `admin/courses/sections/add`, method: "POST" },
  addMaterial: { url: () => `admin/courses/sections/materials/add`, method: "POST" },
  addQuestion: { url: () => `admin/courses/sections/materials/questions/add`, method: "POST" },
  publishCourse: { url: () => "admin/courses/publish", method: "POST" },
  getcourse: { url: (id) => `admin/courses/${id}`, method: "GET" },
  savePricing: { url: (id) => `admin/courses/price/add/${id}`, method: "PUT" },
  deleteSection: { url: () => `admin/courses/sections/delete`, method: "DELETE" },
  deleteMaterials: { url: () => `admin/courses/sections/materials/delete`, method: "DELETE" },
  deleteQuestion: { url: () => `admin/courses/sections/materials/questions/delete`, method: "DELETE" },
  partialUpdateMaterial: { url: (id) => `admin/courses/sections/materials/partial-update/${id}`, method: "PUT" },
  resendInvoice: { url: (id) => `admin/api/v1/order/send-invoice/${id}`, method: "POST" },
  videoUrls: { url: () => "file/video/urls", method: "POST" },
  completeUpload: { url: () => "file/video/complete", method: "POST" },
  videoStatus: { url: (id) => `file/status/${id}`, method: "GET" },
  sendNotification: { url: (id) => `admin/notification/send/${id}`, method: "GET" },
  salesAnalytics: { url: () => "instructor/analytics/course-slaes-wise-report", method: "POST" },
  ratingsAnalytics: { url: () => "instructor/analytics/course-rating-wise-analytics", method: "POST" },
  earnings: { url: (module) => `instructor/my-earning/${module}`, method: "POST" },
  earningsIncome: { url: () => `instructor/my-earning/incomes`, method: "GET" },
  approveCourse: { url: (id) => `admin/courses/approve-course/${id}`, method: "PATCH" },
  verifyCourse: { url: (id) => `admin/courses/verify-course/${id}`, method: "PATCH" },
  rejectCourse: { url: (id) => `admin/courses/reject-course/${id}`, method: "POST" },
  courseCountForInstructor: { url: () => `admin/courses/course-count`, method: "POST" },
  requestedCourseCount: { url: () => `admin/courses/preview-course-count`, method: "POST" },

  commonUrl: (module) => ({
    list: {
      url: () => `admin/${module}/list`,
      method: "POST",
    },
    all: {
      url: () => `admin/${module}/all`,
      method: "POST",
    },
    provinceList: {
      url: () => `admin/${module}/get-state-list`,
      method: "POST",
    },
    cityList: {
      url: () => `admin/${module}/get-city-list`,
      method: "POST",
    },
    create: {
      url: () => `admin/${module}/create`,
      method: "POST",
    },
    add: {
      url: () => `admin/${module}`,
      method: "POST",
    },
    get: {
      url: (id) => `admin/${module}/get/${id}`,
      method: "GET",
    },
    update: {
      url: (id) => `admin/${module}/update/${id}`,
      method: "PUT",
    },
    countryUpdate: {
      url: (id) => `admin/${module}/update/${id}`,
      method: "PUT",
    },
    edit: {
      url: (id) => `admin/${module}/${id}`,
      method: "PUT",
    },
    partialUpdate: {
      url: (id) => `admin/${module}/partial-update/${id}`,
      method: "PATCH",
    },
    partialUpdateCountry: {
      url: (id) => `admin/${module}/paritial-update/${id}`,
      method: "PATCH",
    },
    partialDefaultCountryUpdate: {
      url: (id) => `admin/${module}/${id}`,
      method: "PATCH",
    },
    delete: {
      url: (id) => `admin/${module}/delete/${id}`,
      method: "DELETE",
    },
    softDeleteWithId: {
      url: (id) => `admin/${module}/soft-delete/${id}`,
      method: "DELETE",
    },
    softDelete: {
      url: () => `admin/${module}/soft-delete`,
      method: "PUT",
    },
    courseDetail: {
      url: (id) => `admin/${module}/course-details/${id}`,
      method: "POST",
    },
    termsCondtion: {
      url: () => `web/api/v1/settings/${module}`,
      method: "GET",
    },
  }),
}

export default apiList
