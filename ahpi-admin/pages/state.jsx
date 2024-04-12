import Province from "components/Province"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const ProvinceIndex = ({ pageProps }) => {
  return <Province {...pageProps} />
}
export default ProvinceIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.PROVINCE })
