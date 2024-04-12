import HomepageBuilder from "components/HomepageBuilder"
import React from "react"
import privateRoute from "utils/privateRoute"

const ApplicantIndex = ({ pageProps }) => {
  return <HomepageBuilder {...pageProps} />
}
export default ApplicantIndex
export const getServerSideProps = privateRoute()
