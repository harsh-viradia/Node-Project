/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unstable-nested-components */
import dayjs from "dayjs"
import React, { useMemo } from "react"
import { MODULE_ACTIONS } from "utils/constant"

const kmRegistrationColumn = ({ setIgnore, isAllow, other }) => {
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
        Header: "File Name",
        accessor: "name",
      },
      {
        Header: "Import Date & Time",
        accessor: "createdAt",
        Cell: ({ row }) => (
          <div>{row?.original?.createdAt ? dayjs(row?.original?.createdAt).format("DD/MM/YYYY HH:mm:ss") : "-"}</div>
        ),
      },
      {
        Header: "Total Applicant",
        accessor: "totalUsers",
        Cell: ({ row }) =>
          row.original?.totalUsers ? (
            isAllow(MODULE_ACTIONS.GET) ? (
              <button
                onClick={() => setIgnore({ title: "Total Applicant", id: row.original?._id })}
                className="underline text-primary"
              >
                {row.original?.totalUsers}
              </button>
            ) : (
              row.original?.totalUsers
            )
          ) : (
            0
          ),
      },
      {
        Header: "New Applicant",
        accessor: "newUsers",
        Cell: ({ row }) =>
          row.original?.newUsers ? (
            isAllow(MODULE_ACTIONS.GET) ? (
              <button
                onClick={() => setIgnore({ title: "New Applicant", id: row.original?._id })}
                className="underline text-primary"
              >
                {row.original?.newUsers}
              </button>
            ) : (
              row.original?.newUsers
            )
          ) : (
            0
          ),
      },
      // {
      //   Header: "Duplicate Applicant",
      //   accessor: "duplicateUsers",
      //   Cell: ({ row }) =>
      //     row.original?.duplicateUsers ? (
      //       <button
      //         onClick={() => setIgnore({ title: "Duplicate Applicant", id: row.original?._id })}
      //         className="underline text-primary"
      //       >
      //         {row.original?.duplicateUsers}
      //       </button>
      //     ) : (
      //       0
      //     ),
      // },
      {
        Header: "Status Updated",
        accessor: "statusUpdated",
        Cell: ({ row }) =>
          row.original?.updatedUsers ? (
            isAllow(MODULE_ACTIONS.GET) ? (
              <button
                onClick={() => setIgnore({ title: "Status Updated", id: row.original?._id })}
                className="underline text-primary"
              >
                {row.original?.updatedUsers}
              </button>
            ) : (
              row.original?.updatedUsers
            )
          ) : (
            0
          ),
      },
      {
        Header: "Ignore Applicant",
        accessor: "ignoreUsers",
        Cell: ({ row }) =>
          row.original?.ignoreUsers ? (
            isAllow(MODULE_ACTIONS.GET) ? (
              <button
                onClick={() => setIgnore({ title: "Ignore Applicant", id: row.original?._id })}
                className="underline text-primary"
              >
                {row.original?.ignoreUsers}
              </button>
            ) : (
              row.original?.ignoreUsers
            )
          ) : (
            0
          ),
      },
    ],
    [other.list]
  )
  return { columns }
}

export default kmRegistrationColumn
