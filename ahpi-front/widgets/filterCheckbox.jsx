/* eslint-disable no-underscore-dangle */
import React from "react"
import StarRatings from "react-star-ratings"

const Checkbox = ({ title, id, checked, onChange, parentCode = "", selectId, code }) => {
  return (
    <div className="flex items-center gap-3">
      <input
        type={parentCode === "RATINGS" ? "Radio" : "checkbox"}
        id={id || title}
        name={title}
        checked={parentCode === "RATINGS" ? id === selectId?._id && checked : checked}
        onChange={onChange}
      />
      {title && (
        <>
          {parentCode === "RATINGS" && (
            <StarRatings
              rating={Number(code)}
              numberOfStars={5}
              starDimension="20px"
              starSpacing="1px"
              starRatedColor="#f0b831"
            />
          )}
          <label className="text-sm inline-block text-foreground normal-case cursor-pointer" htmlFor={id || title}>
            {parentCode ? title : `${title} ₹`}
          </label>
        </>
      )}
    </div>
  )
}

export default Checkbox
