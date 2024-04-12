import SubMaster from "components/SubMaster"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const Submaster = ({ pageProps }) => {
  return <SubMaster {...pageProps} />
}

export default Submaster
export const getServerSideProps = privateRoute({ moduleName: MODULES.MASTER })
