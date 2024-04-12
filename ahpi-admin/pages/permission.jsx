import Permission from "components/RolesAndPermission/Permission"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const PermissionIndex = ({ pageProps }) => {
  return <Permission {...pageProps} />
}
export default PermissionIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.PERMISSION })
