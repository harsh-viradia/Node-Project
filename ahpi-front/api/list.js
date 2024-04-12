const baseUrl = "client"

export const apiList = {
  imgUpload: { url: () => "file/upload", method: "POST", noPrefix: true },
  getProfile: { url: () => "users/profile", method: "POST", noPrefix: true },
  getCategory: { url: () => "category/list", method: "POST" },
  getWidget: { url: () => "pages/home", method: "GET" },
  addToCart: { url: (id, fcmToken) => `cart/add?deviceToken=${id}&fcmToken=${fcmToken}`, method: "PUT" },
  applyCoupon: { url: (id, fcmToken) => `coupon/apply?deviceToken=${id}&fcmToken=${fcmToken}`, method: "PUT" },
  addToWishList: { url: () => "wishlist/save", method: "POST" },
  addToCourseView: { url: () => "wishlist/view-course", method: "POST" },
  getCart: { url: () => "cart", method: "GET" },
  deleteCartItem: { url: (id, fcmToken) => `cart/remove?deviceToken=${id}&fcmToken=${fcmToken}`, method: "PUT" },
  userUpdateProfile: { url: (id) => `learner/update/${id}`, method: "PUT" },
  courseDetail: { url: (id) => `courses/${id}`, method: "GET" },
  getSection: { url: (id) => `courses/sections/${id}`, method: "GET" },
  getSeoData: { url: (module, category) => `seo/get/${module}/${category}`, method: "GET" },
  orderCreate: { url: () => `order/create`, method: "POST" },
  myLearning: { url: () => `my-learning`, method: "POST" },
  getWishlist: { url: () => `wishlist`, method: "POST" },
  getCategoryDetail: { url: (id) => `courses?deviceToken=${id}`, method: "POST" },
  courseFilter: { url: (id) => `courses/filter?deviceToken=${id}`, method: "POST" },
  getReviewList: { url: () => `reviews`, method: "POST" },
  addReview: { url: () => `reviews/create`, method: "POST" },
  payMidTrans: { url: () => `payment/url`, method: "POST" },
  orderGet: { url: (id) => `order/get/${id}`, method: "GET" },
  courseProgress: { url: () => `progress/update`, method: "PUT" },
  quizStart: { url: () => `quiz/start`, method: "POST" },
  saveQuestion: { url: () => `quiz/save-question`, method: "POST" },
  submitQuiz: { url: () => `quiz/submit`, method: "POST" },
  cartCount: { url: () => `cart/count`, method: "GET" },
  purchaseHistory: { url: () => `order`, method: "POST" },
  getCertificate: { url: (code) => `my-learning/certificate/${code}`, method: "GET" },
  settings: { url: (code) => `settings/${code}`, method: "GET" },
  addAddress: { url: () => `address/create`, method: "POST" },
  updateAddress: { url: (id) => `address/update/${id}`, method: "PUT" },
  getAddress: { url: (id) => `address/${id}`, method: "GET" },
  makeDefaultAddress: { url: (id) => `address/partial-update/${id}`, method: "PATCH" },
  deleteAddress: { url: () => `address/soft-delete`, method: "PUT" },
  addressList: { url: () => `address`, method: "POST" },
  floatingList: { url: () => `notification/floating/list`, method: "GET" },
  generalNotification: { url: () => `notification/general/list`, method: "POST" },
  changePassword: { url: () => `user/auth/change-password`, method: "PUT", noPrefix: true },
  notificationCount: { url: () => `notification/general/count`, method: "GET" },
  markNotificationAsRead: { url: (id) => `notification/partial-update/${id}`, method: "PATCH" },
  commonPost: { url: (module) => `${module}`, method: "POST" },
  generateTrans: { url: () => `paytm/web/api/v1/generate-trans`, method: "POST", noPrefix: true },
  getMasterList: { url: () => "admin/masters/list", method: "POST", noPrefix: true },
  logout: { url: () => "user/auth/logout", method: "POST", noPrefix: true },
}
export const apiGuestList = {
  getCategory: { url: () => "category/list/guest", method: "POST" },
  getWidget: { url: () => "pages/guest/home", method: "GET" },
  addToCart: { url: (id, fcmToken) => `cart/add/guest?deviceToken=${id}&fcmToken=${fcmToken}`, method: "PUT" },
  applyCoupon: { url: (id, fcmToken) => `coupon/apply/guest?deviceToken=${id}&fcmToken=${fcmToken}`, method: "PUT" },
  getCart: { url: () => "cart/guest", method: "GET" },
  deleteCartItem: { url: (id, fcmToken) => `cart/remove/guest?deviceToken=${id}&fcmToken=${fcmToken}`, method: "PUT" },
  courseDetail: { url: (id) => `courses/guest/${id}`, method: "GET" },
  getSection: { url: (id) => `courses/sections/guest/${id}`, method: "GET" },
  getSeoData: { url: (module, category) => `seo/get/guest/${module}/${category}`, method: "GET" },
  getCategoryDetail: { url: (id) => `courses/guest?deviceToken=${id}`, method: "POST" },
  courseFilter: { url: (id) => `courses/filter/guest?deviceToken=${id}`, method: "POST" },
  getReviewList: { url: () => `reviews/guest`, method: "POST" },
  cartCount: { url: () => `cart/count/guest`, method: "GET" },
  getCertificate: { url: (code) => `my-learning/certificate/${code}`, method: "GET" },
  settings: { url: (code) => `settings/${code}`, method: "GET" },
  floatingList: { url: () => `notification/floating/list/guest`, method: "GET" },
  getMasterList: { url: () => "admin/masters/list", method: "POST", noPrefix: true },
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
  registration: {
    url: () => "user/auth/register",
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
  countryCode: {
    url: () => "admin/country/all",
    method: "POST",
    noPrefix: true,
  },
  loginResendOtp: {
    url: () => "api/user/resendOtp",
    method: "POST",
    noPrefix: true,
  },

  authchangePassword: {
    url: () => `${baseUrl}/auth/change-password`,
    method: "POST",
    noPrefix: true,
  },
  logout: {
    url: () => `${baseUrl}/auth/logout`,
    method: "POST",
    noPrefix: true,
  },

  authgetProfile: {
    url: () => `/${baseUrl}/auth/get-profile`,
    method: "GET",
    noPrefix: true,
  },
  updateProfile: {
    url: () => `${baseUrl}/auth/update-profile`,
    method: "POST",
    noPrefix: true,
  },
}
