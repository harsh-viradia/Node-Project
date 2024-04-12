/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import commonApi from "api/index"
import Home from "components/Home"
import { withSessionSsr } from "lib/withSession"
import React from "react"
// import { CACHE_KEY } from "utils/constant"

const page = ({ widgetList, metaData }) => {
  return <Home widgetData={widgetList} metaData={metaData} />
}
export default page

export async function getServerSideProps({ locale, res }) {
  const [metaRes, widgetRes] = await Promise.all([
    commonApi({
      action: "getSeoData",
      parameters: ["page", "home"],
      config: {
        locale,
        // headers: {
        //   [CACHE_KEY.KEY.CASHING_KEY]: CACHE_KEY.VALUE.SEO_HOME,
        // },
      },
    }),
    commonApi({
      action: "getWidget",
      config: {
        locale,
        // headers: {
        //   [CACHE_KEY.KEY.CASHING_KEY]: CACHE_KEY.VALUE.HOME,
        // },
      },
    }),
  ])
  return { props: { metaData: metaRes?.[1]?.data || {}, widgetList: widgetRes?.[1]?.data || [] } }
}
