/* eslint-disable prettier/prettier */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable prettier/prettier */
import ZipCode from "components/ZipCode"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const ZipCodeIndex = ({ pageProps }) => {
  return <ZipCode {...pageProps} />
}
export default ZipCodeIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.ZIPCODE })
