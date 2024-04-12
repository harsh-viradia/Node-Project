import commonApi from "api/index"
import Certificate from "components/Certificate/index"
import React from "react"
// import { CACHE_KEY } from "utils/constant"
// import routes from "utils/routes"

const CertificateIndex = ({ certificateData, materialData }) => {
  return <Certificate certificateData={JSON.parse(certificateData)} materialData={JSON.parse(materialData)} />
}

export default CertificateIndex
export async function getServerSideProps(context) {
  const {
    params: { code },
    locale,
  } = context
  const [certificate] = await Promise.all([
    commonApi({
      action: "getCertificate",
      parameters: [code],
      config: { locale },
    }),
  ])
  if (!certificate?.[1]?.data) {
    // return {
    //   redirect: {
    //     permanent: false,
    //     // destination: `${routes.home}`,
    //     destination: `${routes.certificatenotfound}`,
    //   },
    // }
    return {
      props: {
        certificateData: false,
        materialData: false,
      },
    }
  }
  const [sectionData] = await Promise.all([
    commonApi({
      action: "getSection",
      parameters: [certificate?.[1]?.data?.courseId?.slug],
      config: {
        locale,
        // headers: {
        //   [CACHE_KEY.KEY.CASHING_KEY]: `section_${certificate?.[1]?.data?.courseId?.slug}`,
        // },
      },
    }),
  ])
  const [certificateData, materialData] = await Promise.all([
    JSON.stringify(certificate?.[1]?.data || {}),
    JSON.stringify(sectionData?.[1]?.data || {}),
  ])
  return { props: { certificateData, materialData } }
}
