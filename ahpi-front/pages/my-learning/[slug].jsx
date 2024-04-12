/* eslint-disable no-underscore-dangle */
import commonApi from "api/index"
import ContinueCourse from "components/MyLearning/CourseContent/index"
import { getCookies } from "cookies-next"
import React from "react"
// import { CACHE_KEY } from "utils/constant"
import routes from "utils/routes"

const CourseDetailsIndex = ({ courseDetails, section, reviewWithPagination, token, isFromAdmin }) => {
  return (
    <ContinueCourse
      courseDetails={JSON.parse(courseDetails)}
      section={JSON.parse(section)}
      reviewWithPagination={JSON.parse(reviewWithPagination)}
      token={token}
      isFromAdmin={isFromAdmin}
    />
  )
}

export default CourseDetailsIndex
export async function getServerSideProps({ req, res, params, query, locale }) {
  const { deviceToken = "", token = "" } = getCookies({ req, res })
  const redirectToken = query?.token || token
  const isFromAdmin = !!query?.isFromAdmin
  if (!redirectToken) {
    return {
      redirect: {
        destination: routes.home,
        permanent: false,
      },
    }
  }

  const { slug } = params
  const [courseDetailsData, sectionData] = await Promise.all([
    commonApi({
      action: "courseDetail",
      config: {
        token: redirectToken,
        locale,
        // headers: {
        //   [CACHE_KEY.KEY.CASHING_KEY]: `course_${slug}`,
        // },
      },
      parameters: [slug],
      data: { deviceToken, isFromAdmin: isFromAdmin ? 1 : undefined },
    }),
    commonApi({
      action: "getSection",
      config: {
        token: redirectToken,
        locale,
        // headers: {
        //   [CACHE_KEY.KEY.CASHING_KEY]: `section_${slug}`,
        // },
      },
      parameters: [slug],
      data: { isFromAdmin: isFromAdmin ? 1 : undefined },
    }),
  ])
  if (courseDetailsData[0]) {
    return {
      redirect: {
        permanent: false,
        destination: `${routes.home}/?token=${redirectToken}`,
      },
    }
  }
  if (!courseDetailsData?.[1]?.data?.[0]?._id) {
    return {
      redirect: {
        permanent: false,
        destination: isFromAdmin ? routes.home : routes.myLearning,
      },
    }
  }
  if (!isFromAdmin && !courseDetailsData?.[1]?.data?.[0]?.isPurchased) {
    return {
      redirect: {
        permanent: false,
        destination: `${routes.courseDetail}/${slug}`,
      },
    }
  }

  const [reviewWithPaginationParse] = await Promise.all([
    commonApi({
      action: "getReviewList",
      config: {
        token: redirectToken,
        locale,
      },
      data: {
        query: { courseId: courseDetailsData?.[1]?.data?.[0]?._id, isActive: true, stars: { $gt: 0 } },
        options: {
          page: 1,
          limit: 10,
          sort: {
            createdAt: -1,
          },
          populate: [
            {
              path: "userId",
              populate: { path: "profileId" },
              select: "profileId",
            },
          ],
        },
      },
    }),
  ])

  const [courseDetails, section, reviewWithPagination] = await Promise.all([
    JSON.stringify(courseDetailsData?.[1]?.data?.[0] || {}),
    JSON.stringify(sectionData?.[1]?.data || []),
    JSON.stringify(reviewWithPaginationParse?.[1]?.data || []),
  ])
  return { props: { courseDetails, section, reviewWithPagination, token: redirectToken, isFromAdmin } }
}
