import ImportAllData from "components/KmRegistration"
import React from "react"
import privateRoute from "utils/privateRoute"

const KmRegistrationIndex = ({ pageProps }) => {
  return <ImportAllData {...pageProps} />
}
export default KmRegistrationIndex
export const getServerSideProps = privateRoute()
