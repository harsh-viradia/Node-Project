/* eslint-disable react/no-danger */
/* eslint-disable no-unused-vars */
import Help from "components/Help"
import Stories from "components/Home/Stories"
import TrustedCompanies from "components/Home/TrustedCompanies"
import getConfig from "next/config"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import Footer from "../footer"
import Header from "../header"
import ScrollUp from "../scrollup"
import NotificationShow from "../showNotification"

const { publicRuntimeConfig } = getConfig()
const LayoutWrapper = ({ children, meta = {} }) => {
  const router = useRouter()
  const title = meta?.title || meta?.metaTitle || publicRuntimeConfig.NEXT_PUBLIC_META_TITLE || "AHPI Academy"

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={meta?.briefDesc || meta?.metaDesc} />
        <meta name="keywords" content={meta?.keyWords} />
        <meta name="author" content={meta?.author} />
        <meta
          property="og:url"
          content={
            publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL +
            (router.locale === router.defaultLocale ? "" : `/${router.locale}`) +
            router.asPath
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta?.title || meta?.ogTitle} />
        <meta property="og:description" content={meta?.briefDesc || meta?.ogDesc} />
        <meta property="og:image" content={meta?.imguri || meta?.imgId?.uri} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL?.split("//")?.[1]} />
        <meta
          property="twitter:url"
          content={
            publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL +
            (router.locale === router.defaultLocale ? "" : `/${router.locale}`) +
            router.asPath
          }
        />
        {/* <meta property="og:video" content={meta.vidObj.mp4Url} /> */}
        <meta name="twitter:title" content={meta?.title || meta?.ogTitle} />
        <meta name="twitter:description" content={meta?.briefDesc || meta?.ogDesc} />
        <meta name="twitter:image" content={meta?.imguri || meta?.imgId?.uri} />
        <meta property="og:video" content={meta?.vidId || meta?.vidId?.vidObj?.mp4Url} />
      </Head>
      {meta?.script && <div dangerouslySetInnerHTML={{ __html: meta?.script }} />}
      <div className="flex flex-col w-full min-h-screen">
        <div className="flex flex-col">
          <NotificationShow />
          <Header />
          {children}
          {/* {storiesSec === true ? <Stories title={storiesTitle} /> : ""} */}
          {/* {companySec === true ? (
            <div className="container">
              <TrustedCompanies />
            </div>
          ) : (
            ""
          )} */}
        </div>
        {/* {helpSec === true ? <Help /> : ""} */}
        <ScrollUp />
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default LayoutWrapper
