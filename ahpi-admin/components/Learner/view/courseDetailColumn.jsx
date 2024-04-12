/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from "react"
import { COURSE_STATUS_COLOR } from "utils/constant"
import Status from "widgets/status"

const courseDetailColumn = ({ other }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(other.currentPage - 1) * other.perPage + row.index + 1}</div>,
      },
      {
        Header: "Course",
        accessor: "name",
        Cell: ({ row: { original = {} } }) => {
          return <>{original?.name || "-"}</>
        },
      },
      {
        Header: "Progress (%)",
        accessor: "progress",
        style: {
          width: 100,
          minWidth: 100,
        },
        Cell: ({ row: { original = {} } }) => {
          return <>{original?.progress}</>
        },
      },
      {
        Header: "Status",
        accessor: "sts",
        style: {
          width: 100,
          minWidth: 100,
        },
        Cell: ({ row: { original = {} } }) => {
          return (
            <Status
              statusName={original?.sts === 2 ? "COMPLETED" : "IN PROGRESS"}
              color={COURSE_STATUS_COLOR[original?.sts === 2 ? "Selesai" : "Diproses"]}
            />
          )
        },
      },
    ],
    [other.list]
  )
  return { columns }
}

export default courseDetailColumn
