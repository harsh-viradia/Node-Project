import Student from "components/Student"
import React from "react"
import privateRoute from "utils/privateRoute"

const ApplicantIndex = ({ pageProps }) => {
  return <Student {...pageProps} />
}
export default ApplicantIndex
export const getServerSideProps = privateRoute()
