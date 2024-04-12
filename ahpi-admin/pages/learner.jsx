import Students from "components/Learner"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const StudentsIndex = ({ pageProps }) => {
  return <Students {...pageProps} />
}
export default StudentsIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.LEARNER })
