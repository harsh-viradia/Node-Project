import PageBuilder from "components/PageBuilder"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const PageIndex = ({ pageProps }) => {
  return <PageBuilder {...pageProps} />
}
export default PageIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.PAGE })
