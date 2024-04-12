import DocumentVerification from "components/DocumentVerification"
import React from "react"
import privateRoute from "utils/privateRoute"

const DocumentVerificationIndex = ({ pageProps }) => {
  return <DocumentVerification {...pageProps} />
}
export default DocumentVerificationIndex
export const getServerSideProps = privateRoute()
