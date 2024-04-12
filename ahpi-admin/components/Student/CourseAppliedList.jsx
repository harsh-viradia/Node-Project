/* eslint-disable sonarjs/no-nested-template-literals */
import React from "react"
import { COURSE_STATUS_COLOR } from "utils/constant"
import Status from "widgets/status"

const CoursesAppliedList = ({ courses = "" }) => {
  return (
    <div className="flex items-center gap-1.5">
      {courses?.map((x) => (
        <Status
          statusName={`${x.courseNm}${x.stsNm ? ` : ${x.stsNm}` : ""}`}
          color={x?.stsNm ? COURSE_STATUS_COLOR[x?.stsNm] : "dark-gray"}
        />
      ))}
    </div>
  )
}

export default CoursesAppliedList
