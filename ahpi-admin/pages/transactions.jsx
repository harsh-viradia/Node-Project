import TransactionsIndex from "components/Transactions"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const PageIndex = ({ pageProps }) => {
  return <TransactionsIndex {...pageProps} />
}
export default PageIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.TRANSACTIONS })
