import Dashboard from "components/Dashboard"
import React from "react"
import privateRoute from "utils/privateRoute"

const DashboardPage = ({ pageProps }) => {
  return <Dashboard {...pageProps} />
}
export default DashboardPage
export const getServerSideProps = privateRoute()
