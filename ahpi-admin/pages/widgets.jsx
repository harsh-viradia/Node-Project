import WidgetsBuilder from "components/WidgetsBuilder"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const ApplicantIndex = ({ pageProps }) => {
  return <WidgetsBuilder {...pageProps} />
}
export default ApplicantIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.WIDGET })
