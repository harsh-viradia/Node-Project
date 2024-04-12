/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
// import ClockIcon from "icons/clockIcon"
// import CloseCircleIcon from "icons/closeCircleIcon"
// import VerifyIcon from "icons/verifyIcon"
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { dateDisplay } from "utils/util"
import Status from "widgets/status"

const widgetColumn = ({ permission, ...other }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(other?.currentPage - 1) * other?.perPage + row.index + 1}</div>,
      },
      {
        Header: "Transaction Id",
        accessor: "transNo",
      },
      {
        Header: "User Name",
        accessor: "userId.name",
      },
      {
        Header: "Order Id",
        accessor: "orderId.orderNo",
      },
      {
        Header: "Date",
        accessor: "createdAt",
        Cell: ({ row: { original = {} } }) => dateDisplay(original?.createdAt),
      },
      {
        Header: "Payment Method",
        accessor: "type",
        Cell: ({ row: { original = {} } }) => {
          return <div>{original?.orderId?.usedRewardsForOrder === original?.amt ? "N/A" : original?.type}</div>
        },
      },
      {
        Header: "Amount (INR)",
        accessor: "amt",
      },
      {
        Header: "Status",
        accessor: "stsId",
        Cell: ({ row: { original = {} } }) => {
          let color = ""
          switch (original?.stsId?.code) {
            case "SUCCESS": {
              color = "dark-green"
              break
            }
            case "PENDING": {
              color = "yellow"
              break
            }
            case "FAILED": {
              color = "red"
              break
            }
            default:
              color = "dark-grey"
          }
          return <div>{!original.stsId ? "" : <Status statusName={original?.stsId?.code} color={color} />}</div>
        },
      },

      {
        Header: "Actions",
        accessor: "actions",
        style: {
          width: 100,
          maxWidth: 100,
        },
        Cell: ({ row: { original = {} } }) => (
          // eslint-disable-next-line eqeqeq
          // original?.stsId?.code === "FAILED" || original?.stsId?.code === "PENDING" || !original?.stsId?.code ? (
          //   ""
          // ) : (
          <TableActions
            original={original?.orderId}
            actionProps={{
              canEdit: false,
              canDownload: true,
              // canGenerateInvoice: true,
              canReSendInvoice: true,
              showDisabled:
                original?.stsId?.code === "FAILED" || original?.stsId?.code === "PENDING" || !original?.stsId?.code,
            }}
          />
        ),
        // ),
      },
    ],
    [other.list]
  )
  return { columns }
}
export default widgetColumn
