/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable jsx-a11y/html-has-lang */
/* eslint-disable react/no-danger */
import "react-tabs/style/react-tabs.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "../styles/globals.css"
import "../styles/video-react.css"
import "react-quill/dist/quill.snow.css"

import * as amplitude from "@amplitude/analytics-browser"
import { hasCookie } from "cookies-next"
// import TrackDevTools from "hook/codeBlocks/useTrackInspect"
import useAppContext from "hook/context/useAppContext"
import getConfig from "next/config"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import { unregister } from "serviceWorker"
import AppContext from "utils/AppContext"
import { setDeviceId } from "utils/common"
import getFireBaseToken, { onMessageListener } from "utils/firebase"
import routes from "utils/routes"
import OrbitLoader from "widgets/loader"

const { publicRuntimeConfig } = getConfig()
const MyApp = ({ Component, pageProps }) => {
  const router = useRouter()
  const value = useAppContext()
  // const [hasMounted, setHasMounted] = useState(false)
  const [routeChanging, setRouteChanging] = useState(false)
  const LoaderRoute = ["/checkout/[orderNo]", routes.cart]

  // useEffect(() => {
  //   setHasMounted(true)
  // }, [])

  if (!hasCookie("deviceToken")) setDeviceId()
  useEffect(() => {
    if (!router.pathname.includes(routes.certificate)) {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      if (publicRuntimeConfig.NEXT_PUBLIC_ANDROID_APP_URL && /android/i.test(userAgent)) {
        window.location.replace(
          `${publicRuntimeConfig.NEXT_PUBLIC_ANDROID_APP_URL}&referrer=${btoa(window.location.href)}`
        )
      } else if (
        publicRuntimeConfig.NEXT_PUBLIC_ISO_APP_URL &&
        /iPad|iPhone|iPod/.test(userAgent) &&
        !window.MSStream
      ) {
        // window.location.replace(
        //   `${publicRuntimeConfig.NEXT_PUBLIC_ISO_APP_URL}?app-argument=${btoa(window.location.href)}`
        // )
        window.location.replace(publicRuntimeConfig.NEXT_PUBLIC_ISO_APP_URL)
      }
    }
  }, [router.pathname])
  useEffect(() => {
    if (publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING === "true") {
      amplitude.init(publicRuntimeConfig.NEXT_PUBLIC_AMPLITUDE_API_KEY)
    }
    try {
      window.Notification.requestPermission()
    } catch {
      // eslint-disable-next-line no-console
      console.log("error in requesting notification permission")
    }
    const loadFirebase = () => {
      getFireBaseToken()
      onMessageListener()
    }
    window.addEventListener("load", loadFirebase)
    window.addEventListener("beforeunload", unregister)
    return () => {
      window.removeEventListener("load", loadFirebase)
      window.removeEventListener("beforeunload", unregister)
    }
  }, [])

  useEffect(() => {
    const start = () => {
      setRouteChanging(true)
    }
    const end = () => {
      setRouteChanging(false)
    }

    router.events.on("routeChangeStart", start)
    router.events.on("routeChangeComplete", end)
    router.events.on("routeChangeError", end)

    return () => {
      router.events.off("routeChangeComplete", end)
      router.events.off("routeChangeError", end)
    }
  }, [])

  // if (!hasMounted) {
  //   return false
  // }

  return (
    <AppContext.Provider value={value}>
      <Head>
        {/* <!-- Google Tag Manager --> */}
        {publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING === "true" && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}`}
            />
            <script
              async
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', {${publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}});`,
              }}
            />
          </>
        )}
        <script src={publicRuntimeConfig.NEXT_PUBLIC_PAYTM_MERCHANTS} />
        <meta name="google" value="notranslate" />
        <link rel="stylesheet" src="https://unpkg.com/css-tooltip" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="shortcut icon" href="/images/favicon.png" />
        <title>AHPI Academy</title>
      </Head>
      {routeChanging && LoaderRoute.includes(router?.pathname) && <OrbitLoader />}
      <Component
        {...pageProps}
        className="text-white text-purple-700 bg-white bg-purple-700 border-white border-purple-700 border-thin-gray bg-yellow hover:bg-yellow hover:text-yellow text-yellow border-yellow bg-primary hover:bg-primary hover:text-primary text-primary border-primary bg-secondary hover:bg-secondary hover:text-secondary text-secondary border-secondary  bg-light-gray hover:bg-light-gray hover:text-light-gray text-light-gray border-light-gray bg-light-green hover:bg-light-green hover:text-light-green text-light-green border-light-green bg-green hover:bg-green hover:text-green text-green border-green bg-dark-green hover:bg-dark-green hover:text-dark-green text-dark-green border-dark-green hover:bg-white hover:text-white bg-red hover:bg-red hover:text-red text-red border-red bg-pink hover:bg-pink hover:text-pink text-pink border-pink bg-light-yellow hover:bg-light-yellow hover:text-light-yellow text-light-yellow border-light-yellow bg-light-pink hover:bg-light-pink hover:text-light-pink text-light-pink border-light-pink bg-dark-primary hover:bg-dark-primary hover:text-dark-primary text-dark-primary border-dark-primary bg-foreground hover:bg-foreground hover:text-foreground text-foreground border-foreground bg-dark-gray hover:bg-dark-gray hover:text-dark-gray text-dark-gray border-dark-gray hover:bg-purple-700 hover:text-purple-700 bg-cyan hover:bg-cyan hover:text-cyan text-cyan border-cyan hover:text-thin-gray hover:bg-thin-gray"
      />
      <Toaster />
      {/* <TrackDevTools /> */}
    </AppContext.Provider>
  )
}
export default MyApp
