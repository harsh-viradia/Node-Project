import InstructorManage from "components/Instructor"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const instructorManageIndex = ({ pageProps }) => {
  return <InstructorManage {...pageProps} />
}
export default instructorManageIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.INSTRUCTOR })
