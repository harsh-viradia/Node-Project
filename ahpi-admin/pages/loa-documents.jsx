import LoaDocuments from "components/LoaDocuments"
import React from "react"
import privateRoute from "utils/privateRoute"

const LoaDocumentsIndex = ({ pageProps }) => {
  return <LoaDocuments {...pageProps} />
}

export default LoaDocumentsIndex
export const getServerSideProps = privateRoute()
