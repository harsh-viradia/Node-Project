import ReviewManage from "components/Reviews"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const instructorManageIndex = ({ pageProps }) => {
  return <ReviewManage {...pageProps} />
}
export default instructorManageIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.REVIEWS })
