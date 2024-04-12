/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable sonarjs/cognitive-complexity */

import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

const isLocalhost = Boolean(
  typeof location !== "undefined" &&
    (location.hostname === "localhost" ||
      location.hostname === "[::1]" ||
      /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})){3}$/.test(location.hostname))
)
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing
        if (installingWorker === undefined) {
          return
        }
        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              console.log(
                "New content is available and will be used when all " +
                  "tabs for this page are closed. See https://bit.ly/CRA-PWA."
              )
              if (config && config.onUpdate) {
                config.onUpdate(registration)
              }
            } else {
              console.log("Content is cached for offline use.")
              if (config && config.onSuccess) {
                config.onSuccess(registration)
              }
            }
          }
        })
      })
      return ""
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error)
    })
}
function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl)
    .then((response) => {
      const contentType = response.headers.get("content-type")
      if (response.status === 404 || (contentType !== undefined && !contentType.includes("javascript"))) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload()
            return ""
          })
          return ""
        })
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config)
      }
      return ""
    })
    .catch(() => {
      console.log("No internet connection found. App is running in offline mode.")
    })
}
export function register(config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const publicUrl = new URL(publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL, window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      return
    }

    window.addEventListener("load", () => {
      const swUrl = `${publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL}/firebase-messaging-sw.js`

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config)
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "This web app is being served cache-first by a service " +
              "worker. To learn more, visit https://bit.ly/CRA-PWA"
          )
          return ""
        })
      } else {
        registerValidSW(swUrl, config)
      }
    })
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister()
      return ""
    })
  }
}
