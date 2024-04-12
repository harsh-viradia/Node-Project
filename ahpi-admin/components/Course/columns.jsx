/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from "react"
import ToggleButton from "widgets/toggle"

const courseColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        // Cell: ({ row }) => <div>{(other.currentPage - 1) * other.perPage + row.index + 1}</div>,
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Image",
        accessor: "image",
      },
      {
        Header: "Partner",
        accessor: "instructor",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Lesson",
        accessor: "lesson",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Preview",
        accessor: "preview",
      },
      {
        Header: "Active",
        accessor: "isActive",
        style: {
          width: 64,
          maxWidth: 64,
        },
        Cell: ({ row: { original = {} } }) => {
          return (
            <div className="text-center">
              <ToggleButton
                original={original}
                actionProps={{ module: "student" }}
                // getList={getList}
                // pagination={{
                //   offset: other?.offset,
                //   perPage: other?.perPage,
                // }}
              />
            </div>
          )
        },
      },
      {
        Header: "Action",
        accessor: "action",
      },
    ],
    []
  )
  return { columns }
}

export default courseColumns
