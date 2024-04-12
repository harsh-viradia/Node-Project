import ViewPauOutManage from "components/Payout/viewPayout"
import React from "react"
import privateRoute from "utils/privateRoute"

const ViewPayout = ({ pageProps }) => {
  return <ViewPauOutManage {...pageProps} />
}
export default ViewPayout
export const getServerSideProps = privateRoute()
