import React from "react"
import ReactTooltip from "react-tooltip"
import { dateDisplay } from "utils/util"

const CoursesAppliedList = ({ documents }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {documents?.map((x) => (
        <a download={x?.fileId?.[0]?.name} href={x?.fileId?.[0]?.uri} target="_blank" rel="noreferrer">
          <div
            data-tip={x?.reason}
            data-for="courseReason"
            className={`inline-flex items-center text-[10px] font-semibold border ${
              x.isVerified === true
                ? "bg-light-green border-light-green"
                : x.isVerified === false
                ? "bg-red border-red"
                : "bg-light-gray border-gray"
            } rounded-md bg-opacity-20 w-fit`}
          >
            <span className="py-1 px-1.5 truncate">
              {x?.fileId?.[0]?.name} ({x.fileId[0].createdAt ? dateDisplay(x.fileId[0].createdAt) : ""})
            </span>
          </div>
        </a>
      ))}
      <ReactTooltip effect="solid" className="tooltips" multiline id="courseReason" />
    </div>
  )
}

export default CoursesAppliedList
