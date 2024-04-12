/* eslint-disable sonarjs/no-duplicate-string */

import React from "react"
import getImgUrl from "utils/util"
import Card from "widgets/card"
import Paginate from "widgets/pagination"

const AllCourses = ({ courses = [], paginate = {}, onPaginationChange = {} }) => {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-4">
        {courses.map(({ course = {}, ...other }) => {
          return (
            <Card
              showProcess={!other.sts === 2}
              process={other.sts === 2 ? 0 : other.progress}
              completed={other.sts === 2}
              src={getImgUrl(course.imgId?.uri)}
              category={course.parCategory?.[0]?.name}
              title={course.title}
              star={false}
              bestSeller={false}
              status={other}
              slug={course.slug}
              fromMyLearning
              showCertificate={other.sts === 2}
              certiCode={other.certiCode}
              certiUri={other.certiId?.uri}
              // eslint-disable-next-line no-underscore-dangle
              courseId={course?._id}
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

export default AllCourses
