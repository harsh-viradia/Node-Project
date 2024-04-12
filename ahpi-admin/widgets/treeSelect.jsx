/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react"
import DropdownTreeSelect from "react-dropdown-tree-select"

const TreeSelect = () => {
  const data = [
    {
      label: "Development",
      value: "1",
      children: [
        {
          label: "web-development",
          value: "webdevelopment",
        },
        {
          label: "data-science",
          value: "datascience",
        },
      ],
    },
    {
      label: "1",
      value: "Development",
      children: [
        {
          label: "web-development",
          value: "webdevelopment",
        },
        {
          label: "data-science",
          value: "datascience",
        },
      ],
    },
  ]
  return <DropdownTreeSelect data={data} className="tree-select-theme h-9" />
}

export default TreeSelect
