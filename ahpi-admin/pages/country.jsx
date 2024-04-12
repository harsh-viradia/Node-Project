import Country from "components/Country"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const CountryIndex = ({ pageProps }) => {
  return <Country {...pageProps} />
}
export default CountryIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.COUNTRY })
