import React from "react"
import useCollapse from "react-collapsed"
import ReactTooltip from "react-tooltip"

import DownIcon from "../icons/downicon"
import OrbitLink from "../widgets/orbitLink"

const Content = ({ x, open }) => {
  const { getCollapseProps, getToggleProps } = useCollapse({ defaultExpanded: open })

  return (
    <div>
      <div className="flex items-center justify-between" {...getToggleProps()}>
        <div className="w-full">
          <p className="font-semibold">{x.title}</p>
        </div>
        <DownIcon />
        <ReactTooltip />
      </div>
      <div {...getCollapseProps()}>
        <div className="py-2">
          <div className="grid gap-3 text-sm rounded-lg">
            {x?.content?.map((y) => (
              <OrbitLink href="#">{y.name}</OrbitLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content
