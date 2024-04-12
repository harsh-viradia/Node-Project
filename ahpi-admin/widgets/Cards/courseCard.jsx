import DeleteIcon from "icons/deleteIcon"
import React from "react"
import ReactHtmlParser from "react-html-parser"
import ReactTooltip from "react-tooltip"
import OrbitLink from "widgets/orbitLink"

const CourseCard = ({ item = {}, remove = () => {}, ...other }) => {
  const { imgId, title, desc, price, value } = item
  return (
    <div
      className="flex items-start p-3 overflow-hidden bg-white border rounded-md cursor-pointer border-gray hover:shadow hover:border-primary tansition-all"
      {...other}
    >
      <img
        src={imgId?.uri || "/images/logo.png"}
        className="object-cover object-center h-full bg-dark-gray"
        width="112"
        height="112"
        alt="card"
      />
      <div className="flex flex-col pl-2 pt-0.5">
        {/* <p className="mb-1 text-xs text-gray">{courseCategory}</p> */}
        <h3 className="mb-1 text-base font-bold leading-6 text-black max-w-xs 2xl:max-w-lg truncate">{title}</h3>
        <div className="max-w-xs 2xl:max-w-lg mb-2 line-clam-2">
          <p className="text-xs text-gray">{ReactHtmlParser(desc)}</p>
        </div>
        <div className="flex gap-4">
          <p className="text-base font-bold text-primary">INR {price?.sellPrice || "-"}</p>
          <OrbitLink onClick={() => remove(value)} className="self-center">
            <span data-tip="Remove" className="text-xs text-red">
              <DeleteIcon size="14" />
              <ReactTooltip effect="solid" />
            </span>
          </OrbitLink>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
