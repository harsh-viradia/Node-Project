import Certificate from "components/Certificate"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const CertificateIndex = ({ pageProps }) => {
  return <Certificate {...pageProps} />
}
export default CertificateIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.CERTIFICATE })
