/* eslint-disable sonarjs/no-duplicate-string */
import React from "react"

// import SmallCloseIcon from "../../icons/smallCloseIcon"
// import OrbitLink from "../../widgets/orbitLink"

const FilterTag = ({ lablel }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs border rounded-md cursor-pointer border-light-gray text-dark-gray group hover:border-primary hover:text-primary">
      {lablel}
      {/* <OrbitLink href="#">
        <SmallCloseIcon className="text-dark-gray group-hover:text-primary" size="8" />
      </OrbitLink> */}
    </div>
  )
}

export default FilterTag
