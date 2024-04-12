import commonApi from "api/index"
import Category from "components/Category"
import { getCookie } from "cookies-next"
import React from "react"
// import { CACHE_KEY } from "utils/constant"

const CategoryIndex = ({ metaData, categoryDetail }) => {
  return (
    <div>
      <Category metaData={JSON.parse(metaData)} categoryDetail={JSON.parse(categoryDetail)} />
    </div>
  )
}

export async function getServerSideProps({ req, res, query, params, locale }) {
  const deviceToken = getCookie("deviceToken", { req, res })
  const payload = {
    options: {
      page: 1,
      limit: 8,
      sort: {
        createdAt: -1,
      },
    },
    query: {
      searchColumns: ["title", "briefDesc"],
      search: query?.search,
      isActive: true,
    },
    filter: {
      categories: query?.search ? [] : [query?.slug],
      levels: [],
      lang: [],
      topics: [],
    },
  }
  const [metaRes, categoryRes] = await Promise.all([
    commonApi({
      action: "getSeoData",
      parameters: ["category", params?.slug],
      config: {
        locale,
        // headers: {
        //   [CACHE_KEY.KEY.CASHING_KEY]: CACHE_KEY.VALUE.SEO_CATEGORY,
        // },
      },
    }),
    commonApi({
      action: "getCategoryDetail",
      parameters: deviceToken ? [deviceToken] : [],
      data: { ...payload },
      config: { locale },
    }),
  ])
  const [metaData, categoryDetail] = await Promise.all([JSON.stringify(metaRes), JSON.stringify(categoryRes)])
  return { props: { metaData: metaData || {}, categoryDetail } }
}

export default CategoryIndex
