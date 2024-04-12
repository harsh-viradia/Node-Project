import DeleteIcon from "icons/deleteIcon"
import React from "react"
import ReactTooltip from "react-tooltip"
import OrbitLink from "widgets/orbitLink"

const ProductCard = ({ item = {}, ...other }) => {
  const { courseImage, courseCategory, courseTitle, coursePrice, courseDescription } = item
  return (
    <div
      className="flex items-start p-3 overflow-hidden bg-white border rounded-md cursor-pointer border-gray hover:shadow hover:border-primary tansition-all"
      {...other}
    >
      <img src={courseImage} className="object-cover object-center h-full" width="112" height="112" alt="card" />
      <div className="flex flex-col pl-2 pt-0.5">
        <p className="mb-1 text-xs text-gray">{courseCategory}</p>
        <h3 className="mb-1 text-base font-bold leading-6 text-black max-w-max truncate">{courseTitle}</h3>
        <div className="mb-2 line-clam-2">
          <p className="text-xs text-gray">{courseDescription}</p>
        </div>
        <div className="flex gap-4">
          <p className="text-base font-bold text-primary">INR {coursePrice}</p>
          <OrbitLink className="self-center">
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

export default ProductCard
