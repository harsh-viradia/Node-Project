import InstructorEarning from "components/Instructor/MyEarning"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const EarningIndex = ({ pageProps }) => {
  return <InstructorEarning {...pageProps} />
}
export default EarningIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.MY_EARNING })
