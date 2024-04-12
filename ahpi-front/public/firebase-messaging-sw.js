/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging

importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js")

self.addEventListener("notificationclick", (event) => {
  const redirectUrl = {
    GENERAL_NOTIFICATION_ALL: `/`,
    SELECTED_USER: `/`,
    WISHLIST: `/my-learning?tab=wishList`,
    CART: `/cart`,
    PREVIOUS_ORDER: `/my-learning`,
  }
  const navigationUrl = redirectUrl[event.notification?.data?.FCM_MSG?.data?.criteria] || "/"
  event.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true,
      })
      .then((clients) => clients.filter((client) => client.url.includes(navigationUrl)))
      .then((matchingClients) => {
        if (matchingClients[0]) {
          // eslint-disable-next-line promise/no-nesting
          return matchingClients[0].focus()
        }
        return clients.openWindow(navigationUrl)
      })
  )
})

firebase.initializeApp({
  apiKey: "AIzaSyBvy_BOi2sz6l-o3Og1WhbBNEekiY6VLnc",
  authDomain: "ahpi-academy-84693.firebaseapp.com",
  projectId: "ahpi-academy-84693",
  storageBucket: "ahpi-academy-84693.appspot.com",
  messagingSenderId: "222823880134",
  appId: "1:222823880134:web:bc79b92298330553a14ec7",
  measurementId: "G-8YN39Z2D4B",
})

const messaging = firebase.messaging.isSupported() ? firebase.messaging() : undefined

messaging.onBackgroundMessage((payload) => {
  const noteTitle = payload.notification
  const noteOptions = {
    body: noteTitle.body,
    icon: noteTitle.image ?? "/images/orbitLogo.png",
  }
  self.registration.showNotification(noteTitle.title, noteOptions)
})
