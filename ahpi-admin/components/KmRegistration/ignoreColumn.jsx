/* eslint-disable react/no-unstable-nested-components */
import React from "react"

const ignoreColumn = ({ title }) => [
  {
    Header: "#",
    accessor: "no",
    style: {
      width: 42,
      minWidth: 42,
    },
    Cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    Header: "Name",
    accessor: "firstName",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  ...(title === "Ignore Applicant"
    ? [
        {
          Header: "Remark",
          accessor: "reasonNm",
        },
      ]
    : []),
]

export default ignoreColumn
