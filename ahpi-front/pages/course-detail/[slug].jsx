/* eslint-disable no-underscore-dangle */
import commonApi from "api/index"
import CourseDetail from "components/CourseDetails/index"
import { getCookies } from "cookies-next"
import { withSessionSsr } from "lib/withSession"
import React from "react"
// import { CACHE_KEY } from "utils/constant"
import routes from "utils/routes"

const CourseDetailsIndex = ({ courseDetails = {}, section = [], reviewWithPagination }) => {
  return (
    <CourseDetail
      courseDetails={JSON.parse(courseDetails)}
      section={JSON.parse(section)}
      reviewWithPagination={JSON.parse(reviewWithPagination)}
    />
  )
}

export default CourseDetailsIndex
export const getServerSideProps = withSessionSsr(async ({ req, res, params, locale }) => {
  const { deviceToken = "", token = "" } = getCookies({ req, res })
  const { slug } = params
  const { session } = req
  const [courseDetailsData, sectionData] = await Promise.all([
    commonApi({
      action: "courseDetail",
      config: {
        token,
        locale,
        // headers: {
        //   [CACHE_KEY.KEY.CASHING_KEY]: `course_${slug}`,
        // },
      },
      parameters: [slug],
      data: { deviceToken },
    }),
    commonApi({
      action: "getSection",
      config: {
        token,
        locale,
        // headers: {
        //   [CACHE_KEY.KEY.CASHING_KEY]: `section_${slug}`,
        // },
      },
      parameters: [slug],
    }),
  ])
  if (!courseDetailsData?.[1]?.data?.[0]?.slug) {
    return {
      redirect: {
        permanent: false,
        destination: `${routes.home}`,
      },
    }
  }
  if (courseDetailsData?.[1]?.data?.[0]?.isPurchased) {
    return {
      redirect: {
        permanent: false,
        destination: `${routes.myLearning}/${slug}`,
      },
    }
  }
  if (token && session?.user?.id) {
    commonApi({
      action: "addToCourseView",
      config: {
        token,
        locale,
      },
      data: {
        type: 2,
        userId: session?.user?.id,
        // eslint-disable-next-line no-underscore-dangle
        courseId: courseDetailsData?.[1]?.data?.[0]?._id,
        courseNm: courseDetailsData?.[1]?.data?.[0]?.title,
      },
    }).catch(() => {})
  }
  const [reviewWithPaginationParse] = await Promise.all([
    commonApi({
      action: "getReviewList",
      config: {
        token,
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
  return { props: { courseDetails, section, reviewWithPagination } }
})
