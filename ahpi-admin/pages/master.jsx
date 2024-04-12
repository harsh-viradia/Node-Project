import Master from "components/Master"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const MastersIndex = ({ pageProps }) => {
  return <Master {...pageProps} />
}
export default MastersIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.MASTER })
