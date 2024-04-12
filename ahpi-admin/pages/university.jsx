import University from "components/University"
import React from "react"
import privateRoute from "utils/privateRoute"

const UniversityIndex = ({ pageProps }) => {
  return <University {...pageProps} />
}
export default UniversityIndex
export const getServerSideProps = privateRoute()
