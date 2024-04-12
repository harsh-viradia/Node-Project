import Analytics from "components/Analytics"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const AnalyticsIndex = ({ pageProps }) => {
  return <Analytics {...pageProps} />
}
export default AnalyticsIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.COURSE_ANALYTICS })
