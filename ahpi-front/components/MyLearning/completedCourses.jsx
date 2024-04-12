/* eslint-disable sonarjs/no-duplicate-string */
import React from "react"
import getImgUrl from "utils/util"
import Card from "widgets/card"
import Paginate from "widgets/pagination"

const AllCompletedCourses = ({ courses = [], paginate = {}, onPaginationChange = {} }) => {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-4">
        {courses.map(({ course = {}, ...other }) => {
          return (
            <Card
              src={getImgUrl(course.imgId?.uri)}
              completed
              category={course.parCategory?.[0]?.name}
              title={course.title}
              star={false}
              bestSeller={false}
              slug={course.slug}
              showCertificate
              certiCode={other.certiCode}
              certiUri={other.certiId?.uri}
              fromMyLearning
            />
          )
        })}
      </div>
      <div className="mt-5">
        <Paginate paginate={paginate} onPaginationChange={onPaginationChange} />
      </div>
    </>
  )
}

export default AllCompletedCourses
