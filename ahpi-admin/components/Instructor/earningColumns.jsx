/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
// import ClockIcon from "icons/clockIcon"
// import CloseCircleIcon from "icons/closeCircleIcon"
// import VerifyIcon from "icons/verifyIcon"
import React, { useMemo } from "react"
import { decimalValue } from "utils/helper"

const EarningColumn = ({ dt }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(dt.currentPage - 1) * dt.perPage + row.index + 1}</div>,
      },
      {
        Header: "Month/Year",
        accessor: "date",
      },
      {
        Header: "Course",
        accessor: "courseName",
        Cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <img src={row?.original?.courseLogo?.[0]} className="w-10 h-10 object-cover rounded-lg" alt="" />
              <div>
                <h4 className="text-sm font-semibold">{row?.original?.title}</h4>
                <p>{row?.original?.purchased_count} Sales</p>
              </div>
            </div>
          )
        },
      },
      {
        Header: "Pending Clearance",
        accessor: "totalEarning",
        Cell: ({ row }) => decimalValue(row?.original?.totalEarning),
      },
    ],
    [dt.list]
  )
  return { columns }
}
export default EarningColumn
