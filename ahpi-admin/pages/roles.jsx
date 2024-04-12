import Roles from "components/RolesAndPermission/Roles"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const RolesIndex = ({ pageProps }) => {
  return <Roles {...pageProps} />
}
export default RolesIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.ROLE })
