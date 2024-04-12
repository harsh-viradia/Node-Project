import OrderManage from "components/OrderManage"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const PageIndex = ({ pageProps }) => {
  return <OrderManage {...pageProps} />
}
export default PageIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.ORDERS })
