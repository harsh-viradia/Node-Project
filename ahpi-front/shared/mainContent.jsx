import React from "react"
import useCollapse from "react-collapsed"
import ReactTooltip from "react-tooltip"

import DownIcon from "../icons/downicon"

const MainContent = ({ x, children, open }) => {
  const { getCollapseProps, getToggleProps } = useCollapse({ defaultExpanded: open })

  return (
    <div>
      <div className="flex items-center justify-between" {...getToggleProps()}>
        <div className="w-full">{x}</div>
        <DownIcon />
        <ReactTooltip />
      </div>
      <div {...getCollapseProps()}>
        <div className="py-2">
          <div className="grid gap-3 text-sm rounded-lg">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default MainContent
