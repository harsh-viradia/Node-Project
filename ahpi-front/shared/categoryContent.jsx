/* eslint-disable no-underscore-dangle */
import React from "react"
import useCollapse from "react-collapsed"
import ReactTooltip from "react-tooltip"
import routes from "utils/routes"

import DownIcon from "../icons/downicon"
import OrbitLink from "../widgets/orbitLink"

const CategoryContent = ({ x }) => {
  const { getCollapseProps, getToggleProps } = useCollapse()

  return (
    <div>
      <div className="flex items-center justify-between" {...getToggleProps()}>
        <div className="w-full">
          <OrbitLink className="font-semibold" href={`${routes.category}/${x?.slug}?id=${x?._id}&name=${x?.name}`}>
            {x.name}
          </OrbitLink>
        </div>
        {x.subCategory?.length ? <DownIcon /> : ""}
        <ReactTooltip />
      </div>
      <div {...getCollapseProps()}>
        <div className="py-2">
          <div className="grid gap-3 text-sm rounded-lg">
            {x.subCategory.map((y) => (
              <OrbitLink href={`${routes.category}/${y?.slug}?id=${y?._id}&name=${y?.name}`}>{y.name}</OrbitLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryContent
