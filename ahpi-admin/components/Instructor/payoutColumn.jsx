/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo } from "react"
import ReactTooltip from "react-tooltip"
import { dateDisplay } from "utils/util"
import Status from "widgets/status"

const STATUSCOLOR = {
  COMPLETED: "green",
  PENDING: "yellow",
  FAILED: "red",
}

const PayoutListColumn = ({ list, paginate }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(paginate.currentPage - 1) * paginate.perPage + row.index + 1}</div>,
      },
      // {
      //   Header: "Partner Name",
      //   accessor: "user",
      //   Cell: ({ row }) => row.original.user.name,
      // },
      {
        Header: "Transfer By",
        accessor: "createdBy",
        Cell: ({ row }) => row.original.createdBy?.name || "",
      },
      {
        Header: "Amount",
        accessor: "amt",
      },
      {
        Header: "Currency",
        accessor: "currency.name",
      },
      {
        Header: "Transfer Date",
        accessor: "transferDate",
        Cell: ({ row }) => dateDisplay(row.original.transferDate),
      },
      {
        Header: "Payout Type",
        accessor: "payoutType",
        Cell: ({ row }) => (row.original.payoutType === 1 ? "Manual(By Admin)" : "Automatic(By PAYTM)"),
      },
      {
        Header: "Transaction Type",
        accessor: "trnsType",
      },
      {
        Header: "Month/Year",
        accessor: "month",
        Cell: ({ row }) => `${row.original.month || ""}/${row.original.year || ""}`,
      },
      {
        Header: "Description",
        accessor: "desc",
        Cell: ({ row }) => (
          <>
            <div className="relative inline-block" data-tip data-type="light" data-for={`discTip-${row.original._id}`}>
              <div className="truncate max-w-xs cursor-help">{row.original?.desc}</div>
            </div>
            <ReactTooltip
              border={10}
              id={`discTip-${row.original._id}`}
              place="top"
              effect="solid"
              borderColor="#dfdfdf"
              className="!p-2.5 !opacity-100 !rounded-md shadow-sm"
            >
              <div className="text-xs leading-relaxed line-clamp-5 max-w-xs whitespace-normal font-semibold">
                {row.original?.desc}
              </div>
            </ReactTooltip>
          </>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) =>
          row.original.status ? (
            <Status
              light={false}
              className="absolute inset-0 rounded-none"
              statusName={row.original.status}
              color={STATUSCOLOR[row.original.status]}
            />
          ) : (
            ""
          ),
      },
    ],
    [list]
  )
  return { columns }
}
export default PayoutListColumn
