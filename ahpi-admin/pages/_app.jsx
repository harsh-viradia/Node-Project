import "@knovator/masters-admin/dist/style.css"
import "../styles/fonts.css"
import "../styles/snackbar.css"
import "../styles/video-react.css"
import "react-tabs/style/react-tabs.css"
import "react-quill/dist/quill.snow.css"
import "react-image-crop/dist/ReactCrop.css"
import "../styles/globals.css"

import useAppContext from "hook/context/useAppContext"
import Head from "next/head"
import React from "react"
import { Toaster } from "react-hot-toast"
import OrbitMeta from "shared/Meta"
import AppContext from "utils/appContext"

const MyApp = (properties) => {
  const { Component, ...rest } = properties
  const value = useAppContext()

  return (
    <AppContext.Provider value={value}>
      <Head>
        <link rel="stylesheet" src="https://unpkg.com/css-tooltip" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="shortcut icon" href="/images/favicon.png" />
      </Head>
      <OrbitMeta />
      <div className="text-white text-purple-700 bg-white bg-purple-700 border-white border-purple-700 bg-yellow hover:bg-yellow hover:text-yellow text-yellow border-yellow bg-primary hover:bg-primary hover:text-primary text-primary border-primary bg-secondary hover:bg-secondary hover:text-secondary text-secondary border-secondary bg-blue hover:bg-blue hover:text-blue text-blue border-blue bg-light-gray hover:bg-light-gray hover:text-light-gray text-light-gray border-light-gray bg-light-green hover:bg-light-green hover:text-light-green text-light-green border-light-green bg-green hover:bg-green hover:text-green text-green border-green bg-dark-green hover:bg-dark-green hover:text-dark-green text-dark-green border-dark-green hover:bg-white hover:text-white bg-red hover:bg-red hover:text-red text-red border-red bg-pink hover:bg-pink hover:text-pink text-pink border-pink bg-light-yellow hover:bg-light-yellow hover:text-light-yellow text-light-yellow border-light-yellow bg-light-pink hover:bg-light-pink hover:text-light-pink text-light-pink border-light-pink bg-dark-primary hover:bg-dark-primary hover:text-dark-primary text-dark-primary border-dark-primary bg-foreground hover:bg-foreground hover:text-foreground text-foreground border-foreground bg-dark-gray hover:bg-dark-gray hover:text-dark-gray text-dark-gray border-dark-gray hover:bg-purple-700 hover:text-purple-700 bg-cyan hover:bg-cyan hover:text-cyan text-cyan border-cyan" />
      <Component {...rest} />
      <Toaster />
    </AppContext.Provider>
  )
}

export default MyApp
