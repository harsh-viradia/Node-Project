import Head from "next/head"
import React from "react"

const OrbitMeta = ({ title = process.env.NEXT_PUBLIC_META_TITLE }) => (
  <Head title={title || "AHPI Academy"} crossOrigin="yes" nonce="">
    <title>{title || "AHPI Academy"}</title>
  </Head>
)

export default OrbitMeta
