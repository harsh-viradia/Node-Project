import AddCourse from "components/Courses/AddCourse"
import React from "react"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const AddCourseIndex = ({ pageProps }) => {
  return <AddCourse {...pageProps} />
}
export default AddCourseIndex
export const getServerSideProps = privateRoute({
  moduleName: MODULES.COURSE,
  moduleActionName: MODULE_ACTIONS.GET,
})
