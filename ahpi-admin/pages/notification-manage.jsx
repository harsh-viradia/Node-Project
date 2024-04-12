import NotificationManage from "components/NotificationManage"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const NotificationManageIndex = ({ pageProps }) => {
  return <NotificationManage {...pageProps} />
}
export default NotificationManageIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.NOTIFICATION })
