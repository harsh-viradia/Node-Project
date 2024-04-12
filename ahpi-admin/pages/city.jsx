/* eslint-disable unicorn/prevent-abbreviations */
import City from "components/City"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const CityIndex = ({ pageProps }) => {
  return <City {...pageProps} />
}
export default CityIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.CITY })
