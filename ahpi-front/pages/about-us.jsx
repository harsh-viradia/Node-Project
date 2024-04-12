import AboutUs from "components/AboutUs"
import React from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"

const AboutUsIndex = () => {
  return (
    <LayoutWrapper>
      <AboutUs />
    </LayoutWrapper>
  )
}

export default AboutUsIndex

// const AboutUsIndex = ({ pageProps }) => {
//   return <AboutUs data={pageProps.data} />
// }

// export default AboutUsIndex

// export async function getServerSideProps({ locale }) {
//   const data = await commonApi({
//     action: "settings",
//     parameters: [locale === LOCALES.INDONESIAN ? SETTINGS_CODE.aboutUsID : SETTINGS_CODE.aboutUs],
//     config: { locale },
//   })
//   return { props: { pageProps: data[1] } }
// }
