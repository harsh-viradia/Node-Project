import InstructorAnalytics from "components/Instructor/InstructorAnalytics"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const InstructorAnalyticsIndex = ({ pageProps }) => {
  return <InstructorAnalytics {...pageProps} />
}
export default InstructorAnalyticsIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.INSTRUCTOR_ANALYTICS })
