/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
// import ClockIcon from "icons/clockIcon"
// import CloseCircleIcon from "icons/closeCircleIcon"
// import VerifyIcon from "icons/verifyIcon"
import React, { useMemo } from "react"
import StarRatings from "react-star-ratings"
import { SYSTEM_USERS } from "utils/constant"

const CourseAnalyticsColumn = ({ user }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
      },
      {
        Header: "Course Name",
        accessor: "courseNm",
      },
      {
        Header: "No Of Purchase",
        accessor: "purchasedCourses",
      },
      {
        Header: "Primary Program",
        accessor: "parCategory.0.name",
      },
      ...(user?.role !== SYSTEM_USERS.INSTRUCTOR
        ? [
            {
              Header: "Partner",
              accessor: "fullName",
            },
          ]
        : []),
      {
        Header: "Ratings",
        accessor: "avgStarts",
        Cell: ({ row: { original } }) => {
          return original?.avgStarts === "NO" ? (
            ""
          ) : (
            <div>
              <StarRatings
                rating={original?.avgStarts}
                starDimension="17px"
                starSpacing="1px"
                starRatedColor="#f0b831"
                numberOfStars={5}
              />
            </div>
          )
        },
      },
      {
        Header: "Price (INR)",
        accessor: "courseTotalPrice",
      },
    ],
    []
  )
  return { columns }
}
export default CourseAnalyticsColumn
