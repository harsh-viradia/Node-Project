/* eslint-disable camelcase */
import commonApi from "api/index"
import MyLearning from "components/MyLearning"
import { getCookie } from "cookies-next"
import React from "react"
import { DEFAULT_LIMIT } from "utils/constant"
import routes from "utils/routes"

const MyLearningIndex = ({ myLearning }) => {
  return <MyLearning myLearning={JSON.parse(myLearning)} />
}

export default MyLearningIndex
export async function getServerSideProps({ req, res, query, locale }) {
  const token = getCookie("token", { req, res })

  if (!token) {
    return {
      redirect: {
        destination: routes.home,
        permanent: false,
      },
    }
  }
  const { page, search, tab } = query
  const [myLearningData] = await Promise.all(
    tab === "wishList"
      ? [
          commonApi({
            action: "getWishlist",
            config: {
              token,
              locale,
            },
            data: {
              options: { page: page || 1, limit: DEFAULT_LIMIT, sort: { createdAt: -1 } },
              query: { search: search || undefined, searchColumns: ["courseNm"] },
            },
          }),
        ]
      : tab === "completed"
      ? [
          commonApi({
            action: "myLearning",
            config: {
              token,
              locale,
            },
            data: {
              options: { page: page || 1, limit: DEFAULT_LIMIT, sort: { createdAt: -1 } },
              query: { sts: 2, search: search || undefined, searchColumns: ["course.title", "course.briefDesc"] },
            },
          }),
        ]
      : [
          commonApi({
            action: "myLearning",
            config: {
              token,
              locale,
            },
            data: {
              options: { page: page || 1, limit: DEFAULT_LIMIT, sort: { createdAt: -1 } },
              query: { search: search || undefined, searchColumns: ["course.title", "course.briefDesc"] },
            },
          }),
        ]
  )
  const [myLearning] = await Promise.all([JSON.stringify(myLearningData?.[1]?.data || {})])
  return { props: { myLearning } }
}
