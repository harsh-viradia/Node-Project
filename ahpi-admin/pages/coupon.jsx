import Coupon from "components/Coupon"
import React from "react"
import privateRoute from "utils/privateRoute"

const CouponIndex = ({ pageProps }) => {
  return <Coupon {...pageProps} />
}
export default CouponIndex
export const getServerSideProps = privateRoute({ moduleName: false })
