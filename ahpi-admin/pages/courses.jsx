import Course from "components/Courses"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const CourseIndex = ({ pageProps }) => {
  return <Course {...pageProps} />
}
export default CourseIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.COURSE })
