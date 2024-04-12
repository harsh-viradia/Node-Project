import Users from "components/User"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const UsersIndex = ({ pageProps }) => {
  return <Users {...pageProps} />
}
export default UsersIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.USER })
