/* eslint-disable no-undef */
/* eslint-disable unicorn/prefer-query-selector */
/* eslint-disable no-restricted-globals */
/* eslint-disable unicorn/explicit-length-check */
/* eslint-disable no-console */
import "firebase/messaging"

import commonApi from "api/index"
import { getCookie, hasCookie, setCookie } from "cookies-next"
import firebase from "firebase/app"
import getConfig from "next/config"
// import { FIREBASE_CONFIG } from "utils/constant"

try {
  if (firebase?.apps?.length) {
    firebase?.app()
  } else {
    firebase.initializeApp({
      apiKey: "AIzaSyBvy_BOi2sz6l-o3Og1WhbBNEekiY6VLnc",
      authDomain: "ahpi-academy-84693.firebaseapp.com",
      projectId: "ahpi-academy-84693",
      storageBucket: "ahpi-academy-84693.appspot.com",
      messagingSenderId: "222823880134",
      appId: "1:222823880134:web:bc79b92298330553a14ec7",
      measurementId: "G-8YN39Z2D4B",
    })
  }
} catch (error) {
  console.log(error)
}
const updateInUserApi = async (currentToken) => {
  const { data = {} } = await fetch("/api/getSession").then((response) => response.json())
  if (!data?.id) return
  await commonApi({
    action: "userUpdateProfile",
    data: { deviceToken: getCookie("deviceToken") || undefined, fcmToken: currentToken },
    parameters: [data?.id],
  })
}

const { publicRuntimeConfig } = getConfig()

const getFireBaseToken = () => {
  return firebase
    .messaging()
    .getToken({
      vapidKey: publicRuntimeConfig.NEXT_PUBLIC_GET_TOKEN_VAPIKEY,
    })
    .then((currentToken) => {
      if (currentToken) {
        setCookie("fcmToken", `${currentToken}`)
        if (hasCookie("token")) updateInUserApi(currentToken)
      } else {
        console.log("No registration token available. Request permission to generate one.")
      }
      return ""
    })
    .catch((error) => {
      console.log("An error occurred while retrieving token.", error)
    })
}

export const onMessageListener = () => {
  firebase.messaging().onMessage((payload) => {
    const noteTitle = payload.notification
    const noteOptions = {
      body: noteTitle.body,
      icon: noteTitle.image ?? "/images/orbitLogo.png",
      data: { click_action: payload?.data?.criteria },
    }
    // eslint-disable-next-line no-new
    const notification = new Notification(noteTitle?.title, noteOptions)
    notification.addEventListener("click", function (event) {
      const redirectUrl = {
        GENERAL_NOTIFICATION_ALL: `/`,
        SELECTED_USER: `/`,
        WISHLIST: `/my-learning?tab=wishList`,
        CART: `/cart`,
        PREVIOUS_ORDER: `/my-learning`,
      }
      const navigationUrl = redirectUrl[event.target?.data?.click_action] || "/"
      window.open(navigationUrl, "_self")
    })

    setTimeout(notification.close.bind(notification), 5000)
  })
}
export default getFireBaseToken
